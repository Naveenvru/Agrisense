import { Injectable, Logger } from '@nestjs/common';
import { MarketCollector } from '../collectors/market/market.collector';
import { MarketNormalizationService } from './normalization/market-normalization.service';
import { MarketQualityService } from './quality/market-quality.service';
import { MarketRepository } from './repository/market.repository';
import { MarketAggregationService } from './aggregation/market-aggregation.service';
import { COLLECTOR_CONSTANTS } from '../collectors/common/collector.constants';
import { FarmerProfilesService } from '../farmer-profiles/farmer-profiles.service';
import { DataSource } from 'typeorm';
import {
  MarketCollectParams,
  IMarketRawRecord,
  MarketValidationResult,
  MarketPriceStats,
  MarketArrivalStats,
} from './interfaces/market.interface';

/**
 * MarketService — Phase 9
 *
 * Orchestrates the full market intelligence pipeline:
 *
 *   MarketCollector.collect()      ← raw data from IMarketDataSource
 *         ↓
 *   MarketCollector.store()        ← write raw JSON to storage/raw/market/
 *         ↓
 *   MarketQualityService.validate() ← reject invalid/duplicate records
 *         ↓
 *   MarketNormalizationService     ← normalize commodity/market/unit/date/price
 *         ↓
 *   MarketRepository               ← persist to MongoDB
 *
 * Logging
 * ────────
 * ✔ Collection started
 * ✔ Collection completed
 * ✔ Raw dataset stored
 * ✔ Records normalized
 * ✔ Invalid records rejected
 */
@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    private readonly collector: MarketCollector,
    private readonly normalization: MarketNormalizationService,
    private readonly quality: MarketQualityService,
    private readonly repository: MarketRepository,
    private readonly aggregation: MarketAggregationService,
    private readonly farmerProfiles: FarmerProfilesService,
    private readonly dataSource: DataSource,
  ) {}

  // ---------------------------------------------------------------------------
  // Collect & Process Pipeline
  // ---------------------------------------------------------------------------

  /**
   * Trigger a full market intelligence collection cycle.
   *
   * Pipeline:
   * 1. Collect raw records via MarketCollector
   * 2. Store raw dataset in Data Lake (storage/raw/market/)
   * 3. Validate with HashSet-based duplicate detection
   * 4. Normalize commodity/market/unit/price/date
   * 5. Persist normalized prices and arrivals to MongoDB
   */
  async collect(params: MarketCollectParams = {}): Promise<{
    collectionResult: { status: string; recordsCollected: number; durationMs: number };
    qualityResult: Pick<MarketValidationResult, 'totalInput' | 'totalValid' | 'totalRejected' | 'totalDuplicates'>;
    stored: { prices: number; arrivals: number };
    dataLake: { stored: boolean; filename?: string };
  }> {
    this.logger.log(`Collection started | params=${JSON.stringify(params)}`);

    // Step 1 — Collect
    const collectionResult = await this.collector.collect({
      domain: COLLECTOR_CONSTANTS.DOMAINS.MARKET as any,
      operation: COLLECTOR_CONSTANTS.OPERATIONS.MARKET_PRICES,
      payload: {
        commodity: params.commodity,
        market: params.market,
        state: params.state,
        district: params.district,
        date: params.date?.toISOString(),
        limit: 50,
      },
      requestedAt: new Date(),
    });

    this.logger.log(
      `Collection completed | status=${collectionResult.status} duration=${collectionResult.durationMs}ms`,
    );

    const rawRecords = (collectionResult.rawData as IMarketRawRecord[]) ?? [];

    // Step 2 — Store to Data Lake
    await this.collector.store(collectionResult);
    const dataLakeStored = collectionResult.status === COLLECTOR_CONSTANTS.STATUS.SUCCESS;
    this.logger.log(`Raw dataset stored in Data Lake | count=${rawRecords.length}`);

    if (!rawRecords.length) {
      return {
        collectionResult: { status: collectionResult.status, recordsCollected: 0, durationMs: collectionResult.durationMs },
        qualityResult: { totalInput: 0, totalValid: 0, totalRejected: 0, totalDuplicates: 0 },
        stored: { prices: 0, arrivals: 0 },
        dataLake: { stored: false },
      };
    }

    // Step 3 — Quality validation (HashSet duplicate detection)
    const qualityResult = this.quality.validate(rawRecords);
    this.logger.log(
      `Records normalized: ${qualityResult.totalValid} | Invalid records rejected: ${qualityResult.totalRejected}`,
    );

    // Step 4 — Normalize valid records
    const { prices, arrivals } = this.normalization.normalizeBatch(qualityResult.valid);

    // Step 5 — Persist to MongoDB
    let storedPrices = 0;
    let storedArrivals = 0;

    if (prices.length) {
      await this.repository.savePriceBatch(prices);
      storedPrices = prices.length;
    }

    if (arrivals.length) {
      await this.repository.saveArrivalBatch(arrivals);
      storedArrivals = arrivals.length;
    }

    // Also persist raw records
    if (rawRecords.length) {
      await this.repository.saveRawBatch(rawRecords);
    }

    return {
      collectionResult: {
        status: collectionResult.status,
        recordsCollected: rawRecords.length,
        durationMs: collectionResult.durationMs,
      },
      qualityResult: {
        totalInput: qualityResult.totalInput,
        totalValid: qualityResult.totalValid,
        totalRejected: qualityResult.totalRejected,
        totalDuplicates: qualityResult.totalDuplicates,
      },
      stored: { prices: storedPrices, arrivals: storedArrivals },
      dataLake: { stored: dataLakeStored },
    };
  }

  // ---------------------------------------------------------------------------
  // Query Operations
  // ---------------------------------------------------------------------------

  async getPrices(
    commodity?: string,
    market?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
    district?: string,
    state?: string,
  ) {
    return this.repository.findPrices(commodity, market, startDate, endDate, limit, district, state);
  }

  async getPricesForUser(userId: string, query: { commodity?: string; market?: string; district?: string; state?: string; startDate?: Date; endDate?: Date; limit?: number }) {
    let { district, state } = query;
    if ((!district || !state) && !query.market) {
      const farmRows = await this.dataSource.query(`SELECT lp.additional_metadata->>'district' AS district, lp.additional_metadata->>'state' AS state FROM farmer_land_parcels lp JOIN farmer_profiles fp ON fp.id = lp.farmer_profile_id WHERE fp.user_id = $1 ORDER BY lp.created_at DESC LIMIT 1`, [userId]);
      district = district || (farmRows[0]?.district?.toLowerCase() === 'default' ? undefined : farmRows[0]?.district) || undefined;
      state = state || (farmRows[0]?.state?.toLowerCase() === 'default' ? undefined : farmRows[0]?.state) || undefined;
    }
    if ((!district || !state) && !query.market) {
      const profile = await this.farmerProfiles.findByUserId(userId);
      const profileDistrict = profile.district && profile.district.toLowerCase() !== 'default' ? profile.district : undefined;
      const profileState = profile.state && profile.state.toLowerCase() !== 'default' ? profile.state : undefined;
      district = district || profileDistrict || 'Bengaluru Urban';
      state = state || profileState || 'Karnataka';
    }
    return this.getPrices(query.commodity, query.market, query.startDate, query.endDate, query.limit, district, state);
  }

  async getLatestPrice(commodity: string, market: string) {
    return this.repository.findLatestPrice(commodity, market);
  }

  async getArrivals(
    commodity?: string,
    market?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
  ) {
    return this.repository.findArrivals(commodity, market, startDate, endDate, limit);
  }

  async getTrends(
    commodity?: string,
    market?: string,
    period?: string,
    limit = 50,
  ) {
    return this.repository.findTrends(commodity, market, period, limit);
  }

  // ---------------------------------------------------------------------------
  // Aggregation
  // ---------------------------------------------------------------------------

  async getPriceStats(
    commodity: string,
    market: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MarketPriceStats | null> {
    return this.aggregation.priceStats(commodity, market, startDate, endDate);
  }

  async getArrivalTotals(
    commodity: string,
    market: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<MarketArrivalStats[]> {
    return this.aggregation.arrivalTotals(commodity, market, startDate, endDate);
  }

  // ---------------------------------------------------------------------------
  // Health
  // ---------------------------------------------------------------------------

  healthCheck(): { status: string; module: string } {
    this.logger.log('MarketService health check called');
    return { status: 'operational', module: 'market-intelligence' };
  }
}
