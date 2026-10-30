import { IMarketDataSource } from './market-data-source.interface';
import { IMarketRawRecord, MarketFetchParams } from '../../market/interfaces/market.interface';
export declare class MockMarketDataSource implements IMarketDataSource {
    readonly sourceName = "development_mock";
    private static readonly SAMPLE_DATA;
    fetchPrices(params: MarketFetchParams): Promise<IMarketRawRecord[]>;
    isAvailable(): Promise<boolean>;
    private vary;
}
