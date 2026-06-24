import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';

@Entity({ name: 'farmer_profiles' })
export class FarmerProfile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  village: string | null;

  @Column({ name: 'total_land_area', type: 'numeric', precision: 10, scale: 2, nullable: true })
  totalLandArea: number | null;

  @Column({ name: 'primary_soil_type', type: 'varchar', length: 100, nullable: true })
  primarySoilType: string | null;

  @Column({ name: 'primary_irrigation_type', type: 'varchar', length: 100, nullable: true })
  primaryIrrigationType: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => LandParcel, (parcel) => parcel.farmerProfile)
  landParcels: LandParcel[];
}
