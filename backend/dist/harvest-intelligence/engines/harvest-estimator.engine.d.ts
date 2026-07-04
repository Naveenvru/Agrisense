import type { IHarvestEstimator } from '../interfaces/harvest-estimator.interface';
import type { YieldEstimate, QualityEstimate, LabourEstimate, EquipmentRecommendation, StorageAdvice, LifecycleContext, ActivityContext, WeatherContext } from '../interfaces/harvest-intelligence.types';
import { HarvestQualityAssessorEngine } from './harvest-quality-assessor.engine';
import { HarvestLabourEstimatorEngine } from './harvest-labour-estimator.engine';
import { HarvestEquipmentRecommenderEngine } from './harvest-equipment-recommender.engine';
import { HarvestStorageAdvisorEngine } from './harvest-storage-advisor.engine';
export declare class HarvestEstimatorEngine implements IHarvestEstimator {
    private readonly qualityAssessor;
    private readonly labourEstimator;
    private readonly equipmentRecommender;
    private readonly storageAdvisor;
    constructor(qualityAssessor: HarvestQualityAssessorEngine, labourEstimator: HarvestLabourEstimatorEngine, equipmentRecommender: HarvestEquipmentRecommenderEngine, storageAdvisor: HarvestStorageAdvisorEngine);
    estimateYield(estimatedYieldKg: number | null, areaAcres: number | null, lifecycle: LifecycleContext, activities: ActivityContext): YieldEstimate;
    estimateQuality(weather: WeatherContext, activities: ActivityContext, cropVariety: string | null, lifecycle: LifecycleContext): QualityEstimate;
    estimateLabour(areaAcres: number | null, cropName: string, harvestWindow: {
        optimalHarvestDate: Date;
    }): LabourEstimate;
    recommendEquipment(cropName: string, areaAcres: number | null, qualityGrade: string): EquipmentRecommendation;
    recommendStorage(qualityGrade: string, lifecycle: LifecycleContext, weather: WeatherContext): StorageAdvice;
}
