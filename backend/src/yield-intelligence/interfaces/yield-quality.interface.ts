import type { YieldAssessmentContext, YieldQualityResult } from './yield-intelligence.types';

export interface YieldQualityAssessor {
  assess(context: YieldAssessmentContext, yieldPerAcreKg: number, confidence: number): YieldQualityResult;
}

export const YIELD_QUALITY_ASSESSOR = 'YieldQualityAssessor';
