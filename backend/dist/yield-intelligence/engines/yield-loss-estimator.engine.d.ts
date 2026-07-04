import type { YieldLossEstimator } from '../interfaces/yield-loss.interface';
import type { YieldAssessmentContext, YieldLossResult } from '../interfaces/yield-intelligence.types';
export declare class YieldLossEstimatorEngine implements YieldLossEstimator {
    estimate(context: YieldAssessmentContext, yieldBeforeLossKg: number, riskScore: number): YieldLossResult;
}
