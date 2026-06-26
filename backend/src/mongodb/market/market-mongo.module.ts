import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketRaw, MarketRawSchema } from './market-raw.schema';
import { MarketPriceV2, MarketPriceV2Schema } from './market-price.schema';
import { MarketArrival, MarketArrivalSchema } from './market-arrival.schema';
import { MarketTrend, MarketTrendSchema } from './market-trend.schema';
import { MarketCache, MarketCacheSchema } from './market-cache.schema';

/**
 * MarketMongoModule
 *
 * Registers all Phase 9 market MongoDB collections.
 * Separate from the root MongodbModule to preserve Phase 6 architecture.
 *
 * Collections registered
 * ─────────────────────────
 * ✔ market_raw        — immutable raw records from collectors
 * ✔ market_prices_v2  — normalized, quality-validated prices
 * ✔ market_arrivals   — daily arrival quantities
 * ✔ market_trends     — aggregated period trends
 * ✔ market_cache      — TTL-based short-lived cache
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarketRaw.name, schema: MarketRawSchema },
      { name: MarketPriceV2.name, schema: MarketPriceV2Schema },
      { name: MarketArrival.name, schema: MarketArrivalSchema },
      { name: MarketTrend.name, schema: MarketTrendSchema },
      { name: MarketCache.name, schema: MarketCacheSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MarketMongoModule {}
