import type { DemandAssessmentContext } from '../interfaces/demand-intelligence.types';
export declare class DemandConfidenceCalculatorEngine {
    calculate(context: DemandAssessmentContext, expectedDemandKg: number): number;
}
