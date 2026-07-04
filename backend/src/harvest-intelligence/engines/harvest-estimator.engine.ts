import { Injectable } from '@nestjs/common';
import type { IHarvestEstimator } from '../interfaces/harvest-estimator.interface';
import type {
  YieldEstimate,
  QualityEstimate,
  LabourEstimate,
  EquipmentRecommendation,
  StorageAdvice,
  LifecycleContext,
  ActivityContext,
  WeatherContext,
} from '../interfaces/harvest-intelligence.types';
import { HarvestQualityAssessorEngine } from './harvest-quality-assessor.engine';
import { HarvestLabourEstimatorEngine } from './harvest-labour-estimator.engine';
import { HarvestEquipmentRecommenderEngine } from './harvest-equipment-recommender.engine';
import { HarvestStorageAdvisorEngine } from './harvest-storage-advisor.engine';

@Injectable()
export class HarvestEstimatorEngine implements IHarvestEstimator {
  constructor(
    private readonly qualityAssessor: HarvestQualityAssessorEngine,
    private readonly labourEstimator: HarvestLabourEstimatorEngine,
    private readonly equipmentRecommender: HarvestEquipmentRecommenderEngine,
    private readonly storageAdvisor: HarvestStorageAdvisorEngine,
  ) {}

  estimateYield(
    estimatedYieldKg: number | null,
    areaAcres: number | null,
    lifecycle: LifecycleContext,
    activities: ActivityContext,
  ): YieldEstimate {
    let baseYield = estimatedYieldKg ?? (areaAcres ? areaAcres * 1500 : 1000);
    const activityMultiplier = 0.7 + (activities.completionRate / 100) * 0.3;
    const adjustedYield = Math.round(baseYield * activityMultiplier);

    let confidence = 50;
    if (estimatedYieldKg) confidence += 25;
    if (lifecycle.growthPercentage > 70) confidence += 15;
    if (activities.completionRate > 70) confidence += 10;
    confidence = Math.min(90, confidence);

    const explanation = estimatedYieldKg
      ? `Based on farmer estimate of ${estimatedYieldKg} kg, adjusted by activity completion rate (${activities.completionRate.toFixed(0)}%)`
      : `Estimated from ${areaAcres ?? '?'} acres at ~1500 kg/acre, adjusted by farm activity completion`;

    return { expectedYieldKg: adjustedYield, yieldConfidence: confidence, explanation };
  }

  estimateQuality(
    weather: WeatherContext,
    activities: ActivityContext,
    cropVariety: string | null,
    lifecycle: LifecycleContext,
  ): QualityEstimate {
    return this.qualityAssessor.assessQuality(weather, activities, cropVariety, lifecycle);
  }

  estimateLabour(
    areaAcres: number | null,
    cropName: string,
    harvestWindow: { optimalHarvestDate: Date },
  ): LabourEstimate {
    return this.labourEstimator.estimateLabour(areaAcres, cropName, harvestWindow.optimalHarvestDate);
  }

  recommendEquipment(
    cropName: string,
    areaAcres: number | null,
    qualityGrade: string,
  ): EquipmentRecommendation {
    return this.equipmentRecommender.recommendEquipment(cropName, areaAcres, qualityGrade);
  }

  recommendStorage(
    qualityGrade: string,
    lifecycle: LifecycleContext,
    weather: WeatherContext,
  ): StorageAdvice {
    return this.storageAdvisor.recommendStorage(qualityGrade, lifecycle, weather);
  }
}
