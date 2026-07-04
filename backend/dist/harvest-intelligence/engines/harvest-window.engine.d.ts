import type { IHarvestWindowCalculator } from '../interfaces/harvest-window.interface';
import type { LifecycleContext, WeatherContext, HarvestWindow } from '../interfaces/harvest-intelligence.types';
export declare class HarvestWindowCalculatorEngine implements IHarvestWindowCalculator {
    calculateWindow(lifecycle: LifecycleContext, weather: WeatherContext): HarvestWindow;
}
