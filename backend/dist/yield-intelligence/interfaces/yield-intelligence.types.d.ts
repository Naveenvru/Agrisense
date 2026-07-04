import type { ActivityContext, LifecycleContext, WeatherContext, RiskLevel, QualityGrade } from '../../harvest-intelligence/interfaces/harvest-intelligence.types';
export type YieldConfidenceBand = 'low' | 'medium' | 'high' | 'very-high';
export interface YieldWeatherHistoryPoint {
    timestamp: Date;
    temperature?: number;
    humidity?: number;
    rainfall?: number;
    weatherCondition?: string;
}
export interface YieldRiskResult {
    level: RiskLevel;
    score: number;
    reasons: string[];
    mitigationRecommendations: string[];
    explanation: string;
}
export interface YieldConfidenceResult {
    confidence: number;
    band: YieldConfidenceBand;
    reasons: string[];
    explanation: string;
}
export interface YieldQualityResult {
    grade: QualityGrade;
    score: number;
    factors: string[];
    explanation: string;
}
export interface YieldLossResult {
    expectedLossPercent: number;
    expectedLossQuantityKg: number;
    reasons: string[];
    explanation: string;
}
export interface YieldRecommendation {
    action: string;
    expectedImpact: string;
    confidence: number;
    priority: number;
    explanation: string;
}
export interface YieldPredictionResult {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    cropVariety?: string | null;
    cropCategory?: string | null;
    areaAcres: number;
    soilType?: string | null;
    soilFertilityScore: number;
    irrigationType?: string | null;
    lifecycleStage: string;
    growthPercentage: number;
    readinessScore: number;
    currentWeatherSummary: string;
    expectedYieldKg: number;
    yieldPerAcreKg: number;
    expectedProductionKg: number;
    confidence: number;
    explanation: string;
    explanations: string[];
    riskLevel?: string;
    riskScore?: number;
    riskReasons?: string[];
    mitigationRecommendations?: string[];
    confidenceBand?: string;
    confidenceExplanation?: string;
    qualityGrade?: string;
    qualityScore?: number;
    qualityFactors?: string[];
    qualityExplanation?: string;
    expectedLossPercent?: number;
    expectedLossQuantityKg?: number;
    lossReasons?: string[];
    lossExplanation?: string;
    risk: YieldRiskResult;
    confidenceAnalysis: YieldConfidenceResult;
    quality: YieldQualityResult;
    loss: YieldLossResult;
    recommendations: YieldRecommendation[];
    historicalYieldKg?: number | null;
    historicalYieldSamples: number[];
    weather: WeatherContext;
    weatherHistory: YieldWeatherHistoryPoint[];
    activities: ActivityContext;
    lifecycle: LifecycleContext;
    assessedAt: Date;
    version: number;
}
export interface YieldAssessmentContext {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    cropVariety?: string | null;
    cropCategory?: string | null;
    areaAcres: number;
    soilType?: string | null;
    soilFertilityScore: number;
    irrigationType?: string | null;
    lifecycle: LifecycleContext;
    weather: WeatherContext;
    weatherHistory: YieldWeatherHistoryPoint[];
    activities: ActivityContext;
    readinessScore: number;
    riskLevelEquivalent?: string;
    historicalYieldKg?: number | null;
    historicalYieldSamples: number[];
    cropTemperatureMin?: number | null;
    cropTemperatureMax?: number | null;
    actualYieldKg?: number | null;
}
export interface YieldRegionalSummary {
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    totalFarmers: number;
    totalCrops: number;
    totalExpectedYieldKg: number;
    averageYieldKg: number;
    cropBreakdown: Record<string, {
        count: number;
        totalExpectedYieldKg: number;
        averageYieldKg: number;
        averageConfidence: number;
    }>;
    regionalYieldDensityKgPerAcre: number;
    summary: string;
    explanations: string[];
    generatedAt: Date;
}
export interface YieldAnalyticsSnapshot {
    scope: 'global' | 'regional' | 'crop';
    regionLevel?: 'village' | 'taluk' | 'district' | 'state';
    regionName?: string;
    cropName?: string;
    periodType: 'monthly' | 'seasonal' | 'daily';
    periodStart: Date;
    periodEnd: Date;
    cropWiseYield: Record<string, number>;
    regionWiseYield: Record<string, number>;
    monthlyYield: Record<string, number>;
    seasonWiseYield: Record<string, number>;
    averageYieldKg: number;
    yieldTrend: Array<{
        period: string;
        yieldKg: number;
    }>;
    topPerformingCrops: Array<{
        cropName: string;
        averageYieldKg: number;
        confidence: number;
    }>;
    generatedAt: Date;
}
