import type { YieldAssessmentContext, YieldRecommendation, YieldRiskResult, YieldLossResult, YieldConfidenceResult } from './yield-intelligence.types';

export interface YieldRecommendationEngine {
  recommend(
    context: YieldAssessmentContext,
    risk: YieldRiskResult,
    loss: YieldLossResult,
    confidence: YieldConfidenceResult,
  ): YieldRecommendation[];
}

export const YIELD_RECOMMENDATION_ENGINE = 'YieldRecommendationEngine';
