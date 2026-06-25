import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { MongodbModule } from '../mongodb/mongodb.module';
import { IntegrationModule } from '../integrations/common/integration.module';
import { CollectorModule } from '../collectors/common/collector.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherApiService } from './weather-api.service';

@Module({
  imports: [
    // PostgreSQL entities for ownership resolution
    TypeOrmModule.forFeature([LandParcel, FarmerProfile]),
    // MongoDB — provides WeatherMongoService
    MongodbModule,
    // Integration Layer — provides BaseHttpClient, RetryService, CacheService,
    //                     IntegrationRegistry, IntegrationHealthService,
    //                     OpenWeatherClient, WeatherMapper
    IntegrationModule,
    // Collector Layer — provides WeatherCollector, CollectorLogger
    CollectorModule,
  ],
  controllers: [WeatherController],
  providers: [
    WeatherApiService,
    WeatherService,
  ],
  exports: [WeatherService, WeatherApiService],
})
export class WeatherModule {}
