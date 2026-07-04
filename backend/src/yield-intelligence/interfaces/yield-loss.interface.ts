import type { YieldAssessmentContext, YieldLossResult } from './yield-intelligence.types';

export interface YieldLossEstimator {
  estimate(context: YieldAssessmentContext, yieldBeforeLossKg: number, riskScore: number): YieldLossResult;
}

export const YIELD_LOSS_ESTIMATOR = 'YieldLossEstimator';
