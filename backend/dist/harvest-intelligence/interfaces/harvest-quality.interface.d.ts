import type { WeatherContext, ActivityContext, LifecycleContext, QualityEstimate } from './harvest-intelligence.types';
export interface IHarvestQualityAssessor {
    assessQuality(weather: WeatherContext, activities: ActivityContext, cropVariety: string | null, lifecycle: LifecycleContext): QualityEstimate;
}
export declare const HARVEST_QUALITY_ASSESSOR = "IHarvestQualityAssessor";
