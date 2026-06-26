import { IMarketDataSource } from './market-data-source.interface';
import { IMarketRawRecord, MarketFetchParams } from '../../market/interfaces/market.interface';
export declare class MockMarketDataSource implements IMarketDataSource {
    readonly sourceName: "agmarknet";
    private static readonly SAMPLE_DATA;
    fetchPrices(params: MarketFetchParams): Promise<IMarketRawRecord[]>;
    isAvailable(): Promise<boolean>;
    private vary;
}
