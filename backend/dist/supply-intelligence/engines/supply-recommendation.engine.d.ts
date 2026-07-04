import type { SupplyAssessmentContext, SupplyRecommendation, SupplyRiskResult } from '../interfaces/supply-intelligence.types';
export declare class SupplyRecommendationEngine {
    recommend(context: SupplyAssessmentContext, risk: SupplyRiskResult, supplyDropPercent: number): SupplyRecommendation[];
}
