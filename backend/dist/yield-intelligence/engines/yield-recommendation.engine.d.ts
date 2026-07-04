import type { YieldRecommendationEngine } from '../interfaces/yield-recommendation.interface';
import type { YieldAssessmentContext, YieldRecommendation, YieldRiskResult, YieldLossResult, YieldConfidenceResult } from '../interfaces/yield-intelligence.types';
export declare class YieldRecommendationEngineImpl implements YieldRecommendationEngine {
    recommend(context: YieldAssessmentContext, risk: YieldRiskResult, loss: YieldLossResult, confidence: YieldConfidenceResult): YieldRecommendation[];
}
