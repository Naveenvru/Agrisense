import type {
  LifecycleContext,
  WeatherContext,
  ActivityContext,
  HarvestWindow,
  HarvestDelay,
  ReadinessStatus,
  RiskLevel,
} from './harvest-intelligence.types';

/**
 * Complete harvest assessment result returned by IHarvestAssessmentStrategy.
 * This is the core output of Phase 11 — all API responses are derived from this.
 */
export interface IHarvestAssessmentResult {
  /** 0–100 readiness percentage */
  readinessScore: number;
  readinessStatus: ReadinessStatus;

  /** 0–100 composite harvest score (accounts for weather, disease, soil, activities) */
  harvestScore: number;

  /** 0–100 confidence in this assessment */
  confidenceScore: number;

  /** Risk classification and explanation */
  riskLevel: RiskLevel;
  riskFactors: string[];
  mitigationRecommendations: string[];

  /** Harvest window */
  harvestWindow: HarvestWindow;

  /** Delay detection */
  harvestDelay: HarvestDelay;

  /** Ordered list of plain-language explanations */
  explanations: string[];
}

/**
 * IHarvestAssessmentStrategy
 *
 * Strategy interface for harvest readiness assessment.
 * Implementations can use rule-based logic (Phase 11) or ML models (Phase 12+).
 * Follows the Strategy pattern — swap without changing HarvestIntelligenceService.
 */
export interface IHarvestAssessmentStrategy {
  /**
   * Evaluate harvest readiness given lifecycle, weather, and activity context.
   */
  evaluate(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
    activities: ActivityContext,
    cropTemperatureMin: number | null,
    cropTemperatureMax: number | null,
  ): IHarvestAssessmentResult;
}

export const HARVEST_ASSESSMENT_STRATEGY = 'IHarvestAssessmentStrategy';
