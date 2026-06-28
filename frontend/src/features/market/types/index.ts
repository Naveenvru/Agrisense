export type Sentiment = 'Bullish' | 'Stable' | 'Bearish';
export type ActionRecommendation = 'Sell Today' | 'Wait' | 'Store' | 'Transport';
export type RiskLevel = 'Safe' | 'Caution' | 'High Risk' | 'Critical';
export type AlertSeverity = 'Information' | 'Warning' | 'High Risk' | 'Critical';

export interface MarketOpportunity {
  score: number;
  label: string;
}

export interface MarketDecision {
  sellToday: boolean;
  waitDays: number;
  bestMarket: string;
  expectedProfit: number;
  trend: Sentiment;
  risk: RiskLevel;
}

export interface AiMarketRecommendation {
  id: string;
  action: ActionRecommendation;
  recommendation: string;
  reason: string[];
  expectedProfitDiff: number;
  confidence: number;
  priority: RiskLevel;
}

export interface PersonalizedCropInsight {
  cropId: string;
  cropName: string;
  currentPrice: number;
  predictedPrice: number;
  expectedProfit: number;
  bestSellingDate: string;
  bestMarket: string;
  confidence: number;
  recommendation: ActionRecommendation;
  reason: string;
}

export interface HarvestIntelligence {
  farmYield: number;
  regionalYield: number;
  expectedIncomingSupply: number;
  marketSupply: number;
  expectedPriceImpact: string;
  aiRecommendation: string;
}

export interface RegionalProfit {
  marketName: string;
  sellingPrice: number;
  transportCost: number;
  netProfit: number;
  distance: number; // km
  travelTime: string;
}

export interface DemandSupplyMetrics {
  currentDemand: number; // 0-100
  expectedDemand: number;
  regionalSupply: number;
  nationalSupply: number;
  expectedMarketPressure: 'High' | 'Medium' | 'Low';
}

export interface MarketTrendAnalysis {
  sentiment: Sentiment;
  explanation: string;
}

export interface MarketPerformanceMetrics {
  highestGrowth: string;
  highestDemand: string;
  largestPriceIncrease: string;
  highestRisk: string;
  mostProfitable: string;
  mostStable: string;
}

export interface PricePredictionData {
  date: string;
  price: number;
  predictedPrice: number;
  confidenceHigh: number;
  confidenceLow: number;
}

export interface RecommendationHistoryItem {
  date: string;
  action: ActionRecommendation;
  commodity: string;
  details: string;
}

export interface MarketAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  time: string;
}

export interface CommodityDetail {
  id: string;
  name: string;
  currentPrice: number;
  yesterdayPrice: number;
  priceChange: number;
  predictedPrice: number;
  confidence: number;
  trend: Sentiment;
  status: ActionRecommendation;
}
