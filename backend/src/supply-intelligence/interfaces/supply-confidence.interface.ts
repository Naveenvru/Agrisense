import type { SupplyAssessmentContext, SupplyPredictionResult } from './supply-intelligence.types';

export interface SupplyConfidenceCalculator {
  calculate(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): SupplyPredictionResult['confidence'];
}