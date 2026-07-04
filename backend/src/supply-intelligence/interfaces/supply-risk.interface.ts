import type { SupplyAssessmentContext, SupplyRiskResult } from './supply-intelligence.types';

export interface SupplyRiskAnalyzer {
  analyze(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): SupplyRiskResult;
}