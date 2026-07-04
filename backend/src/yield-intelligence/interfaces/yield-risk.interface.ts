import type { YieldAssessmentContext, YieldRiskResult } from './yield-intelligence.types';

export interface YieldRiskAnalyzer {
  analyze(context: YieldAssessmentContext): YieldRiskResult;
}

export const YIELD_RISK_ANALYZER = 'YieldRiskAnalyzer';
