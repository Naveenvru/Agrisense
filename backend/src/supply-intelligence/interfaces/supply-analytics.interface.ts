import type { SupplyAnalyticsSnapshot } from './supply-intelligence.types';

export interface SupplyAnalyticsServiceContract {
  refreshGlobalAnalytics(): Promise<SupplyAnalyticsSnapshot>;
  getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
}