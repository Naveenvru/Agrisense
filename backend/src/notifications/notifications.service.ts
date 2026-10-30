import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NotificationPreferences } from './notification-preferences.entity';
import { NotificationConsent } from './notification-consent.entity';
import { NotificationAttempt } from './notification-attempt.entity';
import { NotificationJob } from './notification-job.entity';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationConsentDto } from './dto/notification-consent.dto';

export const NOTIFICATION_DEFAULTS = {
  whatsappEnabled: false, smsEnabled: false, inAppEnabled: true,
  dailyDigestEnabled: true, marketAlertsEnabled: true, weatherAlertsEnabled: true,
  cropRemindersEnabled: true, diseaseAlertsEnabled: true, systemNotificationsEnabled: true,
  deliveryTime: '08:00', timezone: 'Asia/Kolkata', preferredLanguage: 'en-kn',
} as const;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationPreferences) private readonly preferences: Repository<NotificationPreferences>,
    @InjectRepository(NotificationConsent) private readonly consents: Repository<NotificationConsent>,
    @InjectRepository(NotificationAttempt) private readonly attempts: Repository<NotificationAttempt>,
    @InjectRepository(NotificationJob) private readonly jobs: Repository<NotificationJob>,
    private readonly config: ConfigService,
  ) {}

  async getPreferences(userId: string) {
    const prefs = await this.ensurePreferences(userId);
    const latest = await this.consents.find({ where: { userId }, order: { createdAt: 'DESC', id: 'DESC' } });
    const current = (channel: 'whatsapp' | 'sms') => latest.find((c) => c.channel === channel)?.consentStatus === 'granted';
    return { ...prefs, consent: { whatsapp: current('whatsapp'), sms: current('sms') }, languageDelivery: 'en', kannadaTemplatesVerified: false };
  }

  async getHistory(userId: string) {
    const jobs = await this.jobs.find({ where: { userId }, order: { scheduledAt: 'DESC' }, take: 100 });
    if (!jobs.length) return [];
    const attempts = await this.attempts.find({ where: jobs.map((job) => ({ jobId: job.id })), order: { attemptedAt: 'DESC' } });
    const byJob = new Map<string, NotificationAttempt[]>();
    for (const attempt of attempts) byJob.set(attempt.jobId, [...(byJob.get(attempt.jobId) ?? []), attempt]);
    return jobs.map((job) => ({
      id: job.id,
      category: job.notificationType,
      scheduledAt: job.scheduledAt,
      status: job.executionStatus,
      retryCount: job.retryCount,
      attempts: (byJob.get(job.id) ?? []).map(({ channel, status, providerMessageId, failureReason, attemptedAt }) => ({ channel, status, providerMessageId, failureReason, attemptedAt })),
    }));
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    const prefs = await this.ensurePreferences(userId);
    if (dto.timezone !== undefined && !this.isTimezone(dto.timezone)) throw new BadRequestException('Unknown timezone');
    Object.assign(prefs, dto);
    return this.preferences.save(prefs);
  }

  async grantConsent(userId: string, dto: NotificationConsentDto) {
    const prefs = await this.ensurePreferences(userId);
    await this.consents.save(this.consents.create({ userId, channel: dto.channel, consentStatus: 'granted', consentSource: dto.consentSource }));
    prefs[dto.channel === 'whatsapp' ? 'whatsappEnabled' : 'smsEnabled'] = true;
    await this.preferences.save(prefs);
    return this.getPreferences(userId);
  }

  async revokeConsent(userId: string, channel: 'whatsapp' | 'sms') {
    const prefs = await this.ensurePreferences(userId);
    await this.consents.save(this.consents.create({ userId, channel, consentStatus: 'revoked', consentSource: 'user-settings' }));
    prefs[channel === 'whatsapp' ? 'whatsappEnabled' : 'smsEnabled'] = false;
    await this.preferences.save(prefs);
    return this.getPreferences(userId);
  }

  /** WhatsApp is first; SMS is eligible only under its own active consent and preference. */
  async getDeliveryPlan(userId: string): Promise<Array<'whatsapp' | 'sms'>> {
    const prefs = await this.ensurePreferences(userId);
    const latest = await this.consents.find({ where: { userId }, order: { createdAt: 'DESC', id: 'DESC' } });
    const granted = (channel: 'whatsapp' | 'sms') => latest.find((entry) => entry.channel === channel)?.consentStatus === 'granted';
    const plan: Array<'whatsapp' | 'sms'> = [];
    if (prefs.whatsappEnabled && granted('whatsapp')) plan.push('whatsapp');
    if (prefs.smsEnabled && granted('sms')) plan.push('sms');
    return plan;
  }

  async getNextDeliveryChannel(
    userId: string,
    previousChannel?: 'whatsapp' | 'sms',
    previousAttemptFailed = false,
  ): Promise<'whatsapp' | 'sms' | null> {
    const plan = await this.getDeliveryPlan(userId);
    if (!previousChannel) return plan[0] ?? null;
    if (previousChannel === 'whatsapp' && previousAttemptFailed && plan.includes('sms')) return 'sms';
    return null;
  }

  async recordDeliveryAttempt(input: {
    jobId: string; channel: 'whatsapp' | 'sms' | 'in_app'; status: 'sent' | 'delivered' | 'failed';
    providerMessageId?: string; failureReason?: string; providerResponse?: Record<string, unknown>;
  }) {
    const job = await this.jobs.findOne({ where: { id: input.jobId } });
    if (!job) throw new BadRequestException('Notification job not found');
    const attempt = await this.attempts.save(this.attempts.create({
      jobId: input.jobId, channel: input.channel, status: input.status,
      providerMessageId: input.providerMessageId ?? null, failureReason: input.failureReason ?? null,
      providerResponse: input.providerResponse ?? null,
    }));
    job.attempts = [...(job.attempts ?? []), { channel: input.channel, status: input.status, attemptedAt: attempt.attemptedAt }];
    job.retryCount += input.status === 'failed' ? 1 : 0;
    job.executionStatus = input.status === 'failed' ? 'retry_pending' : input.status;
    await this.jobs.save(job);
    return attempt;
  }

  private async ensurePreferences(userId: string) {
    let prefs = await this.preferences.findOne({ where: { userId } });
    if (!prefs) prefs = await this.preferences.save(this.preferences.create({
      userId,
      ...NOTIFICATION_DEFAULTS,
      deliveryTime: this.config.get<string>('notifications.dailyDeliveryTime', NOTIFICATION_DEFAULTS.deliveryTime),
      timezone: this.config.get<string>('notifications.defaultTimezone', NOTIFICATION_DEFAULTS.timezone),
      preferredLanguage: this.config.get<string>('notifications.defaultLanguage', NOTIFICATION_DEFAULTS.preferredLanguage),
    }));
    return prefs;
  }

  private isTimezone(value: string) {
    try { new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; }
  }
}
