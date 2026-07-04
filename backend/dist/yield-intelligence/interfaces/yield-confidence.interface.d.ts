import type { YieldAssessmentContext, YieldConfidenceResult } from './yield-intelligence.types';
export interface YieldConfidenceCalculator {
    calculate(context: YieldAssessmentContext, yieldPerAcreKg: number): YieldConfidenceResult;
}
export declare const YIELD_CONFIDENCE_CALCULATOR = "YieldConfidenceCalculator";
