import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'generated_reports' })
export class GeneratedReport {
  @PrimaryGeneratedColumn({ type: 'bigint' }) id: string;
  @Column({ name: 'user_id', type: 'bigint' }) userId: string;
  @Column({ name: 'report_type', type: 'varchar', length: 40 }) reportType: string;
  @Column({ name: 'report_title', type: 'varchar', length: 200 }) reportTitle: string;
  @Column({ name: 'period_start', type: 'date' }) periodStart: string;
  @Column({ name: 'period_end', type: 'date' }) periodEnd: string;
  @Column({ type: 'jsonb' }) metadata: Record<string, unknown>;
  @Column({ name: 'pdf_content', type: 'bytea' }) pdfContent: Buffer;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
