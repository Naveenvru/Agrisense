import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification_attempts' })
export class NotificationAttempt {
  @PrimaryGeneratedColumn({ type: 'bigint' }) id: string;
  @Column({ name: 'job_id', type: 'bigint' }) jobId: string;
  @Column({ type: 'varchar', length: 16 }) channel: 'whatsapp' | 'sms' | 'in_app';
  @Column({ type: 'varchar', length: 20 }) status: 'sent' | 'delivered' | 'failed';
  @Column({ name: 'provider_message_id', type: 'varchar', length: 255, nullable: true }) providerMessageId: string | null;
  @Column({ name: 'failure_reason', type: 'text', nullable: true }) failureReason: string | null;
  @Column({ name: 'provider_response', type: 'jsonb', nullable: true }) providerResponse: Record<string, unknown> | null;
  @CreateDateColumn({ name: 'attempted_at', type: 'timestamptz' }) attemptedAt: Date;
}
