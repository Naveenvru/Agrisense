import type { DemandAssessmentContext, DemandRiskResult } from './demand-intelligence.types';
export interface DemandRiskAnalyzer {
    analyze(context: DemandAssessmentContext, expectedDemandKg: number, currentDemandKg: number): DemandRiskResult;
}
