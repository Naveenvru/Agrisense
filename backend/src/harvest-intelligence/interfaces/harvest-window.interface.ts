import type { LifecycleContext, WeatherContext, HarvestWindow } from './harvest-intelligence.types';

export interface IHarvestWindowCalculator {
  calculateWindow(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
  ): HarvestWindow;
}
export const HARVEST_WINDOW_CALCULATOR = 'IHarvestWindowCalculator';
