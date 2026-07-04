import type { IHarvestConfidenceCalculator } from '../interfaces/harvest-confidence.interface';
import type { LifecycleContext, WeatherContext, ActivityContext } from '../interfaces/harvest-intelligence.types';
export declare class HarvestConfidenceCalculatorEngine implements IHarvestConfidenceCalculator {
    calculateConfidence(lifecycle: LifecycleContext, weather: WeatherContext, activities: ActivityContext): {
        confidence: number;
        explanation: string;
    };
}
