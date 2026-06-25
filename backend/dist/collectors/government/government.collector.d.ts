import { ICollector } from '../common/collector.interface';
import { CollectorLogger } from '../common/collector-logger.service';
import { CollectionParams, CollectionResult, CollectorStatus } from '../common/collector.types';
export declare class GovernmentCollector implements ICollector {
    private readonly collectorLogger;
    private readonly logger;
    private totalCollections;
    private successCount;
    private failureCount;
    constructor(collectorLogger: CollectorLogger);
    collect(_params: CollectionParams): Promise<CollectionResult>;
    store(result: CollectionResult): Promise<void>;
    status(): CollectorStatus;
}
