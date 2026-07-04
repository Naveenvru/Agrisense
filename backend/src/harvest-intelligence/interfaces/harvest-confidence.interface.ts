import type { LifecycleContext, WeatherContext, ActivityContext } from './harvest-intelligence.types';

export interface IHarvestConfidenceCalculator {
  calculateConfidence(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
    activities: ActivityContext,
  ): {
    confidence: number;
    explanation: string;
  };
}
export const HARVEST_CONFIDENCE_CALCULATOR = 'IHarvestConfidenceCalculator';
