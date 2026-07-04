import type { YieldEstimatorStrategy } from '../interfaces/yield-estimator.interface';
import type { YieldAssessmentContext, YieldPredictionResult } from '../interfaces/yield-intelligence.types';
import { YieldRiskAnalyzerEngine } from './yield-risk-analyzer.engine';
import { YieldConfidenceCalculatorEngine } from './yield-confidence-calculator.engine';
import { YieldQualityAssessorEngine } from './yield-quality-assessor.engine';
import { YieldLossEstimatorEngine } from './yield-loss-estimator.engine';
import { YieldRecommendationEngineImpl } from './yield-recommendation.engine';
export declare class RuleBasedYieldEstimatorEngine implements YieldEstimatorStrategy {
    private readonly riskAnalyzer;
    private readonly confidenceCalculator;
    private readonly qualityAssessor;
    private readonly lossEstimator;
    private readonly recommendationEngine;
    constructor(riskAnalyzer: YieldRiskAnalyzerEngine, confidenceCalculator: YieldConfidenceCalculatorEngine, qualityAssessor: YieldQualityAssessorEngine, lossEstimator: YieldLossEstimatorEngine, recommendationEngine: YieldRecommendationEngineImpl);
    estimate(context: YieldAssessmentContext): YieldPredictionResult;
    private resolveBaseYieldPerAcre;
    private resolveSoilFactor;
    private resolveIrrigationFactor;
    private resolveWeatherFactor;
    private resolveLifecycleFactor;
    private resolveActivityFactor;
    private resolveVarietyFactor;
    private resolveHistoryFactor;
}
