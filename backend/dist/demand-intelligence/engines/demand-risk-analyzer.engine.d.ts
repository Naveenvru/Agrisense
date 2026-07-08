import type { DemandRiskAnalyzer } from '../interfaces/demand-risk.interface';
import type { DemandAssessmentContext, DemandRiskResult } from '../interfaces/demand-intelligence.types';
export declare class DemandRiskAnalyzerEngine implements DemandRiskAnalyzer {
    analyze(context: DemandAssessmentContext, expectedDemandKg: number, currentDemandKg: number): DemandRiskResult;
}
