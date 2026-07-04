import type { YieldAnalyticsSnapshot } from './yield-intelligence.types';
export interface YieldAnalyticsServiceContract {
    refreshGlobalAnalytics(): Promise<YieldAnalyticsSnapshot>;
    getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
}
