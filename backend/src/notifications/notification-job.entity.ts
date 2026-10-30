import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'notification_jobs' })
@Index('uq_notification_jobs_idempotency_key', ['idempotencyKey'], { unique: true })
export class NotificationJob {
  @PrimaryGeneratedColumn({ type: 'bigint' }) id: string;
  @Column({ name: 'user_id', type: 'bigint' }) userId: string;
  @Column({ name: 'notification_type', type: 'varchar', length: 40 }) notificationType: string;
  @Column({ name: 'scheduled_at', type: 'timestamptz' }) scheduledAt: Date;
  @Column({ name: 'execution_status', type: 'varchar', length: 20, default: 'pending' }) executionStatus: string;
  @Column({ name: 'retry_count', type: 'int', default: 0 }) retryCount: number;
  @Column({ name: 'idempotency_key', type: 'varchar', length: 200 }) idempotencyKey: string;
  @Column({ name: 'attempts', type: 'jsonb', default: () => "'[]'::jsonb" }) attempts: unknown[];
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
