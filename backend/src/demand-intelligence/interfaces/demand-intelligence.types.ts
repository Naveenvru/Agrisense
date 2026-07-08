import type { WeatherContext, ActivityContext, LifecycleContext, RiskLevel } from '../../harvest-intelligence/interfaces/harvest-intelligence.types';

export type DemandConfidenceBand = 'low' | 'medium' | 'high' | 'very-high';
export type DemandTimelineLabel = 'today' | 'next-week' | 'next-month' | 'harvest-window' | 'demand-peak' | 'demand-decline';
export type MarketTrendDirection = 'rising' | 'falling' | 'stable';

export interface DemandTimelinePoint {
  label: DemandTimelineLabel;
  date: Date;
  expectedDemandKg: number;
  currentDemandKg: number;
  explanation: string;
}

export interface DemandRiskResult {
  level: RiskLevel;
  score: number;
  reasons: string[];
  mitigationRecommendations: string[];
  explanation: string;
}

export interface DemandSeasonalAnalysis {
  currentSeasonDemandKg: number;
  nextSeasonDemandKg: number;
  monthlyDemand: Record<string, number>;
  weeklyDemand: Record<string, number>;
  cropWiseSeasonalDistribution: Record<string, number>;
  festivalPremiumKg: number;
  explanation: string;
}

export interface DemandRecommendation {
  action: string;
  expectedImpact: string;
  confidence: number;
  priority: number;
  explanation: string;
}

export interface DemandPredictionResult {
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
  /** Volume the market will absorb in this cycle */
  currentDemandKg: number;
  /** Total projected demand across all channels */
  expectedDemandKg: number;
  /** Government MSP / procurement floor demand */
  governmentProcurementKg: number;
  /** Export channel demand */
  exportDemandKg: number;
  /** Retail / APMC channel demand */
  retailDemandKg: number;
  /** Agro-processing / industrial demand */
  industrialDemandKg: number;
  /** Festival-driven demand premium */
  festivalDemandKg: number;
  /** Demand kg per acre cultivated */
  demandDensityKgPerAcre: number;
  confidence: number;
  confidenceBand: DemandConfidenceBand;
  explanation: string;
  explanations: string[];
  risk: DemandRiskResult;
  seasonalAnalysis: DemandSeasonalAnalysis;
  timeline: DemandTimelinePoint[];
  recommendations: DemandRecommendation[];
  assessedAt: Date;
  version: number;
}

export interface DemandAssessmentContext {
  farmerCropId: string;
  farmerProfileId: string;
  cropName: string;
  cropVariety?: string | null;
  cropCategory?: string | null;
  cropSeason?: string | null;
  regionLevel: 'village' | 'taluk' | 'district' | 'state';
  regionName: string;
  villageName?: string | null;
  talukName?: string | null;
  districtName?: string | null;
  stateName?: string | null;
  areaAcres: number;
  expectedHarvestDate?: Date | null;
  /** From Harvest Intelligence */
  harvestReadinessScore: number;
  harvestRiskLevel: string;
  harvestStage: string;
  /** From Yield Intelligence */
  yieldExpectedKg: number;
  yieldConfidence: number;
  yieldRiskLevel: string;
  /** From Supply Intelligence */
  availableSupplyKg: number;
  expectedSupplyKg: number;
  supplyRiskLevel: string;
  supplyDensityKgPerAcre: number;
  /** From Market Module */
  marketModalPrice: number;
  marketMinPrice: number;
  marketMaxPrice: number;
  marketTrendDirection: MarketTrendDirection;
  recentArrivalQty: number;
  /** Weather context */
  weather: WeatherContext;
  /** Lifecycle context */
  lifecycle: LifecycleContext;
  /** Demand signal flags */
  isMspCrop: boolean;
  isExportCrop: boolean;
  currentMonth: number;
  /** Historical demand samples for stabilisation */
  historicalDemandKg: number[];
  /** Regional disruption notes */
  regionalEventNotes: string[];
}

export interface DemandRegionalSummary {
  regionLevel: 'village' | 'taluk' | 'district' | 'state';
  regionName: string;
  totalFarmers: number;
  totalCrops: number;
  totalDemandKg: number;
  currentDemandKg: number;
  cropBreakdown: Record<string, {
    count: number;
    totalDemandKg: number;
    averageDemandKg: number;
    averageConfidence: number;
  }>;
  demandDensityKgPerAcre: number;
  summary: string;
  explanations: string[];
  generatedAt: Date;
}

export interface DemandAnalyticsSnapshot {
  scope: 'global' | 'regional' | 'crop';
  regionLevel?: 'village' | 'taluk' | 'district' | 'state';
  regionName?: string;
  cropName?: string;
  periodType: 'weekly' | 'monthly' | 'seasonal';
  periodStart: Date;
  periodEnd: Date;
  cropWiseDemand: Record<string, number>;
  regionWiseDemand: Record<string, number>;
  weeklyDemand: Record<string, number>;
  monthlyDemand: Record<string, number>;
  seasonalDemand: Record<string, number>;
  averageDemandKg: number;
  demandTrend: Array<{ period: string; demandKg: number }>;
  topDemandRegions: Array<{ regionLevel: string; regionName: string; demandKg: number; confidence: number }>;
  cropDistribution: Array<{ cropName: string; demandKg: number; sharePercent: number }>;
  generatedAt: Date;
}
