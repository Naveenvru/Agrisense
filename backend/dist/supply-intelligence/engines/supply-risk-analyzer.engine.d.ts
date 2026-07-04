import type { SupplyRiskAnalyzer } from '../interfaces/supply-risk.interface';
import type { SupplyAssessmentContext, SupplyRiskResult } from '../interfaces/supply-intelligence.types';
export declare class SupplyRiskAnalyzerEngine implements SupplyRiskAnalyzer {
    analyze(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): SupplyRiskResult;
}
