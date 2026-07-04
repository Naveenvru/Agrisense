import type { WeatherContext, LifecycleContext, StorageAdvice } from './harvest-intelligence.types';

export interface IHarvestStorageAdvisor {
  recommendStorage(
    qualityGrade: string,
    lifecycle: LifecycleContext,
    weather: WeatherContext,
  ): StorageAdvice;
}
export const HARVEST_STORAGE_ADVISOR = 'IHarvestStorageAdvisor';
