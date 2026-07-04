import type { YieldConfidenceCalculator } from '../interfaces/yield-confidence.interface';
import type { YieldAssessmentContext, YieldConfidenceResult } from '../interfaces/yield-intelligence.types';
export declare class YieldConfidenceCalculatorEngine implements YieldConfidenceCalculator {
    calculate(context: YieldAssessmentContext, yieldPerAcreKg: number): YieldConfidenceResult;
}
