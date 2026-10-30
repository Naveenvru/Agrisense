import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';

export enum CropStatus {
  ACTIVE = 'active',
  HARVESTED = 'harvested',
  FAILED = 'failed',
}

@Entity({ name: 'farmer_crops' })
export class FarmerCrop {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'parcel_id', type: 'bigint' })
  parcelId: string;

  @Column({ name: 'crop_id', type: 'bigint' })
  cropId: string;

  @ManyToOne(() => LandParcel, (parcel) => parcel.farmerCrops)
  @JoinColumn({ name: 'parcel_id' })
  parcel: LandParcel;

  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;

  @Column({ name: 'crop_variety', type: 'varchar', length: 255, nullable: true })
  cropVariety: string | null;

  @Column({ name: 'sowing_date', type: 'date', nullable: true })
  sowingDate: Date | null;

  @Column({ name: 'expected_harvest_date', type: 'date', nullable: true })
  expectedHarvestDate: Date | null;

  @Column({ name: 'estimated_yield_kg', type: 'numeric', precision: 12, scale: 2, nullable: true })
  estimatedYieldKg: number | null;

  @Column({ name: 'actual_yield_kg', type: 'numeric', precision: 12, scale: 2, nullable: true })
  actualYieldKg: number | null;

  @Column({
    type: 'enum',
    enum: CropStatus,
    enumName: 'crop_status',
    default: CropStatus.ACTIVE,
  })
  status: CropStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
