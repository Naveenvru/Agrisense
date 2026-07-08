import type { DemandAssessmentContext, DemandPredictionResult } from './demand-intelligence.types';

export interface DemandEstimatorStrategy {
  estimate(context: DemandAssessmentContext): DemandPredictionResult;
}

export const DEMAND_ESTIMATOR = 'DemandEstimatorStrategy';
