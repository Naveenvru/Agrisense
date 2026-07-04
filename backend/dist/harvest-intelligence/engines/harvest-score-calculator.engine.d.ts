import type { IHarvestScoreCalculator } from '../interfaces/harvest-score.interface';
import type { WeatherContext, LifecycleContext } from '../interfaces/harvest-intelligence.types';
export declare class HarvestScoreCalculatorEngine implements IHarvestScoreCalculator {
    calculateScore(readinessScore: number, riskPoints: number, completionRate: number, weather: WeatherContext, lifecycle: LifecycleContext, tempMin: number | null, tempMax: number | null): {
        score: number;
        explanation: string;
    };
}
