import { SupplyMongoService } from '../../mongodb/supply/supply-mongo.service';
import type { SupplyAnalyticsSnapshot } from '../interfaces/supply-intelligence.types';
export declare class SupplyAnalyticsService {
    private readonly supplyMongoService;
    constructor(supplyMongoService: SupplyMongoService);
    refreshGlobalAnalytics(): Promise<SupplyAnalyticsSnapshot>;
    refreshRegionalAnalytics(): Promise<void>;
    getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
    private buildSnapshot;
}
