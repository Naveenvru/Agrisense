import type { YieldAssessmentContext, YieldPredictionResult } from './yield-intelligence.types';
export interface YieldEstimatorStrategy {
    estimate(context: YieldAssessmentContext): YieldPredictionResult;
}
export declare const YIELD_ESTIMATOR = "YieldEstimatorStrategy";
