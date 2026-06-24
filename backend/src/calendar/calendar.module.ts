import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from './calendar-event.entity';
import { CropCalendarTemplate } from './crop-calendar-template.entity';
import { FarmerCrop } from '../farmer-crops/farmer-crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalendarEvent,
      CropCalendarTemplate,
      FarmerCrop,
      FarmerProfile,
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
