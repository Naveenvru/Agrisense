import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'decision_traces' })
export class DecisionTrace {
  @PrimaryGeneratedColumn({ type: 'bigint' }) id: string;
  @Column({ name: 'trace_id', type: 'varchar', length: 36, unique: true }) traceId: string;
  @Column({ name: 'user_id', type: 'bigint' }) userId: string;
  @Column({ type: 'text' }) query: string;
  @Column({ type: 'varchar', length: 32 }) status: 'completed' | 'insufficient_evidence' | 'unsupported' | 'failed';
  @Column({ type: 'jsonb' }) result: Record<string, unknown>;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
