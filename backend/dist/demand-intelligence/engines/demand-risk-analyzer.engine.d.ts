import type { DemandAssessmentContext, DemandRiskResult } from '../interfaces/demand-intelligence.types';
export declare class DemandRiskAnalyzerEngine {
    analyze(context: DemandAssessmentContext, expectedDemandKg: number): DemandRiskResult;
}
