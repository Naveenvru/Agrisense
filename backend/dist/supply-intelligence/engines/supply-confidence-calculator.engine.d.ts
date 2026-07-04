import type { SupplyAssessmentContext } from '../interfaces/supply-intelligence.types';
export declare class SupplyConfidenceCalculatorEngine {
    calculate(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): number;
}
