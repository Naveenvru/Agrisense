import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreferences } from './notification-preferences.entity';
import { NotificationJob } from './notification-job.entity';

@Injectable()
export class DailyDigestSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DailyDigestSchedulerService.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(
    @InjectRepository(NotificationPreferences) private readonly preferences: Repository<NotificationPreferences>,
    @InjectRepository(NotificationJob) private readonly jobs: Repository<NotificationJob>,
  ) {}

  onModuleInit() {
    if (process.env.NOTIFICATION_SCHEDULER_ENABLED === 'false') return;
    const pollMs = Math.max(15_000, Number(process.env.NOTIFICATION_SCHEDULER_POLL_MS || 60_000));
    void this.safeEnqueueDueDigests();
    this.timer = setInterval(() => void this.safeEnqueueDueDigests(), pollMs);
    this.timer.unref?.();
  }

  onModuleDestroy() { if (this.timer) clearInterval(this.timer); }

  async enqueueDueDigests(now = new Date()): Promise<number> {
    const eligible = await this.preferences.find({ where: { dailyDigestEnabled: true } });
    let enqueued = 0;
    for (const pref of eligible) {
      const local = this.getLocalClock(now, pref.timezone);
      if (!local || `${local.hour}:${local.minute}` < pref.deliveryTime) continue;
      const key = `${pref.userId}:daily-digest:${local.date}`;
      try {
        await this.jobs.insert({ userId: pref.userId, notificationType: 'daily_digest', scheduledAt: now, executionStatus: 'pending', retryCount: 0, idempotencyKey: key, attempts: [] });
        enqueued++;
      } catch (error) {
        // PostgreSQL unique violation means another poll/instance already queued this local day.
        if ((error as { code?: string })?.code !== '23505') this.logger.error(`Could not enqueue digest for user ${pref.userId}`);
      }
    }
    return enqueued;
  }

  private async safeEnqueueDueDigests() {
    try { await this.enqueueDueDigests(); }
    catch (error) { this.logger.error('Daily digest scheduling pass failed', error instanceof Error ? error.stack : undefined); }
  }

  private getLocalClock(date: Date, timezone: string) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
      const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
      return { date: `${values.year}-${values.month}-${values.day}`, hour: values.hour, minute: values.minute };
    } catch { return null; }
  }
}
