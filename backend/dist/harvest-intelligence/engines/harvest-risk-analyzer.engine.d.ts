import type { IHarvestRiskAnalyzer } from '../interfaces/harvest-risk.interface';
import type { WeatherContext, ActivityContext, RiskLevel } from '../interfaces/harvest-intelligence.types';
export declare class HarvestRiskAnalyzerEngine implements IHarvestRiskAnalyzer {
    analyzeRisk(weather: WeatherContext, activities: ActivityContext): {
        riskLevel: RiskLevel;
        riskPoints: number;
        riskFactors: string[];
        mitigations: string[];
        explanation: string;
    };
    private resolveRiskLevel;
}
