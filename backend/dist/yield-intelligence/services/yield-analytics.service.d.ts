import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import type { YieldAnalyticsSnapshot } from '../interfaces/yield-intelligence.types';
export declare class YieldAnalyticsService {
    private readonly yieldMongoService;
    constructor(yieldMongoService: YieldMongoService);
    refreshGlobalAnalytics(): Promise<YieldAnalyticsSnapshot>;
    getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
}
