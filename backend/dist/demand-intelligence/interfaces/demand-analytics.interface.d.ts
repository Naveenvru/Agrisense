import type { DemandAnalyticsSnapshot } from './demand-intelligence.types';
export interface DemandAnalyticsServiceContract {
    refreshGlobalAnalytics(): Promise<DemandAnalyticsSnapshot>;
    getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
}
