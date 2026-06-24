import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'crops' })
export class Crop {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'crop_name', type: 'varchar', length: 255 })
  cropName: string;

  @Column({ name: 'scientific_name', type: 'varchar', length: 255, nullable: true })
  scientificName: string | null;

  @Column({ name: 'crop_category', type: 'varchar', length: 100, nullable: true })
  cropCategory: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  season: string | null;

  @Column({ name: 'duration_days', type: 'int', nullable: true })
  durationDays: number | null;

  @Column({ name: 'water_requirement', type: 'varchar', length: 255, nullable: true })
  waterRequirement: string | null;

  @Column({ name: 'ideal_temperature_min', type: 'numeric', precision: 5, scale: 2, nullable: true })
  idealTemperatureMin: number | null;

  @Column({ name: 'ideal_temperature_max', type: 'numeric', precision: 5, scale: 2, nullable: true })
  idealTemperatureMax: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
