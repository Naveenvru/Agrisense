import type { SupplyAssessmentContext, SupplyPredictionResult } from './supply-intelligence.types';

export interface SupplyEstimatorStrategy {
  estimate(context: SupplyAssessmentContext): SupplyPredictionResult;
}

export const SUPPLY_ESTIMATOR = 'SupplyEstimatorStrategy';