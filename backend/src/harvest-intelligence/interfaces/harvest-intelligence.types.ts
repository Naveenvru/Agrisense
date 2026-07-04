/**
 * Harvest Intelligence — Shared Types
 *
 * Canonical domain types used across all harvest intelligence interfaces and engines.
 * All Phase 12-16 modules should import from here, not re-declare these types.
 */

/** Named lifecycle stage based on growth percentage */
export type LifecycleStage =
  | 'pre-sowing'
  | 'seedling'
  | 'vegetative'
  | 'reproductive'
  | 'ripening'
  | 'ready'
  | 'overdue'
  | 'harvested';

/** Categorical readiness status */
export type ReadinessStatus =
  | 'not-ready'
  | 'developing'
  | 'almost-ready'
  | 'ready'
  | 'harvested';

/** Risk classification */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/** Harvest quality grade */
export type QualityGrade = 'A' | 'B' | 'C';

/** Storage recommendation */
export type StorageRecommendation =
  | 'immediate-sale'
  | 'warehouse'
  | 'cold-storage'
  | 'temporary-storage';

/** Lifecycle computation result */
export interface LifecycleContext {
  sowingDate: Date;
  durationDays: number;
  expectedHarvestDate: Date | null;
  daysElapsed: number;
  daysRemaining: number;
  growthPercentage: number;
  lifecycleStage: LifecycleStage;
}

/** Weather context snapshot for assessment engines */
export interface WeatherContext {
  currentTemperature?: number;
  currentHumidity?: number;
  currentRainfall?: number;
  forecastRainProbability?: number;
  forecastTemperature?: number;
  weatherCondition?: string;
  hasRainForecast: boolean;
  hasHeatStress: boolean;
  hasColdStress: boolean;
  hasFloodRisk: boolean;
}

/** Calendar activity context */
export interface ActivityContext {
  totalEvents: number;
  completedEvents: number;
  pendingEvents: number;
  overduePendingEvents: number;
  completionRate: number;
  hasLateIrrigation: boolean;
  hasLateFertilizer: boolean;
  hasMissedActivities: boolean;
}

/** Harvest window specification */
export interface HarvestWindow {
  earliestHarvestDate: Date;
  optimalHarvestDate: Date;
  latestSafeHarvestDate: Date;
  windowDays: number;
  explanation: string;
}

/** Harvest delay result */
export interface HarvestDelay {
  hasDelay: boolean;
  delayDays: number;
  delayReasons: string[];
  suggestedActions: string[];
}

/** Labour estimate */
export interface LabourEstimate {
  workersRequired: number;
  harvestDurationDays: number;
  suggestedStartDate: Date;
  estimatedLabourHours: number;
  explanation: string;
}

/** Equipment recommendation */
export interface EquipmentRecommendation {
  recommended: string[];
  explanation: string;
}

/** Storage advice */
export interface StorageAdvice {
  recommendation: StorageRecommendation;
  explanation: string;
}

/** Yield estimate */
export interface YieldEstimate {
  expectedYieldKg: number;
  yieldConfidence: number;
  explanation: string;
}

/** Quality estimate */
export interface QualityEstimate {
  grade: QualityGrade;
  explanation: string;
  factors: string[];
}
