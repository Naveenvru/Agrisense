import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'notification_preferences' })
export class NotificationPreferences {
  @PrimaryColumn({ name: 'user_id', type: 'bigint' })
  userId: string;

  @Column({ name: 'whatsapp_enabled', type: 'boolean', default: false }) whatsappEnabled: boolean;
  @Column({ name: 'sms_enabled', type: 'boolean', default: false }) smsEnabled: boolean;
  @Column({ name: 'in_app_enabled', type: 'boolean', default: true }) inAppEnabled: boolean;
  @Column({ name: 'daily_digest_enabled', type: 'boolean', default: true }) dailyDigestEnabled: boolean;
  @Column({ name: 'market_alerts_enabled', type: 'boolean', default: true }) marketAlertsEnabled: boolean;
  @Column({ name: 'weather_alerts_enabled', type: 'boolean', default: true }) weatherAlertsEnabled: boolean;
  @Column({ name: 'crop_reminders_enabled', type: 'boolean', default: true }) cropRemindersEnabled: boolean;
  @Column({ name: 'disease_alerts_enabled', type: 'boolean', default: true }) diseaseAlertsEnabled: boolean;
  @Column({ name: 'system_notifications_enabled', type: 'boolean', default: true }) systemNotificationsEnabled: boolean;
  @Column({ name: 'delivery_time', type: 'varchar', length: 5, default: '08:00' }) deliveryTime: string;
  @Column({ type: 'varchar', length: 64, default: 'Asia/Kolkata' }) timezone: string;
  @Column({ name: 'preferred_language', type: 'varchar', length: 10, default: 'en-kn' }) preferredLanguage: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
