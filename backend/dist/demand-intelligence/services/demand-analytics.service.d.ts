import { DemandMongoService } from '../../mongodb/demand/demand-mongo.service';
import type { DemandAnalyticsSnapshot } from '../interfaces/demand-intelligence.types';
export declare class DemandAnalyticsService {
    private readonly demandMongoService;
    constructor(demandMongoService: DemandMongoService);
    refreshGlobalAnalytics(): Promise<DemandAnalyticsSnapshot>;
    refreshRegionalAnalytics(): Promise<void>;
    getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
    private buildSnapshot;
}
