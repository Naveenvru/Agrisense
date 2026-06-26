import type { IMarketRawRecord, MarketFetchParams } from '../../market/interfaces/market.interface';
export interface IMarketDataSource {
    readonly sourceName: string;
    fetchPrices(params: MarketFetchParams): Promise<IMarketRawRecord[]>;
    isAvailable(): Promise<boolean>;
}
