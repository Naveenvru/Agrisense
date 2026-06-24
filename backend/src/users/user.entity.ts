import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';

export enum UserRole {
  FARMER = 'farmer',
  BUYER = 'buyer',
  ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ name: 'preferred_language', type: 'varchar', length: 10, default: 'en' })
  preferredLanguage: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => FarmerProfile, (profile) => profile.user)
  farmerProfile: FarmerProfile;
}
