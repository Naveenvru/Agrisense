import type { YieldRiskAnalyzer } from '../interfaces/yield-risk.interface';
import type { YieldAssessmentContext, YieldRiskResult } from '../interfaces/yield-intelligence.types';
export declare class YieldRiskAnalyzerEngine implements YieldRiskAnalyzer {
    analyze(context: YieldAssessmentContext): YieldRiskResult;
}
