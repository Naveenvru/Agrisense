import type { YieldAssessmentContext, YieldQualityResult } from './yield-intelligence.types';
export interface YieldQualityAssessor {
    assess(context: YieldAssessmentContext, yieldPerAcreKg: number, confidence: number): YieldQualityResult;
}
export declare const YIELD_QUALITY_ASSESSOR = "YieldQualityAssessor";
