export type LifecycleStage = 'pre-sowing' | 'seedling' | 'vegetative' | 'reproductive' | 'ripening' | 'ready' | 'overdue' | 'harvested';
export type ReadinessStatus = 'not-ready' | 'developing' | 'almost-ready' | 'ready' | 'harvested';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type QualityGrade = 'A' | 'B' | 'C';
export type StorageRecommendation = 'immediate-sale' | 'warehouse' | 'cold-storage' | 'temporary-storage';
export interface LifecycleContext {
    sowingDate: Date;
    durationDays: number;
    expectedHarvestDate: Date | null;
    daysElapsed: number;
    daysRemaining: number;
    growthPercentage: number;
    lifecycleStage: LifecycleStage;
}
export interface WeatherContext {
    currentTemperature?: number;
    currentHumidity?: number;
    currentRainfall?: number;
    forecastRainProbability?: number;
    forecastTemperature?: number;
    weatherCondition?: string;
    hasRainForecast: boolean;
    hasHeatStress: boolean;
    hasColdStress: boolean;
    hasFloodRisk: boolean;
}
export interface ActivityContext {
    totalEvents: number;
    completedEvents: number;
    pendingEvents: number;
    overduePendingEvents: number;
    completionRate: number;
    hasLateIrrigation: boolean;
    hasLateFertilizer: boolean;
    hasMissedActivities: boolean;
}
export interface HarvestWindow {
    earliestHarvestDate: Date;
    optimalHarvestDate: Date;
    latestSafeHarvestDate: Date;
    windowDays: number;
    explanation: string;
}
export interface HarvestDelay {
    hasDelay: boolean;
    delayDays: number;
    delayReasons: string[];
    suggestedActions: string[];
}
export interface LabourEstimate {
    workersRequired: number;
    harvestDurationDays: number;
    suggestedStartDate: Date;
    estimatedLabourHours: number;
    explanation: string;
}
export interface EquipmentRecommendation {
    recommended: string[];
    explanation: string;
}
export interface StorageAdvice {
    recommendation: StorageRecommendation;
    explanation: string;
}
export interface YieldEstimate {
    expectedYieldKg: number;
    yieldConfidence: number;
    explanation: string;
}
export interface QualityEstimate {
    grade: QualityGrade;
    explanation: string;
    factors: string[];
}
