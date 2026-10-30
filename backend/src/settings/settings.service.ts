import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { User } from '../users/user.entity';
import { UserSettings } from './user-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DisconnectGoogleDto } from './dto/disconnect-google.dto';
import { CropCondition } from '../farmer-crops/crop-condition.schema';

const LANGUAGES = ['en', 'hi', 'kn', 'ta', 'te', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as', 'ur'];

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectModel(CropCondition.name) private readonly cropConditions: Model<CropCondition>,
    private readonly dataSource: DataSource,
  ) {}

  async get(userId: string) {
    const [user, settings] = await Promise.all([
      this.users.findOne({ where: { id: userId } }),
      this.getOrCreate(userId),
    ]);
    if (!user) throw new NotFoundException('Account not found');
    const { passwordHash: _passwordHash, tokenVersion: _tokenVersion, ...safeUser } = user;
    const { googleLinkTicketHash: _ticketHash, googleLinkTicketExpiresAt: _ticketExpiresAt, user: _settingsUser, ...safeSettings } = settings;
    return { ...safeSettings, language: user.preferredLanguage || 'en', account: safeUser };
  }

  async update(userId: string, dto: UpdateSettingsDto) {
    if (dto.language && !LANGUAGES.includes(dto.language)) throw new BadRequestException('Unsupported language');
    const settings = await this.getOrCreate(userId);
    const { language, ...settingsPatch } = dto;
    const aiEnabled = settingsPatch.aiAssistanceEnabled ?? settings.aiAssistanceEnabled;
    if (settingsPatch.personalizedRecommendationsEnabled === true && !aiEnabled) {
      throw new BadRequestException('Enable AI assistance before personalized recommendations');
    }
    if (!aiEnabled) settingsPatch.personalizedRecommendationsEnabled = false;
    Object.assign(settings, settingsPatch);
    await this.settings.save(settings);
    if (language !== undefined) await this.users.update(userId, { preferredLanguage: language });
    return this.get(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found');
    if (user.passwordHash && !dto.currentPassword) throw new BadRequestException('Enter your current password');
    if (user.passwordHash && !(await bcrypt.compare(dto.currentPassword!, user.passwordHash))) throw new UnauthorizedException('Current password is incorrect');
    if (user.passwordHash && await bcrypt.compare(dto.newPassword, user.passwordHash)) throw new BadRequestException('Choose a password different from your current password');
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.authProvider = 'local';
    user.tokenVersion += 1;
    await this.users.save(user);
    return { message: 'Password changed. Sign in again on your devices.' };
  }

  async createGoogleLinkTicket(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found');
    await this.getOrCreate(userId);
    const ticket = randomBytes(32).toString('hex');
    await this.settings.update(userId, {
      googleLinkTicketHash: createHash('sha256').update(ticket).digest('hex'),
      googleLinkTicketExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    return { ticket, expiresInSeconds: 600 };
  }

  async completeGoogleLink(ticket: string, googleId: string) {
    if (!ticket || !/^[a-f0-9]{64}$/i.test(ticket) || !googleId) throw new UnauthorizedException('Google account link request is invalid or expired');
    const ticketHash = createHash('sha256').update(ticket).digest('hex');
    return this.dataSource.transaction(async (manager) => {
      const settingsRepo = manager.getRepository(UserSettings);
      const userRepo = manager.getRepository(User);
      const pending = await settingsRepo.findOne({ where: { googleLinkTicketHash: ticketHash } });
      if (!pending || !pending.googleLinkTicketExpiresAt || pending.googleLinkTicketExpiresAt.getTime() <= Date.now()) {
        throw new UnauthorizedException('Google account link request is invalid or expired');
      }
      const linkedElsewhere = await userRepo.findOne({ where: { googleId } });
      if (linkedElsewhere && linkedElsewhere.id !== pending.userId) throw new BadRequestException('That Google account is already linked to another AgriSense account');
      const consumed = await settingsRepo.update({ userId: pending.userId, googleLinkTicketHash: ticketHash }, { googleLinkTicketHash: null, googleLinkTicketExpiresAt: null });
      if (!consumed.affected) throw new UnauthorizedException('Google account link request has already been used');
      await userRepo.update(pending.userId, { googleId, isEmailVerified: true });
      return { userId: pending.userId };
    });
  }

  async disconnectGoogle(userId: string, dto: DisconnectGoogleDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found');
    if (!user.googleId) throw new BadRequestException('No Google account is linked');
    if (!user.passwordHash) throw new BadRequestException('Add a password to your AgriSense account before disconnecting Google');
    if (!(await bcrypt.compare(dto.currentPassword, user.passwordHash))) throw new UnauthorizedException('Current password is incorrect');
    user.googleId = null;
    user.tokenVersion += 1;
    await this.users.save(user);
    return { connected: false, message: 'Google was disconnected. Sign in again.' };
  }

  async exportData(userId: string) {
    const queries: Array<[string, string]> = [
      ['profile', 'SELECT to_jsonb(p) AS item FROM farmer_profiles p WHERE p.user_id = $1'],
      ['parcels', 'SELECT to_jsonb(p) AS item FROM farmer_land_parcels p JOIN farmer_profiles f ON f.id = p.farmer_profile_id WHERE f.user_id = $1'],
      ['crops', 'SELECT to_jsonb(c) AS item FROM farmer_crops c JOIN farmer_land_parcels p ON p.id = c.parcel_id JOIN farmer_profiles f ON f.id = p.farmer_profile_id WHERE f.user_id = $1'],
      ['calendarEvents', 'SELECT to_jsonb(e) AS item FROM calendar_events e JOIN farmer_crops c ON c.id = e.farmer_crop_id JOIN farmer_land_parcels p ON p.id = c.parcel_id JOIN farmer_profiles f ON f.id = p.farmer_profile_id WHERE f.user_id = $1'],
      ['notificationPreferences', 'SELECT to_jsonb(p) AS item FROM notification_preferences p WHERE p.user_id = $1'],
      ['notificationConsents', 'SELECT to_jsonb(c) AS item FROM notification_consents c WHERE c.user_id = $1'],
      ['notificationJobs', 'SELECT to_jsonb(j) AS item FROM notification_jobs j WHERE j.user_id = $1'],
      ['notificationAttempts', 'SELECT to_jsonb(a) AS item FROM notification_attempts a JOIN notification_jobs j ON j.id = a.job_id WHERE j.user_id = $1'],
      ['decisionTraces', 'SELECT to_jsonb(t) AS item FROM decision_traces t WHERE t.user_id = $1'],
      ['reports', "SELECT jsonb_build_object('id', r.id, 'report_type', r.report_type, 'title', r.report_title, 'period_start', r.period_start, 'period_end', r.period_end, 'created_at', r.created_at) AS item FROM generated_reports r WHERE r.user_id = $1"],
    ];
    const data: Record<string, unknown[]> = {};
    for (const [key, sql] of queries) {
      try {
        const rows = await this.dataSource.query(sql, [userId]);
        data[key] = rows.map((row: { item: unknown }) => row.item);
      } catch (error) {
        if ((error as { code?: string })?.code !== '42P01') throw error;
        data[key] = [];
      }
    }
    const cropRows = await this.dataSource.query(
      'SELECT c.id FROM farmer_crops c JOIN farmer_land_parcels p ON p.id = c.parcel_id JOIN farmer_profiles f ON f.id = p.farmer_profile_id WHERE f.user_id = $1',
      [userId],
    );
    data.cropConditions = await this.cropConditions.find({
      userId,
      farmerCropId: { $in: cropRows.map((row: { id: string | number }) => String(row.id)) },
    }).sort({ observedAt: -1 }).lean().exec();
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Account not found');
    data.account = [{ id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, preferredLanguage: user.preferredLanguage, createdAt: user.createdAt }];
    const settings = await this.getOrCreate(userId);
    const { googleLinkTicketHash: _ticketHash, googleLinkTicketExpiresAt: _ticketExpiresAt, user: _settingsUser, ...safeSettings } = settings;
    data.settings = [safeSettings];
    return { exportedAt: new Date().toISOString(), formatVersion: 1, data };
  }

  private async getOrCreate(userId: string) {
    let settings = await this.settings.findOne({ where: { userId } });
    if (!settings) {
      settings = this.settings.create({ userId });
      settings = await this.settings.save(settings);
    }
    return settings;
  }
}
