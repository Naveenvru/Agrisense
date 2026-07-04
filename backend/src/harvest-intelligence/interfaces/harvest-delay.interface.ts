import type { LifecycleContext, WeatherContext, ActivityContext, HarvestDelay } from './harvest-intelligence.types';

export interface IHarvestDelayDetector {
  detectDelay(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
    activities: ActivityContext,
  ): HarvestDelay & { explanation?: string };
}
export const HARVEST_DELAY_DETECTOR = 'IHarvestDelayDetector';
