import type { YieldAssessmentContext, YieldConfidenceResult } from './yield-intelligence.types';

export interface YieldConfidenceCalculator {
  calculate(context: YieldAssessmentContext, yieldPerAcreKg: number): YieldConfidenceResult;
}

export const YIELD_CONFIDENCE_CALCULATOR = 'YieldConfidenceCalculator';
