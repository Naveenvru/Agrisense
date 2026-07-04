import type { DemandAssessmentContext, DemandPredictionResult } from './demand-intelligence.types';
export interface DemandEstimatorStrategy {
    estimate(context: DemandAssessmentContext): DemandPredictionResult;
}
export declare const DEMAND_ESTIMATOR = "DemandEstimatorStrategy";
