import type { SupplyEstimatorStrategy } from '../interfaces/supply-estimator.interface';
import type { SupplyAssessmentContext, SupplyPredictionResult } from '../interfaces/supply-intelligence.types';
import { SupplyRiskAnalyzerEngine } from './supply-risk-analyzer.engine';
import { SupplyConfidenceCalculatorEngine } from './supply-confidence-calculator.engine';
import { SupplyRecommendationEngine } from './supply-recommendation.engine';
export declare class RuleBasedSupplyEstimatorEngine implements SupplyEstimatorStrategy {
    private readonly riskAnalyzer;
    private readonly confidenceCalculator;
    private readonly recommendationEngine;
    constructor(riskAnalyzer: SupplyRiskAnalyzerEngine, confidenceCalculator: SupplyConfidenceCalculatorEngine, recommendationEngine: SupplyRecommendationEngine);
    estimate(context: SupplyAssessmentContext): SupplyPredictionResult;
    private resolveBaseSupplyPerAcre;
    private resolveHarvestFactor;
    private resolveYieldFactor;
    private resolveWeatherFactor;
    private resolveActivityFactor;
    private resolveRegionFactor;
    private resolveHistoricalFactor;
    private resolveAvailabilityFactor;
    private buildTimeline;
    private buildSeasonalAnalysis;
}
