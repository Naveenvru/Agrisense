import type { IHarvestStorageAdvisor } from '../interfaces/harvest-storage.interface';
import type { WeatherContext, LifecycleContext, StorageAdvice } from '../interfaces/harvest-intelligence.types';
export declare class HarvestStorageAdvisorEngine implements IHarvestStorageAdvisor {
    recommendStorage(qualityGrade: string, lifecycle: LifecycleContext, weather: WeatherContext): StorageAdvice;
}
