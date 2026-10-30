import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmerCrop } from './farmer-crop.entity';
import { FarmerCropsService } from './farmer-crops.service';
import { FarmerCropsController } from './farmer-crops.controller';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CropCondition, CropConditionSchema } from './crop-condition.schema';
import { CalendarEvent } from '../calendar/calendar-event.entity';
import { CropCalendarTemplate } from '../calendar/crop-calendar-template.entity';
import { UserSettings } from '../settings/user-settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FarmerCrop, CalendarEvent, CropCalendarTemplate, LandParcel, Crop, FarmerProfile, UserSettings]),
    MongooseModule.forFeature([{ name: CropCondition.name, schema: CropConditionSchema }]),
  ],
  controllers: [FarmerCropsController],
  providers: [FarmerCropsService],
  exports: [FarmerCropsService],
})
export class FarmerCropsModule {}
