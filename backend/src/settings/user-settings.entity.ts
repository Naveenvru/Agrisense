import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'user_settings' })
export class UserSettings {
  @PrimaryColumn({ name: 'user_id', type: 'bigint' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 16, default: 'system' })
  theme: 'system' | 'light' | 'dark';

  @Column({ name: 'accent_theme', type: 'varchar', length: 16, default: 'farm' })
  accentTheme: 'farm' | 'ocean' | 'sunrise';

  @Column({ type: 'varchar', length: 16, default: 'metric' })
  units: 'metric' | 'imperial';

  @Column({ name: 'ai_assistance_enabled', type: 'boolean', default: true })
  aiAssistanceEnabled: boolean;

  @Column({ name: 'personalized_recommendations_enabled', type: 'boolean', default: true })
  personalizedRecommendationsEnabled: boolean;

  @Column({ name: 'google_link_ticket_hash', type: 'varchar', length: 64, nullable: true })
  googleLinkTicketHash: string | null;

  @Column({ name: 'google_link_ticket_expires_at', type: 'timestamptz', nullable: true })
  googleLinkTicketExpiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
