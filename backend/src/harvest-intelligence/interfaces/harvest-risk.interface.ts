import type { WeatherContext, ActivityContext, RiskLevel } from './harvest-intelligence.types';

export interface IHarvestRiskAnalyzer {
  analyzeRisk(weather: WeatherContext, activities: ActivityContext): {
    riskLevel: RiskLevel;
    riskPoints: number;
    riskFactors: string[];
    mitigations: string[];
    explanation: string;
  };
}
export const HARVEST_RISK_ANALYZER = 'IHarvestRiskAnalyzer';
