import { Injectable, Logger } from '@nestjs/common';
import {
  IMarketRawRecord,
  IMarketPrice,
  IMarketArrival,
  RawMarketInput,
} from '../interfaces/market.interface';
import { INTEGRATION_CONSTANTS } from '../../integrations/common/integration.constants';

/**
 * MarketNormalizationService — Phase 9
 *
 * Transforms raw market records into normalized, consistent domain objects.
 *
 * Algorithms used
 * ────────────────
 * ✔ HashMap lookup tables — O(1) commodity, market, and unit normalization
 * ✔ Date normalization — standardize to UTC midnight
 * ✔ Price normalization — ensure numeric types and non-negative values
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No validation (that belongs to MarketQualityService)
 * ✗ No prediction or analytics
 * ✗ No persistence
 */
@Injectable()
export class MarketNormalizationService {
  private readonly logger = new Logger(MarketNormalizationService.name);

  // ---------------------------------------------------------------------------
  // HashMaps — O(1) normalization lookups
  // ---------------------------------------------------------------------------

  /** Commodity name normalization map */
  private readonly commodityMap = new Map<string, string>([
    ['paddy', 'Rice'],
    ['rice', 'Rice'],
    ['chawal', 'Rice'],
    ['wheat', 'Wheat'],
    ['gehun', 'Wheat'],
    ['maize', 'Maize'],
    ['corn', 'Maize'],
    ['makka', 'Maize'],
    ['jowar', 'Sorghum'],
    ['bajra', 'Pearl Millet'],
    ['ragi', 'Finger Millet'],
    ['tomato', 'Tomato'],
    ['tamatar', 'Tomato'],
    ['onion', 'Onion'],
    ['pyaaz', 'Onion'],
    ['kanda', 'Onion'],
    ['potato', 'Potato'],
    ['aloo', 'Potato'],
    ['arhar', 'Tur Dal'],
    ['tur', 'Tur Dal'],
    ['tur dal', 'Tur Dal'],
    ['moong', 'Moong Dal'],
    ['moong dal', 'Moong Dal'],
    ['urad', 'Urad Dal'],
    ['urad dal', 'Urad Dal'],
    ['masoor', 'Masoor Dal'],
    ['soyabean', 'Soyabean'],
    ['soybean', 'Soyabean'],
    ['groundnut', 'Groundnut'],
    ['mungfali', 'Groundnut'],
    ['cotton', 'Cotton'],
    ['kapas', 'Cotton'],
    ['sugarcane', 'Sugarcane'],
    ['ganna', 'Sugarcane'],
    ['banana', 'Banana'],
    ['kela', 'Banana'],
  ]);

  /** Market name normalization map */
  private readonly marketMap = new Map<string, string>([
    ['bengaluru apmc', 'Bengaluru APMC'],
    ['bangalore apmc', 'Bengaluru APMC'],
    ['bengaluru', 'Bengaluru APMC'],
    ['delhi azadpur', 'Delhi Azadpur Mandi'],
    ['azadpur', 'Delhi Azadpur Mandi'],
    ['azadpur mandi', 'Delhi Azadpur Mandi'],
    ['nashik apmc', 'Nashik APMC'],
    ['nashik', 'Nashik APMC'],
    ['agra mandi', 'Agra Mandi'],
    ['agra', 'Agra Mandi'],
    ['gulbarga apmc', 'Kalaburagi APMC'],
    ['kalaburagi apmc', 'Kalaburagi APMC'],
    ['latur apmc', 'Latur APMC'],
    ['latur', 'Latur APMC'],
    ['indore mandi', 'Indore Mandi'],
    ['indore', 'Indore Mandi'],
    ['ahmedabad apmc', 'Ahmedabad APMC'],
    ['ahmedabad', 'Ahmedabad APMC'],
    ['hyderabad market', 'Hyderabad Market'],
    ['hyderabad', 'Hyderabad Market'],
    ['chennai koyambedu', 'Chennai Koyambedu Market'],
    ['koyambedu', 'Chennai Koyambedu Market'],
  ]);

  /** Unit normalization map */
  private readonly unitMap = new Map<string, string>([
    ['qtl', 'Quintal'],
    ['quintal', 'Quintal'],
    ['q', 'Quintal'],
    ['kg', 'Kilogram'],
    ['kilogram', 'Kilogram'],
    ['kilograms', 'Kilogram'],
    ['ton', 'Tonne'],
    ['tonne', 'Tonne'],
    ['mt', 'Tonne'],
    ['metric ton', 'Tonne'],
    ['gm', 'Gram'],
    ['gram', 'Gram'],
    ['grams', 'Gram'],
    ['bag', 'Bag'],
    ['bags', 'Bag'],
    ['bale', 'Bale'],
    ['bales', 'Bale'],
    ['piece', 'Piece'],
    ['pieces', 'Piece'],
    ['dozen', 'Dozen'],
  ]);

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Normalize a batch of raw market records.
   * Returns both normalized prices and arrival records.
   */
  normalizeBatch(rawRecords: IMarketRawRecord[]): {
    prices: IMarketPrice[];
    arrivals: IMarketArrival[];
  } {
    const prices: IMarketPrice[] = [];
    const arrivals: IMarketArrival[] = [];
    const now = new Date();

    // Sort chronologically before processing
    const sorted = [...rawRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    for (const raw of sorted) {
      const price = this.normalizeToPrice(raw, now);
      if (price) prices.push(price);

      const arrival = this.normalizeToArrival(raw);
      if (arrival) arrivals.push(arrival);
    }

    this.logger.log(
      `Normalized ${rawRecords.length} raw records → ${prices.length} prices, ${arrivals.length} arrivals`,
    );

    return { prices, arrivals };
  }

  /**
   * Normalize a single raw market input (for pipeline use).
   */
  normalizeRecord(input: RawMarketInput): IMarketPrice {
    return {
      commodity: this.normalizeCommodity(input.commodity),
      market: this.normalizeMarket(input.market),
      district: input.district,
      state: input.state,
      date: this.normalizeDate(input.date),
      minPrice: this.normalizePrice(input.minPrice),
      maxPrice: this.normalizePrice(input.maxPrice),
      modalPrice: this.normalizePrice(input.modalPrice),
      unit: this.normalizeUnit(input.unit),
      source: input.source,
      normalizedAt: new Date(),
      qualityScore: 100,
    };
  }

  /**
   * Normalize a commodity name using the HashMap.
   * Falls back to Title Case of the original if no mapping found.
   */
  normalizeCommodity(raw: string): string {
    const key = raw.toLowerCase().trim();
    return this.commodityMap.get(key) ?? this.toTitleCase(raw);
  }

  /**
   * Normalize a market name using the HashMap.
   * Falls back to Title Case of the original if no mapping found.
   */
  normalizeMarket(raw: string): string {
    const key = raw.toLowerCase().trim();
    return this.marketMap.get(key) ?? this.toTitleCase(raw);
  }

  /**
   * Normalize a unit string using the HashMap.
   * Defaults to 'Quintal' if unrecognized.
   */
  normalizeUnit(raw: string): string {
    const key = raw.toLowerCase().trim();
    return this.unitMap.get(key) ?? 'Quintal';
  }

  /**
   * Normalize a date to UTC midnight.
   */
  normalizeDate(raw: string | Date): Date {
    const d = raw instanceof Date ? raw : new Date(raw);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  /**
   * Normalize a price value — ensure it is a non-negative number.
   */
  normalizePrice(raw: number): number {
    const val = Number(raw);
    return isNaN(val) || val < 0 ? 0 : Math.round(val * 100) / 100;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private normalizeToPrice(raw: IMarketRawRecord, normalizedAt: Date): IMarketPrice {
    return {
      commodity: this.normalizeCommodity(raw.commodity),
      market: this.normalizeMarket(raw.market),
      district: raw.district,
      state: raw.state,
      date: this.normalizeDate(raw.date),
      minPrice: this.normalizePrice(raw.minPrice),
      maxPrice: this.normalizePrice(raw.maxPrice),
      modalPrice: this.normalizePrice(raw.modalPrice),
      unit: this.normalizeUnit(raw.unit),
      source: raw.source ?? INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
      normalizedAt,
      qualityScore: 100, // updated by quality service
    };
  }

  private normalizeToArrival(raw: IMarketRawRecord): IMarketArrival {
    return {
      commodity: this.normalizeCommodity(raw.commodity),
      market: this.normalizeMarket(raw.market),
      district: raw.district,
      state: raw.state,
      date: this.normalizeDate(raw.date),
      arrivalQty: Math.max(0, raw.arrivalQty),
      unit: this.normalizeUnit(raw.unit),
      source: raw.source ?? INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
    };
  }

  private toTitleCase(s: string): string {
    return s
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
