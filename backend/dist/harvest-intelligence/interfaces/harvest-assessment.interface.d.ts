import type { LifecycleContext, WeatherContext, ActivityContext, HarvestWindow, HarvestDelay, ReadinessStatus, RiskLevel } from './harvest-intelligence.types';
export interface IHarvestAssessmentResult {
    readinessScore: number;
    readinessStatus: ReadinessStatus;
    harvestScore: number;
    confidenceScore: number;
    riskLevel: RiskLevel;
    riskFactors: string[];
    mitigationRecommendations: string[];
    harvestWindow: HarvestWindow;
    harvestDelay: HarvestDelay;
    explanations: string[];
}
export interface IHarvestAssessmentStrategy {
    evaluate(lifecycle: LifecycleContext, weather: WeatherContext, activities: ActivityContext, cropTemperatureMin: number | null, cropTemperatureMax: number | null): IHarvestAssessmentResult;
}
export declare const HARVEST_ASSESSMENT_STRATEGY = "IHarvestAssessmentStrategy";
