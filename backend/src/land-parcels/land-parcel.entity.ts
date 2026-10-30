import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { FarmerCrop } from '../farmer-crops/farmer-crop.entity';

@Entity({ name: 'farmer_land_parcels' })
export class LandParcel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'farmer_profile_id', type: 'bigint' })
  farmerProfileId: string;

  @ManyToOne(() => FarmerProfile)
  @JoinColumn({ name: 'farmer_profile_id' })
  farmerProfile: FarmerProfile;

  @Column({ name: 'parcel_name', type: 'varchar', length: 255, nullable: true })
  parcelName: string | null;

  @Column({ name: 'area_acres', type: 'numeric', precision: 10, scale: 2, nullable: true })
  areaAcres: number | null;

  @Column({ name: 'soil_type', type: 'varchar', length: 100, nullable: true })
  soilType: string | null;

  @Column({ name: 'land_type', type: 'varchar', length: 100, nullable: true })
  landType: string | null;

  @Column({ name: 'irrigation_type', type: 'varchar', length: 100, nullable: true })
  irrigationType: string | null;

  @Column({ name: 'boundary_geom', type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326, nullable: true })
  boundary: any | null;

  @Column({ name: 'centroid', type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  centroid: any | null;

  @Column({ name: 'calculated_area_sqm', type: 'numeric', precision: 16, scale: 2, nullable: true })
  calculatedAreaSqm: number | null;

  @Column({ name: 'calculated_area_acres', type: 'numeric', precision: 14, scale: 4, nullable: true })
  calculatedAreaAcres: number | null;

  @Column({ name: 'calculated_area_hectares', type: 'numeric', precision: 14, scale: 4, nullable: true })
  calculatedAreaHectares: number | null;

  @Column({ name: 'location_accuracy', type: 'varchar', length: 24, default: 'approximate' })
  locationAccuracy: 'boundary' | 'gps' | 'approximate';

  @Column({ name: 'village', type: 'varchar', length: 160, nullable: true })
  village: string | null;

  @Column({ name: 'taluk', type: 'varchar', length: 160, nullable: true })
  taluk: string | null;

  @Column({ name: 'district', type: 'varchar', length: 160, nullable: true })
  district: string | null;

  @Column({ name: 'state', type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ name: 'pin_code', type: 'varchar', length: 12, nullable: true })
  pinCode: string | null;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'land_profile', type: 'jsonb', nullable: true })
  landProfile: Record<string, any> | null;

  // PostGIS GEOGRAPHY(POINT, 4326) — stored as raw geometry, read/write via raw SQL
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: any;

  @Column({ name: 'additional_metadata', type: 'jsonb', nullable: true })
  additionalMetadata: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => FarmerCrop, (farmerCrop) => farmerCrop.parcel)
  farmerCrops: FarmerCrop[];
}
