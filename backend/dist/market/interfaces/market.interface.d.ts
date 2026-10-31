export interface IMarketRawRecord {
    commodity: string;
    variety?: string;
    grade?: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    arrivalQty?: number;
    unit: string;
    source: string;
    rawPayload?: string;
    providerFetchedAt?: Date;
    collectedAt: Date;
    batchId: string;
}
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
    variety?: string;
    grade?: string;
}
export interface IMarketArrival {
    commodity: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    arrivalQty?: number;
    unit: string;
    source: string;
    variety?: string;
}
export type TrendDirection = 'rising' | 'falling' | 'stable';
export type TrendPeriod = 'daily' | 'weekly' | 'monthly';
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
export interface IMarketCache {
    key: string;
    data: string;
    expiresAt: Date;
    source: string;
}
export interface MarketFetchParams {
    commodity?: string;
    market?: string;
    state?: string;
    district?: string;
    date?: Date;
    limit?: number;
}
export interface RawMarketInput {
    commodity: string;
    market: string;
    unit: string;
    date: string | Date;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    arrivalQty?: number;
    state: string;
    district: string;
    source: string;
    variety?: string;
    grade?: string;
}
export interface MarketValidationResult {
    valid: IMarketRawRecord[];
    rejected: Array<{
        record: IMarketRawRecord;
        reasons: string[];
    }>;
    totalInput: number;
    totalValid: number;
    totalRejected: number;
    totalDuplicates: number;
}
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
export interface MarketArrivalStats {
    commodity: string;
    market: string;
    date: Date;
    totalArrival: number;
    unit: string;
}
export interface MarketCollectParams {
    commodity?: string;
    market?: string;
    state?: string;
    district?: string;
    date?: Date;
    limit?: number;
}
