import type { ActivityContext, LifecycleContext, WeatherContext, RiskLevel } from '../../harvest-intelligence/interfaces/harvest-intelligence.types';

export type SupplyConfidenceBand = 'low' | 'medium' | 'high' | 'very-high';
export type SupplyTimelineLabel = 'today' | 'next-week' | 'next-month' | 'harvest-window' | 'supply-peak' | 'supply-decline';

export interface SupplyTimelinePoint {
  label: SupplyTimelineLabel;
  date: Date;
  expectedSupplyKg: number;
  availableSupplyKg: number;
  explanation: string;
}

export interface SupplyRiskResult {
  level: RiskLevel;
  score: number;
  reasons: string[];
  mitigationRecommendations: string[];
  explanation: string;
}

export interface SupplySeasonalAnalysis {
  currentSeasonSupplyKg: number;
  nextSeasonSupplyKg: number;
  monthlySupply: Record<string, number>;
  weeklySupply: Record<string, number>;
  cropWiseSeasonalDistribution: Record<string, number>;
  explanation: string;
}

export interface SupplyRecommendation {
  action: string;
  expectedImpact: string;
  confidence: number;
  priority: number;
  explanation: string;
}

export interface SupplyPredictionResult {
  farmerCropId: string;
  farmerProfileId: string;
  cropName: string;
  cropVariety?: string | null;
  cropCategory?: string | null;
  regionLevel: 'village' | 'taluk' | 'district' | 'state';
  regionName: string;
  villageName?: string | null;
  talukName?: string | null;
  districtName?: string | null;
  stateName?: string | null;
  areaAcres: number;
  expectedHarvestDate?: Date | null;
  expectedSupplyKg: number;
  expectedYieldKg: number;
  availableSupplyKg: number;
  supplyDensityKgPerAcre: number;
  confidence: number;
  confidenceBand: SupplyConfidenceBand;
  explanation: string;
  explanations: string[];
  risk: SupplyRiskResult;
  seasonalAnalysis: SupplySeasonalAnalysis;
  timeline: SupplyTimelinePoint[];
  recommendations: SupplyRecommendation[];
  harvestStage: string;
  yieldStage: string;
  weatherSummary: string;
  assessedAt: Date;
  version: number;
}

export interface SupplyAssessmentContext {
  farmerCropId: string;
  farmerProfileId: string;
  cropName: string;
  cropVariety?: string | null;
  cropCategory?: string | null;
  regionLevel: 'village' | 'taluk' | 'district' | 'state';
  regionName: string;
  villageName?: string | null;
  talukName?: string | null;
  districtName?: string | null;
  stateName?: string | null;
  areaAcres: number;
  expectedHarvestDate?: Date | null;
  harvestStage: string;
  harvestReadinessScore: number;
  harvestRiskLevel: string;
  harvestExplanations: string[];
  yieldExpectedKg: number;
  yieldConfidence: number;
  yieldRiskLevel: string;
  yieldExplanations: string[];
  weather: WeatherContext;
  weatherHistory: Array<{ timestamp: Date; temperature?: number; humidity?: number; rainfall?: number; weatherCondition?: string }>;
  activities: ActivityContext;
  lifecycle: LifecycleContext;
  historicalSupplyKg: number[];
  actualYieldKg?: number | null;
  regionalEventNotes: string[];
}

export interface SupplyRegionalSummary {
  regionLevel: 'village' | 'taluk' | 'district' | 'state';
  regionName: string;
  totalFarmers: number;
  totalCrops: number;
  totalSupplyKg: number;
  availableSupplyKg: number;
  cropBreakdown: Record<string, {
    count: number;
    totalSupplyKg: number;
    averageSupplyKg: number;
    averageConfidence: number;
  }>;
  supplyDensityKgPerAcre: number;
  summary: string;
  explanations: string[];
  generatedAt: Date;
}

export interface SupplyAnalyticsSnapshot {
  scope: 'global' | 'regional' | 'crop';
  regionLevel?: 'village' | 'taluk' | 'district' | 'state';
  regionName?: string;
  cropName?: string;
  periodType: 'weekly' | 'monthly' | 'seasonal';
  periodStart: Date;
  periodEnd: Date;
  cropWiseSupply: Record<string, number>;
  regionWiseSupply: Record<string, number>;
  weeklySupply: Record<string, number>;
  monthlySupply: Record<string, number>;
  seasonalSupply: Record<string, number>;
  averageSupplyKg: number;
  supplyTrend: Array<{ period: string; supplyKg: number }>;
  topProducingRegions: Array<{ regionLevel: string; regionName: string; supplyKg: number; confidence: number }>;
  cropDistribution: Array<{ cropName: string; supplyKg: number; sharePercent: number }>;
  generatedAt: Date;
}