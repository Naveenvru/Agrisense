import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketRepository } from './repository/market.repository';
import { MarketNormalizationService } from './normalization/market-normalization.service';
import { MarketQualityService } from './quality/market-quality.service';
import { MarketAggregationService } from './aggregation/market-aggregation.service';
import { MarketMongoModule } from '../mongodb/market/market-mongo.module';
import { CollectorModule } from '../collectors/common/collector.module';
import { FarmerProfilesModule } from '../farmer-profiles/farmer-profiles.module';
import { AiMlServiceClient } from '../ai/ai-ml-service.client';

@Module({
  imports: [
    MarketMongoModule,
    CollectorModule,
    FarmerProfilesModule,
  ],
  controllers: [MarketController],
  providers: [
    MarketRepository,
    MarketNormalizationService,
    MarketQualityService,
    MarketAggregationService,
    MarketService,
    AiMlServiceClient,
  ],
  exports: [MarketService, MarketRepository, AiMlServiceClient],
})
export class MarketModule {}
