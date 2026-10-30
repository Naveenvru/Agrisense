import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../users/user.entity';
import { UserSettings } from './user-settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { CropCondition, CropConditionSchema } from '../farmer-crops/crop-condition.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSettings]),
    MongooseModule.forFeature([{ name: CropCondition.name, schema: CropConditionSchema }]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
