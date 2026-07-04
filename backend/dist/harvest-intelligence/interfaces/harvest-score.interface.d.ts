import type { WeatherContext, LifecycleContext } from './harvest-intelligence.types';
export interface IHarvestScoreCalculator {
    calculateScore(readinessScore: number, riskPoints: number, completionRate: number, weather: WeatherContext, lifecycle: LifecycleContext, tempMin: number | null, tempMax: number | null): {
        score: number;
        explanation: string;
    };
}
export declare const HARVEST_SCORE_CALCULATOR = "IHarvestScoreCalculator";
