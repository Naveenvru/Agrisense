import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
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
  IMarketPrice,
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
export class MarketService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MarketService.name);
  private cachedFallbackPrices: IMarketPrice[] = [];

  constructor(
    private readonly collector: MarketCollector,
    private readonly normalization: MarketNormalizationService,
    private readonly quality: MarketQualityService,
    private readonly repository: MarketRepository,
    private readonly aggregation: MarketAggregationService,
    private readonly farmerProfiles: FarmerProfilesService,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    this.initFallbackDataset();
    await this.seedAuthenticMarketDataIfEmpty();
  }

  private initFallbackDataset() {
    try {
      const candidates = [
        path.resolve(process.cwd(), 'ai-service/data/raw/prices/karnataka_mandi_live.json'),
        path.resolve(process.cwd(), '../ai-service/data/raw/prices/karnataka_mandi_live.json'),
      ];
      let livePath = candidates.find((p) => fs.existsSync(p));
      const histCandidates = [
        path.resolve(process.cwd(), 'ai-service/data/raw/prices/karnataka_mandi_history.json'),
        path.resolve(process.cwd(), '../ai-service/data/raw/prices/karnataka_mandi_history.json'),
      ];
      let histPath = histCandidates.find((p) => fs.existsSync(p));

      const records: IMarketPrice[] = [];

      if (livePath && fs.existsSync(livePath)) {
        const liveData = JSON.parse(fs.readFileSync(livePath, 'utf8'));
        const rawLive = (liveData.records || []) as any[];
        for (const item of rawLive) {
          const p = this.mapRawToPrice(item);
          if (p) records.push(p);
        }
      }

      if (histPath && fs.existsSync(histPath)) {
        const histData = JSON.parse(fs.readFileSync(histPath, 'utf8'));
        for (const list of Object.values(histData) as any[][]) {
          for (const item of list) {
            const p = this.mapRawToPrice(item);
            if (p) records.push(p);
          }
        }
      }

      this.cachedFallbackPrices = records;
      this.logger.log(`Initialized in-memory APMC market dataset: ${this.cachedFallbackPrices.length} records available`);
    } catch (err: any) {
      this.logger.warn(`Could not load fallback market dataset: ${err.message}`);
    }
  }

  private mapRawToPrice(item: any): IMarketPrice | null {
    if (!item.commodity || !item.market || item.modal_price === undefined) return null;
    let date = new Date();
    if (item.arrival_date) {
      const parts = String(item.arrival_date).split('/');
      if (parts.length === 3) {
        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        date = new Date(item.arrival_date);
      }
    }
    return {
      source: 'Karnataka State Agricultural Marketing Board / AGMARKNET (GODL-India)',
      state: item.state || 'Karnataka',
      district: item.district || 'Bengaluru',
      market: item.market,
      commodity: item.commodity,
      variety: item.variety || 'Standard',
      grade: item.grade || 'Local',
      date: isNaN(date.getTime()) ? new Date() : date,
      minPrice: Number(item.min_price || item.modal_price),
      maxPrice: Number(item.max_price || item.modal_price),
      modalPrice: Number(item.modal_price),
      unit: 'Quintal',
      normalizedAt: new Date(),
      qualityScore: 100,
    };
  }

  async seedAuthenticMarketDataIfEmpty() {
    try {
      const count = await this.repository.countPrices();
      if (count === 0 && this.cachedFallbackPrices.length > 0) {
        this.logger.log(`MongoDB market_prices_v2 is empty. Seeding ${this.cachedFallbackPrices.length} authentic APMC records...`);
        await this.repository.savePriceBatch(this.cachedFallbackPrices);
        this.logger.log(`Successfully seeded ${this.cachedFallbackPrices.length} APMC price records into MongoDB.`);
      }
    } catch (err: any) {
      this.logger.warn(`MongoDB check/seeding skipped: ${err.message}`);
    }
  }

  findFallbackPrices(
    commodity?: string,
    market?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
    district?: string,
    state?: string,
  ): IMarketPrice[] {
    if (!this.cachedFallbackPrices.length) {
      this.initFallbackDataset();
    }

    const normDistrict = district ? district.trim().toLowerCase().replace(/\s+(urban|rural)$/i, '') : null;
    const normCommodity = commodity ? commodity.trim().toLowerCase() : null;
    const normMarket = market ? market.trim().toLowerCase() : null;
    const normState = state ? state.trim().toLowerCase() : null;

    let filtered = this.cachedFallbackPrices.filter((r) => {
      if (normCommodity && !r.commodity.toLowerCase().includes(normCommodity)) return false;
      if (normMarket && !r.market.toLowerCase().includes(normMarket)) return false;
      if (normDistrict && !r.district.toLowerCase().includes(normDistrict)) return false;
      if (normState && !r.state.toLowerCase().includes(normState)) return false;
      return true;
    });

    // If strict date filter matches, use it
    if (startDate || endDate) {
      const dateFiltered = filtered.filter((r) => {
        const t = r.date.getTime();
        if (startDate && t < startDate.getTime()) return false;
        if (endDate && t > endDate.getTime()) return false;
        return true;
      });
      if (dateFiltered.length > 0) {
        filtered = dateFiltered;
      }
    }

    // Sort descending by date
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
    return filtered.slice(0, limit);
  }

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
        limit: params.limit ?? 200,
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
    let records: any[] = [];
    try {
      records = await this.repository.findPrices(commodity, market, startDate, endDate, limit, district, state);
    } catch (err: any) {
      this.logger.warn(`Failed to query repository findPrices: ${err.message}`);
    }

    if (!records || records.length === 0) {
      records = this.findFallbackPrices(commodity, market, startDate, endDate, limit, district, state);
    }
    return records;
  }

  async getPricesForUser(userId: string, query: { commodity?: string; market?: string; district?: string; state?: string; startDate?: Date; endDate?: Date; limit?: number }) {
    let { district, state } = query;
    if ((!district || !state) && !query.market) {
      try {
        const farmRows = await this.dataSource.query(`SELECT lp.additional_metadata->>'district' AS district, lp.additional_metadata->>'state' AS state FROM farmer_land_parcels lp JOIN farmer_profiles fp ON fp.id = lp.farmer_profile_id WHERE fp.user_id = $1 ORDER BY lp.created_at DESC LIMIT 1`, [userId]);
        district = district || (farmRows[0]?.district?.toLowerCase() === 'default' ? undefined : farmRows[0]?.district) || undefined;
        state = state || (farmRows[0]?.state?.toLowerCase() === 'default' ? undefined : farmRows[0]?.state) || undefined;
      } catch (err: any) {
        this.logger.warn(`Could not lookup farmer land parcel: ${err.message}`);
      }
    }
    if ((!district || !state) && !query.market) {
      try {
        const profile = await this.farmerProfiles.findByUserId(userId);
        const profileDistrict = profile.district && profile.district.toLowerCase() !== 'default' ? profile.district : undefined;
        const profileState = profile.state && profile.state.toLowerCase() !== 'default' ? profile.state : undefined;
        district = district || profileDistrict || 'Bengaluru';
        state = state || profileState || 'Karnataka';
      } catch {
        district = district || 'Bengaluru';
        state = state || 'Karnataka';
      }
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
