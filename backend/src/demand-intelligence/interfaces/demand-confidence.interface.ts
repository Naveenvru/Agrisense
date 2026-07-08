import type { DemandAssessmentContext, DemandPredictionResult } from './demand-intelligence.types';

export interface DemandConfidenceCalculator {
  calculate(context: DemandAssessmentContext, expectedDemandKg: number, currentDemandKg: number): DemandPredictionResult['confidence'];
}
