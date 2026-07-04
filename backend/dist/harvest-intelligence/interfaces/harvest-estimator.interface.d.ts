import type { YieldEstimate, QualityEstimate, LabourEstimate, EquipmentRecommendation, StorageAdvice } from './harvest-intelligence.types';
import type { LifecycleContext, ActivityContext, WeatherContext } from './harvest-intelligence.types';
export interface IHarvestEstimator {
    estimateYield(estimatedYieldKg: number | null, areaAcres: number | null, lifecycle: LifecycleContext, activities: ActivityContext): YieldEstimate;
    estimateQuality(weather: WeatherContext, activities: ActivityContext, cropVariety: string | null, lifecycle: LifecycleContext): QualityEstimate;
    estimateLabour(areaAcres: number | null, cropName: string, harvestWindow: {
        optimalHarvestDate: Date;
    }): LabourEstimate;
    recommendEquipment(cropName: string, areaAcres: number | null, qualityGrade: string): EquipmentRecommendation;
    recommendStorage(qualityGrade: string, lifecycle: LifecycleContext, weather: WeatherContext): StorageAdvice;
}
export declare const HARVEST_ESTIMATOR = "IHarvestEstimator";
