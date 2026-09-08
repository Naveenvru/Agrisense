import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import mongodbConfig from './mongodb/config/mongodb.config';
import { MongodbModule } from './mongodb/mongodb.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FarmerProfilesModule } from './farmer-profiles/farmer-profiles.module';
import { LandParcelsModule } from './land-parcels/land-parcels.module';
import { CropsModule } from './crops/crops.module';
import { FarmerCropsModule } from './farmer-crops/farmer-crops.module';
import { CalendarModule } from './calendar/calendar.module';
import { WeatherModule } from './weather/weather.module';
import { StorageModule } from './storage/common/storage.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MarketModule } from './market/market.module';
import { MasterDataModule } from './master-data/master-data.module';
import { GeoBoundaryModule } from './geoboundary/geoboundary.module';
import { HarvestIntelligenceModule } from './harvest-intelligence/harvest-intelligence.module';
import { YieldIntelligenceModule } from './yield-intelligence/yield-intelligence.module';
import { SupplyIntelligenceModule } from './supply-intelligence/supply-intelligence.module';
import { DemandIntelligenceModule } from './demand-intelligence/demand-intelligence.module';
import { GeminiModule } from './gemini/gemini.module';
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
      load: [databaseConfig, authConfig, mongodbConfig],
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        dbName: configService.get<string>('mongodb.database'),
      }),
    }),
    UsersModule,
    AuthModule,
    FarmerProfilesModule,
    LandParcelsModule,
    CropsModule,
    FarmerCropsModule,
    CalendarModule,
    MongodbModule,
    WeatherModule,
    StorageModule,
    SchedulerModule,
    MarketModule,
    MasterDataModule,
    GeoBoundaryModule,
    HarvestIntelligenceModule,   // Phase 11 – Harvest Intelligence
    YieldIntelligenceModule,     // Phase 12 – Yield Intelligence
    SupplyIntelligenceModule,    // Phase 13 – Supply Intelligence
    DemandIntelligenceModule,    // Phase 14 – Demand Intelligence
    GeminiModule,
  ],
})
export class AppModule {}
