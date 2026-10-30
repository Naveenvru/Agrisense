import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FarmerCrop } from './farmer-crop.entity';

@Entity({ name: 'farmer_crop_conditions' })
export class CropConditionObservation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'farmer_crop_id', type: 'bigint' })
  farmerCropId: string;

  @ManyToOne(() => FarmerCrop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmer_crop_id' })
  farmerCrop: FarmerCrop;

  @Column({ name: 'observed_at', type: 'timestamptz', default: () => 'NOW()' })
  observedAt: Date;

  @Column({ name: 'condition_label', type: 'varchar', length: 120 })
  conditionLabel: string;

  @Column({ name: 'growth_stage', type: 'varchar', length: 100, nullable: true })
  growthStage: string | null;

  @Column({ name: 'soil_moisture_percent', type: 'numeric', precision: 5, scale: 2, nullable: true })
  soilMoisturePercent: number | null;

  @Column({ name: 'air_temperature_c', type: 'numeric', precision: 5, scale: 2, nullable: true })
  airTemperatureC: number | null;

  @Column({ name: 'rainfall_mm', type: 'numeric', precision: 8, scale: 2, nullable: true })
  rainfallMm: number | null;

  @Column({ name: 'irrigation_status', type: 'varchar', length: 120, nullable: true })
  irrigationStatus: string | null;

  @Column({ name: 'symptoms_and_signs', type: 'text', nullable: true })
  symptomsAndSigns: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
