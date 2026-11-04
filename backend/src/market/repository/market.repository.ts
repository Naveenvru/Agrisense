import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketRaw, MarketRawDocument } from '../../mongodb/market/market-raw.schema';
import { MarketPriceV2, MarketPriceV2Document } from '../../mongodb/market/market-price.schema';
import { MarketArrival, MarketArrivalDocument } from '../../mongodb/market/market-arrival.schema';
import { MarketTrend, MarketTrendDocument } from '../../mongodb/market/market-trend.schema';
import { MarketCache, MarketCacheDocument } from '../../mongodb/market/market-cache.schema';
import {
  IMarketRawRecord,
  IMarketPrice,
  IMarketArrival,
  IMarketTrend,
  IMarketCache,
} from '../interfaces/market.interface';

/**
 * MarketRepository
 *
 * Single repository for all Phase 9 MongoDB collections.
 *
 * Responsibilities
 * ─────────────────
 * ✔ Save raw, price, arrival, trend, cache records
 * ✔ Query by commodity, market, date range
 * ✔ Provide base data for aggregation queries
 * ✔ Manage cache entries (save + evict)
 *
 * Design
 * ───────
 * ✔ No business logic — pure data access
 * ✔ Chronological sort on all date-ordered queries
 * ✔ All queries are async
 */
@Injectable()
export class MarketRepository {
  private readonly logger = new Logger(MarketRepository.name);

  constructor(
    @InjectModel(MarketRaw.name)
    private readonly rawModel: Model<MarketRawDocument>,

    @InjectModel(MarketPriceV2.name)
    private readonly priceModel: Model<MarketPriceV2Document>,

    @InjectModel(MarketArrival.name)
    private readonly arrivalModel: Model<MarketArrivalDocument>,

    @InjectModel(MarketTrend.name)
    private readonly trendModel: Model<MarketTrendDocument>,

    @InjectModel(MarketCache.name)
    private readonly cacheModel: Model<MarketCacheDocument>,
  ) {}

  // ---------------------------------------------------------------------------
  // Raw Records
  // ---------------------------------------------------------------------------

  async saveRaw(data: IMarketRawRecord): Promise<MarketRaw> {
    const doc = new this.rawModel(data);
    const saved = await doc.save();
    this.logger.debug(`Saved raw record | commodity=${data.commodity} market=${data.market}`);
    return saved;
  }

  async saveRawBatch(records: IMarketRawRecord[]): Promise<MarketRaw[]> {
    const docs = await this.rawModel.insertMany(records);
    this.logger.log(`Saved ${docs.length} raw records to market_raw`);
    return docs as unknown as MarketRaw[];
  }

  async findRaw(
    commodity?: string,
    market?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
  ): Promise<MarketRaw[]> {
    const filter: Record<string, any> = {};
    if (commodity) filter.commodity = new RegExp(commodity, 'i');
    if (market) filter.market = new RegExp(market, 'i');
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    return this.rawModel
      .find(filter)
      .sort({ date: 1 })
      .limit(limit)
      .exec();
  }

  // ---------------------------------------------------------------------------
  // Prices
  // ---------------------------------------------------------------------------

  async savePrice(data: IMarketPrice): Promise<MarketPriceV2> {
    const doc = new this.priceModel(data);
    const saved = await doc.save();
    this.logger.debug(`Saved price | commodity=${data.commodity} market=${data.market} date=${data.date.toISOString().slice(0, 10)}`);
    return saved;
  }

  async savePriceBatch(records: IMarketPrice[]): Promise<void> {
    if (!records.length) return;
    await this.priceModel.bulkWrite(records.map((record) => ({
      updateOne: {
        filter: {
          source: record.source,
          state: record.state,
          market: record.market,
          commodity: record.commodity,
          variety: record.variety ?? null,
          grade: record.grade ?? null,
          date: record.date,
        },
        update: { $set: record },
        upsert: true,
      },
    })));
    this.logger.log(`Upserted ${records.length} price records to market_prices_v2`);
  }

  async countPrices(): Promise<number> {
    return this.priceModel.countDocuments().exec();
  }

  async findPrices(
    commodity?: string,
    market?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
    district?: string,
    state?: string,
  ): Promise<MarketPriceV2[]> {
    const filter: Record<string, any> = {};
    if (commodity && commodity.trim()) {
      filter.commodity = new RegExp(this.escapeRegex(commodity.trim()), 'i');
    }
    if (market && market.trim()) {
      filter.market = new RegExp(this.escapeRegex(market.trim()), 'i');
    }
    if (district && district.trim()) {
      const cleanDistrict = district.trim().replace(/\s+(urban|rural)$/i, '').trim();
      filter.district = new RegExp(this.escapeRegex(cleanDistrict), 'i');
    }
    if (state && state.trim()) {
      filter.state = new RegExp(this.escapeRegex(state.trim()), 'i');
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    let results = await this.priceModel
      .find(filter)
      .sort({ date: -1 })
      .limit(limit)
      .exec();

    // If date range had no records, relax date filter to show latest recorded prices
    if (!results.length && (startDate || endDate)) {
      const relaxedFilter = { ...filter };
      delete relaxedFilter.date;
      results = await this.priceModel
        .find(relaxedFilter)
        .sort({ date: -1 })
        .limit(limit)
        .exec();
    }

    return results;
  }

  private escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  async findLatestPrice(commodity: string, market: string): Promise<MarketPriceV2 | null> {
    return this.priceModel
      .findOne({ commodity: new RegExp(commodity, 'i'), market: new RegExp(market, 'i') })
      .sort({ date: -1 })
      .exec();
  }

  // ---------------------------------------------------------------------------
  // Arrivals
  // ---------------------------------------------------------------------------

  async saveArrival(data: IMarketArrival): Promise<MarketArrival> {
    const doc = new this.arrivalModel(data);
    return doc.save();
  }

  async saveArrivalBatch(records: IMarketArrival[]): Promise<void> {
    if (!records.length) return;
    await this.arrivalModel.bulkWrite(records.map((record) => ({
      updateOne: {
        filter: {
          source: record.source,
          state: record.state,
          market: record.market,
          commodity: record.commodity,
          variety: record.variety ?? null,
          date: record.date,
        },
        update: { $set: record },
        upsert: true,
      },
    })));
    this.logger.log(`Upserted ${records.length} arrival records to market_arrivals`);
  }

  async findArrivals(
    commodity?: string,
    market?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
  ): Promise<MarketArrival[]> {
    const filter: Record<string, any> = {};
    if (commodity) filter.commodity = new RegExp(commodity, 'i');
    if (market) filter.market = new RegExp(market, 'i');
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }
    return this.arrivalModel
      .find(filter)
      .sort({ date: 1 })
      .limit(limit)
      .exec();
  }

  // ---------------------------------------------------------------------------
  // Trends
  // ---------------------------------------------------------------------------

  async saveTrend(data: IMarketTrend): Promise<MarketTrend> {
    const doc = new this.trendModel(data);
    return doc.save();
  }

  async findTrends(
    commodity?: string,
    market?: string,
    period?: string,
    limit = 50,
  ): Promise<MarketTrend[]> {
    const filter: Record<string, any> = {};
    if (commodity) filter.commodity = new RegExp(commodity, 'i');
    if (market) filter.market = new RegExp(market, 'i');
    if (period) filter.period = period;
    return this.trendModel
      .find(filter)
      .sort({ startDate: -1 })
      .limit(limit)
      .exec();
  }

  // ---------------------------------------------------------------------------
  // Cache
  // ---------------------------------------------------------------------------

  async saveCache(data: IMarketCache): Promise<MarketCache> {
    // Upsert by key
    const doc = await this.cacheModel.findOneAndUpdate(
      { key: data.key },
      data,
      { upsert: true, new: true },
    );
    return doc as unknown as MarketCache;
  }

  async getCache(key: string): Promise<MarketCache | null> {
    return this.cacheModel
      .findOne({ key, expiresAt: { $gt: new Date() } })
      .exec();
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheModel.deleteOne({ key }).exec();
  }

  // ---------------------------------------------------------------------------
  // Aggregation — raw data access for MarketAggregationService
  // ---------------------------------------------------------------------------

  getPriceModel(): Model<MarketPriceV2Document> {
    return this.priceModel;
  }

  getArrivalModel(): Model<MarketArrivalDocument> {
    return this.arrivalModel;
  }
}
