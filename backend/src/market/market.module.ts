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

/**
 * MarketModule — Phase 9 (Market Intelligence)
 *
 * Imports
 * ────────
 * ✔ MarketMongoModule   — 5 MongoDB collections (market_raw, market_prices_v2, etc.)
 * ✔ CollectorModule     — MarketCollector + DataLakeService (via StorageModule)
 *
 * Providers
 * ─────────
 * ✔ MarketRepository         — MongoDB data access
 * ✔ MarketNormalizationService — HashMap-based normalization
 * ✔ MarketQualityService     — HashSet-based duplicate detection + validation
 * ✔ MarketAggregationService — MongoDB $group aggregation pipelines
 * ✔ MarketService            — orchestrates full pipeline
 *
 * Does NOT modify
 * ────────────────
 * ✗ MongodbModule (Phase 6)
 * ✗ StorageModule (Phase 8.7)
 * ✗ WeatherModule (Phase 8)
 * ✗ Any auth / entity / controller from previous phases
 */
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
  ],
  exports: [MarketService, MarketRepository],
})
export class MarketModule {}
