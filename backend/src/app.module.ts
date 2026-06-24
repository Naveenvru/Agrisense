import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FarmerProfilesModule } from './farmer-profiles/farmer-profiles.module';
import { LandParcelsModule } from './land-parcels/land-parcels.module';
import { CropsModule } from './crops/crops.module';
import { FarmerCropsModule } from './farmer-crops/farmer-crops.module';
import { CalendarModule } from './calendar/calendar.module';
import { User } from './users/user.entity';
import { FarmerProfile } from './farmer-profiles/farmer-profile.entity';
import { LandParcel } from './land-parcels/land-parcel.entity';
import { Crop } from './crops/crop.entity';
import { FarmerCrop } from './farmer-crops/farmer-crop.entity';
import { CalendarEvent } from './calendar/calendar-event.entity';
import { CropCalendarTemplate } from './calendar/crop-calendar-template.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          User,
          FarmerProfile,
          LandParcel,
          Crop,
          FarmerCrop,
          CalendarEvent,
          CropCalendarTemplate,
        ],
        synchronize: false, // Schema is frozen
      }),
    }),
    UsersModule,
    AuthModule,
    FarmerProfilesModule,
    LandParcelsModule,
    CropsModule,
    FarmerCropsModule,
    CalendarModule,
  ],
})
export class AppModule {}

