import { ICollector } from '../common/collector.interface';
import { CollectorLogger } from '../common/collector-logger.service';
import { CollectionParams, CollectionResult, CollectorStatus } from '../common/collector.types';
import { MockMarketDataSource } from './mock-market-data.source';
import { MandiApiDataSource } from './mandi-api.data-source';
import { DataLakeService } from '../../storage/datalake/datalake.service';
export declare class MarketCollector implements ICollector {
    private readonly mockDataSource;
    private readonly mandiApiDataSource;
    private readonly collectorLogger;
    private readonly dataLakeService;
    private readonly logger;
    private totalCollections;
    private successCount;
    private failureCount;
    private lastSuccessAt?;
    private lastFailureAt?;
    constructor(mockDataSource: MockMarketDataSource, mandiApiDataSource: MandiApiDataSource, collectorLogger: CollectorLogger, dataLakeService: DataLakeService);
    collect(params: CollectionParams): Promise<CollectionResult>;
    store(result: CollectionResult): Promise<void>;
    status(): CollectorStatus;
}
