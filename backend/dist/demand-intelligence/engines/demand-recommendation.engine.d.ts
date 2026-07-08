import type { DemandAssessmentContext, DemandRecommendation, DemandRiskResult } from '../interfaces/demand-intelligence.types';
export declare class DemandRecommendationEngine {
    recommend(context: DemandAssessmentContext, risk: DemandRiskResult, demandGapPercent: number): DemandRecommendation[];
}
