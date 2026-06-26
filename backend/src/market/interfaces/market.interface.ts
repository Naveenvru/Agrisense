/**
 * Market Intelligence Interfaces — Phase 9
 *
 * Core domain types for the Market Intelligence module.
 * All services and repositories consume these interfaces exclusively.
 */

// ---------------------------------------------------------------------------
// Raw Market Record
// ---------------------------------------------------------------------------

/** Raw record as received from any market data source (AGMARKNET / mock / CSV) */
export interface IMarketRawRecord {
  commodity: string;
  variety?: string;
  market: string;
  district: string;
  state: string;
  date: Date;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQty: number;
  unit: string;
  source: string;
  rawPayload?: string;
  collectedAt: Date;
  batchId: string;
}

// ---------------------------------------------------------------------------
// Normalized Market Price
// ---------------------------------------------------------------------------

/** Normalized, quality-validated market price ready for MongoDB persistence */
export interface IMarketPrice {
  commodity: string;
  market: string;
  district: string;
  state: string;
  date: Date;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  source: string;
  normalizedAt: Date;
  qualityScore: number;
}

// ---------------------------------------------------------------------------
// Market Arrival
// ---------------------------------------------------------------------------

/** Arrival quantity data for a commodity at a market on a given date */
export interface IMarketArrival {
  commodity: string;
  market: string;
  district: string;
  state: string;
  date: Date;
  arrivalQty: number;
  unit: string;
  source: string;
}

// ---------------------------------------------------------------------------
// Market Trend
// ---------------------------------------------------------------------------

export type TrendDirection = 'rising' | 'falling' | 'stable';
export type TrendPeriod = 'daily' | 'weekly' | 'monthly';

/** Aggregated trend record computed from price history */
export interface IMarketTrend {
  commodity: string;
  market: string;
  state: string;
  district: string;
  period: TrendPeriod;
  startDate: Date;
  endDate: Date;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  totalArrival: number;
  trend: TrendDirection;
}

// ---------------------------------------------------------------------------
// Market Cache Entry
// ---------------------------------------------------------------------------

/** Short-lived cache entry to avoid redundant DB queries */
export interface IMarketCache {
  key: string;
  data: string;
  expiresAt: Date;
  source: string;
}

// ---------------------------------------------------------------------------
// Data Source Abstraction
// ---------------------------------------------------------------------------

/** Payload passed to IMarketDataSource.fetchPrices() */
export interface MarketFetchParams {
  commodity?: string;
  market?: string;
  state?: string;
  district?: string;
  date?: Date;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/** Input record going into the normalization pipeline */
export interface RawMarketInput {
  commodity: string;
  market: string;
  unit: string;
  date: string | Date;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQty: number;
  state: string;
  district: string;
  source: string;
  variety?: string;
}

// ---------------------------------------------------------------------------
// Data Quality
// ---------------------------------------------------------------------------

/** Outcome of validating a single market record */
export interface MarketValidationResult {
  valid: IMarketRawRecord[];
  rejected: Array<{ record: IMarketRawRecord; reasons: string[] }>;
  totalInput: number;
  totalValid: number;
  totalRejected: number;
  totalDuplicates: number;
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

/** Result of a price statistics aggregation query */
export interface MarketPriceStats {
  commodity: string;
  market: string;
  startDate: Date;
  endDate: Date;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  recordCount: number;
}

/** Result of a total arrivals aggregation query */
export interface MarketArrivalStats {
  commodity: string;
  market: string;
  date: Date;
  totalArrival: number;
  unit: string;
}

// ---------------------------------------------------------------------------
// Collection trigger
// ---------------------------------------------------------------------------

/** Parameters for triggering a market collection */
export interface MarketCollectParams {
  commodity?: string;
  market?: string;
  state?: string;
  district?: string;
  date?: Date;
}
