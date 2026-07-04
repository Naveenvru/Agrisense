import type { LifecycleContext } from './harvest-intelligence.types';

/**
 * IHarvestLifecycleEngine
 *
 * Contract for computing crop lifecycle state from sowing date and crop duration.
 * Implementations are swappable — enables AI-enhanced lifecycle estimation in Phase 12.
 */
export interface IHarvestLifecycleEngine {
  /**
   * Compute the full lifecycle context for a farmer crop.
   *
   * @param sowingDate      Date the crop was sown
   * @param durationDays    Expected full growth duration from Crop master data
   * @param expectedHarvestDate  Manual override if set by farmer
   * @returns Complete lifecycle context with stage, percentages, and dates
   */
  compute(
    sowingDate: Date,
    durationDays: number,
    expectedHarvestDate: Date | null,
  ): LifecycleContext;
}

export const HARVEST_LIFECYCLE_ENGINE = 'IHarvestLifecycleEngine';
