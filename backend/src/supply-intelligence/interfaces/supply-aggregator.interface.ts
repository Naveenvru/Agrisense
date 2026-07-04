import type { SupplyRegionalSummary } from './supply-intelligence.types';

export interface SupplyAggregator {
  getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<SupplyRegionalSummary>;
}

export const SUPPLY_AGGREGATOR = 'SupplyAggregator';