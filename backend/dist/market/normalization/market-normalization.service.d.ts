import { IMarketRawRecord, IMarketPrice, IMarketArrival, RawMarketInput } from '../interfaces/market.interface';
export declare class MarketNormalizationService {
    private readonly logger;
    private readonly commodityMap;
    private readonly marketMap;
    private readonly unitMap;
    normalizeBatch(rawRecords: IMarketRawRecord[]): {
        prices: IMarketPrice[];
        arrivals: IMarketArrival[];
    };
    normalizeRecord(input: RawMarketInput): IMarketPrice;
    normalizeCommodity(raw: string): string;
    normalizeMarket(raw: string): string;
    normalizeUnit(raw: string): string;
    normalizeDate(raw: string | Date): Date;
    normalizePrice(raw: number): number;
    private normalizeToPrice;
    private normalizeToArrival;
    private toTitleCase;
}
