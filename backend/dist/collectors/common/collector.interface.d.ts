import { CollectionParams, CollectionResult, CollectorStatus } from './collector.types';
export interface ICollector {
    collect(params: CollectionParams): Promise<CollectionResult>;
    store(result: CollectionResult): Promise<void>;
    status(): CollectorStatus;
}
