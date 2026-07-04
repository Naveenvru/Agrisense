import type { DemandEstimatorStrategy } from '../interfaces/demand-estimator.interface';
import type { DemandAssessmentContext, DemandPredictionResult } from '../interfaces/demand-intelligence.types';
import { DemandRiskAnalyzerEngine } from './demand-risk-analyzer.engine';
import { DemandConfidenceCalculatorEngine } from './demand-confidence-calculator.engine';
import { DemandRecommendationEngine } from './demand-recommendation.engine';
export declare class RuleBasedDemandEstimatorEngine implements DemandEstimatorStrategy {
    private readonly riskAnalyzer;
    private readonly confidenceCalculator;
    private readonly recommendationEngine;
    constructor(riskAnalyzer: DemandRiskAnalyzerEngine, confidenceCalculator: DemandConfidenceCalculatorEngine, recommendationEngine: DemandRecommendationEngine);
    estimate(context: DemandAssessmentContext): DemandPredictionResult;
}
