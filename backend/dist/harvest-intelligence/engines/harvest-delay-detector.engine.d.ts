import type { IHarvestDelayDetector } from '../interfaces/harvest-delay.interface';
import type { LifecycleContext, WeatherContext, ActivityContext } from '../interfaces/harvest-intelligence.types';
export declare class HarvestDelayDetectorEngine implements IHarvestDelayDetector {
    detectDelay(lifecycle: LifecycleContext, weather: WeatherContext, activities: ActivityContext): {
        hasDelay: boolean;
        delayDays: number;
        delayReasons: string[];
        suggestedActions: string[];
        explanation: string;
    };
}
