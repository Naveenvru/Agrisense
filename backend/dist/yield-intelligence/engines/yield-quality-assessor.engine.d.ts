import type { YieldQualityAssessor } from '../interfaces/yield-quality.interface';
import type { YieldAssessmentContext, YieldQualityResult } from '../interfaces/yield-intelligence.types';
export declare class YieldQualityAssessorEngine implements YieldQualityAssessor {
    assess(context: YieldAssessmentContext, yieldPerAcreKg: number, confidence: number): YieldQualityResult;
}
