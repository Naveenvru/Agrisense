export type DemandConfidenceBand = 'low' | 'medium' | 'high' | 'very-high';
export type DemandTrend = 'falling' | 'stable' | 'rising';
export type DemandRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export interface DemandAssessmentContext {
    cropName: string;
    cropCategory?: string | null;
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    currentPrice?: number;
    priceTrend?: DemandTrend;
    supplyAvailabilityKg?: number;
    recentTransactionCount: number;
    recentBuyerCount: number;
    seasonalDemandIndex: number;
    marketMomentumIndex: number;
    buyerActivityIndex: number;
    supplyPressureIndex: number;
    weatherSignals: string[];
    regionalEventNotes: string[];
}
export interface DemandRiskResult {
    level: DemandRiskLevel;
    score: number;
    reasons: string[];
    mitigationRecommendations: string[];
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
    cropName: string;
    cropCategory?: string | null;
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    expectedDemandKg: number;
    demandDensityKgPerTransaction: number;
    confidence: number;
    confidenceBand: DemandConfidenceBand;
    trend: DemandTrend;
    risk: DemandRiskResult;
    explanation: string;
    explanations: string[];
    recommendations: DemandRecommendation[];
    assessedAt: Date;
    version: number;
}
export interface DemandRegionalSummary {
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    totalTransactions: number;
    totalBuyers: number;
    totalDemandKg: number;
    averageDemandKg: number;
    cropBreakdown: Record<string, {
        count: number;
        totalDemandKg: number;
        averageDemandKg: number;
        averageConfidence: number;
    }>;
    demandDensityKgPerTransaction: number;
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
    demandTrend: Array<{
        period: string;
        demandKg: number;
    }>;
    topDemandRegions: Array<{
        regionLevel: string;
        regionName: string;
        demandKg: number;
        confidence: number;
    }>;
    cropDistribution: Array<{
        cropName: string;
        demandKg: number;
        sharePercent: number;
    }>;
    generatedAt: Date;
}
