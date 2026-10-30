import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification_consents' })
export class NotificationConsent {
  @PrimaryGeneratedColumn({ type: 'bigint' }) id: string;
  @Column({ name: 'user_id', type: 'bigint' }) userId: string;
  @Column({ type: 'varchar', length: 16 }) channel: 'whatsapp' | 'sms';
  @Column({ name: 'consent_status', type: 'varchar', length: 16 }) consentStatus: 'granted' | 'revoked';
  @Column({ name: 'consent_source', type: 'varchar', length: 100 }) consentSource: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
