import type { DemandRegionalSummary } from './demand-intelligence.types';
export interface DemandAggregator {
    getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<DemandRegionalSummary>;
}
export declare const DEMAND_AGGREGATOR = "DemandAggregator";
