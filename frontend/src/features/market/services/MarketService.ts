import { 
  MarketOpportunity, MarketDecision, AiMarketRecommendation,
  PersonalizedCropInsight, HarvestIntelligence, RegionalProfit,
  DemandSupplyMetrics, MarketTrendAnalysis, MarketPerformanceMetrics,
  PricePredictionData, RecommendationHistoryItem, MarketAlert,
  CommodityDetail
} from '../types';

import {
  MOCK_OPPORTUNITY_SCORE, MOCK_MARKET_DECISION, MOCK_AI_RECOMMENDATION,
  MOCK_PERSONALIZED_INSIGHTS, MOCK_HARVEST_INTELLIGENCE, MOCK_REGIONAL_PROFITS,
  MOCK_DEMAND_SUPPLY, MOCK_MARKET_TRENDS, MOCK_PERFORMANCE_METRICS,
  MOCK_COMMODITIES, MOCK_ALERTS, MOCK_TIMELINE, MOCK_PRICE_CHART
} from '../mocks/market.mock';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class MarketService {
  static async getOpportunityScore(): Promise<MarketOpportunity> {
    await delay(300);
    return MOCK_OPPORTUNITY_SCORE;
  }

  static async getMarketDecision(): Promise<MarketDecision> {
    await delay(400);
    return MOCK_MARKET_DECISION;
  }

  static async getAiRecommendation(): Promise<AiMarketRecommendation> {
    await delay(500);
    return MOCK_AI_RECOMMENDATION;
  }

  static async getPersonalizedInsights(): Promise<PersonalizedCropInsight[]> {
    await delay(600);
    return MOCK_PERSONALIZED_INSIGHTS;
  }

  static async getHarvestIntelligence(): Promise<HarvestIntelligence> {
    await delay(450);
    return MOCK_HARVEST_INTELLIGENCE;
  }

  static async getRegionalProfits(): Promise<RegionalProfit[]> {
    await delay(550);
    return MOCK_REGIONAL_PROFITS;
  }

  static async getDemandSupply(): Promise<DemandSupplyMetrics> {
    await delay(400);
    return MOCK_DEMAND_SUPPLY;
  }

  static async getMarketTrends(): Promise<MarketTrendAnalysis[]> {
    await delay(350);
    return MOCK_MARKET_TRENDS;
  }

  static async getPerformanceMetrics(): Promise<MarketPerformanceMetrics> {
    await delay(500);
    return MOCK_PERFORMANCE_METRICS;
  }

  static async getCommodities(): Promise<CommodityDetail[]> {
    await delay(600);
    return MOCK_COMMODITIES;
  }

  static async getAlerts(): Promise<MarketAlert[]> {
    await delay(300);
    return MOCK_ALERTS;
  }

  static async getTimeline(): Promise<RecommendationHistoryItem[]> {
    await delay(450);
    return MOCK_TIMELINE;
  }

  static async getPriceChart(): Promise<PricePredictionData[]> {
    await delay(700);
    return MOCK_PRICE_CHART;
  }
}
