import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Crop } from '../crops/crop.entity';

@Entity({ name: 'crop_calendar_templates' })
export class CropCalendarTemplate {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'crop_id', type: 'bigint' })
  cropId: string;

  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;

  @Column({ name: 'day_offset', type: 'int' })
  dayOffset: number;

  @Column({ name: 'task_name', type: 'varchar', length: 255 })
  taskName: string;

  @Column({ name: 'task_description', type: 'text', nullable: true })
  taskDescription: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  priority: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
