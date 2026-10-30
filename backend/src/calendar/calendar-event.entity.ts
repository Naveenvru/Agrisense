import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FarmerCrop } from '../farmer-crops/farmer-crop.entity';

@Entity({ name: 'calendar_events' })
export class CalendarEvent {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'farmer_crop_id', type: 'bigint' })
  farmerCropId: string;

  @ManyToOne(() => FarmerCrop)
  @JoinColumn({ name: 'farmer_crop_id' })
  farmerCrop: FarmerCrop;

  @Column({ name: 'event_date', type: 'date' })
  eventDate: Date;

  @Column({ name: 'task_name', type: 'varchar', length: 255 })
  taskName: string;

  @Column({ name: 'task_description', type: 'text', nullable: true })
  taskDescription: string | null;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'generated_by_weather', type: 'boolean', default: false })
  generatedByWeather: boolean;

  @Column({ name: 'generated_by_ai', type: 'boolean', default: false })
  generatedByAi: boolean;

  @Column({ name: 'source_condition_id', type: 'varchar', length: 24, nullable: true })
  sourceConditionId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
