import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { User } from '../users/user.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { LandParcelsModule } from '../land-parcels/land-parcels.module';
import { FarmerCropsModule } from '../farmer-crops/farmer-crops.module';
import { FarmerProfilesModule } from '../farmer-profiles/farmer-profiles.module';
import { UserSettings } from '../settings/user-settings.entity';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FarmerProfile, UserSettings]),
    CalendarModule,
    LandParcelsModule,
    FarmerCropsModule,
    FarmerProfilesModule,
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}

