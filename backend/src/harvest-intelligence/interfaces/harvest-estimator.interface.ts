import type { YieldEstimate, QualityEstimate, LabourEstimate, EquipmentRecommendation, StorageAdvice } from './harvest-intelligence.types';
import type { LifecycleContext, ActivityContext, WeatherContext } from './harvest-intelligence.types';

/**
 * IHarvestEstimator
 *
 * Contract for estimating harvest quantities, quality, labour, equipment, and storage.
 * Deliberately scoped to estimation only — no price or revenue calculations.
 * Phase 15 (Price Prediction) will extend this pattern for financial forecasting.
 */
export interface IHarvestEstimator {
  /**
   * Estimate expected harvest quantity based on parcel area and crop parameters.
   * Does NOT calculate revenue. Revenue belongs to Phase 15.
   */
  estimateYield(
    estimatedYieldKg: number | null,
    areaAcres: number | null,
    lifecycle: LifecycleContext,
    activities: ActivityContext,
  ): YieldEstimate;

  /**
   * Estimate expected harvest quality grade (A / B / C).
   */
  estimateQuality(
    weather: WeatherContext,
    activities: ActivityContext,
    cropVariety: string | null,
    lifecycle: LifecycleContext,
  ): QualityEstimate;

  /**
   * Estimate labour requirements for harvesting.
   */
  estimateLabour(
    areaAcres: number | null,
    cropName: string,
    harvestWindow: { optimalHarvestDate: Date },
  ): LabourEstimate;

  /**
   * Recommend equipment based on crop type and area.
   */
  recommendEquipment(
    cropName: string,
    areaAcres: number | null,
    qualityGrade: string,
  ): EquipmentRecommendation;

  /**
   * Recommend storage strategy based on quality and timing.
   */
  recommendStorage(
    qualityGrade: string,
    lifecycle: LifecycleContext,
    weather: WeatherContext,
  ): StorageAdvice;
}

export const HARVEST_ESTIMATOR = 'IHarvestEstimator';
