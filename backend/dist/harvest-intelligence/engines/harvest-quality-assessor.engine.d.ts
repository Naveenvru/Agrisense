import type { IHarvestQualityAssessor } from '../interfaces/harvest-quality.interface';
import type { WeatherContext, ActivityContext, LifecycleContext, QualityEstimate } from '../interfaces/harvest-intelligence.types';
export declare class HarvestQualityAssessorEngine implements IHarvestQualityAssessor {
    assessQuality(weather: WeatherContext, activities: ActivityContext, cropVariety: string | null, lifecycle: LifecycleContext): QualityEstimate;
}
