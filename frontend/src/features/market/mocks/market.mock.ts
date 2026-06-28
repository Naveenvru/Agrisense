import { 
  MarketOpportunity, MarketDecision, AiMarketRecommendation,
  PersonalizedCropInsight, HarvestIntelligence, RegionalProfit,
  DemandSupplyMetrics, MarketTrendAnalysis, MarketPerformanceMetrics,
  PricePredictionData, RecommendationHistoryItem, MarketAlert,
  CommodityDetail
} from '../types';

export const MOCK_OPPORTUNITY_SCORE: MarketOpportunity = {
  score: 92,
  label: 'Excellent Selling Window'
};

export const MOCK_MARKET_DECISION: MarketDecision = {
  sellToday: true,
  waitDays: 0,
  bestMarket: 'Bengaluru APMC',
  expectedProfit: 14500,
  trend: 'Bullish',
  risk: 'Safe'
};

export const MOCK_AI_RECOMMENDATION: AiMarketRecommendation = {
  id: 'ai-rec-1',
  action: 'Transport',
  recommendation: 'Transport Tomato to Bengaluru APMC',
  reason: [
    'Regional supply decreased by 18% overnight.',
    'Heavy rain in neighboring districts restricted transport.',
    'Festival demand spiking in urban markets.'
  ],
  expectedProfitDiff: 4200,
  confidence: 94,
  priority: 'High Risk'
};

export const MOCK_PERSONALIZED_INSIGHTS: PersonalizedCropInsight[] = [
  {
    cropId: 'c1', cropName: 'Tomato', currentPrice: 2800, predictedPrice: 3200, expectedProfit: 4200,
    bestSellingDate: 'Today', bestMarket: 'Bengaluru APMC', confidence: 94, recommendation: 'Sell Today',
    reason: 'Short supply due to recent rain'
  },
  {
    cropId: 'c2', cropName: 'Onion', currentPrice: 1800, predictedPrice: 2100, expectedProfit: 1500,
    bestSellingDate: 'In 3 Days', bestMarket: 'Mysuru APMC', confidence: 88, recommendation: 'Store',
    reason: 'Market oversupplied currently'
  }
];

export const MOCK_HARVEST_INTELLIGENCE: HarvestIntelligence = {
  farmYield: 4.5, // tons
  regionalYield: 450, // tons
  expectedIncomingSupply: 120, // tons
  marketSupply: 200, // tons
  expectedPriceImpact: 'Price expected to drop 5% by tomorrow evening.',
  aiRecommendation: 'Harvest immediately to beat the incoming supply surge.'
};

export const MOCK_REGIONAL_PROFITS: RegionalProfit[] = [
  { marketName: 'Bengaluru APMC', sellingPrice: 2850, transportCost: 200, netProfit: 2650, distance: 45, travelTime: '1h 15m' },
  { marketName: 'Mysuru APMC', sellingPrice: 2790, transportCost: 80, netProfit: 2710, distance: 15, travelTime: '30m' },
  { marketName: 'Hubballi APMC', sellingPrice: 2920, transportCost: 450, netProfit: 2470, distance: 410, travelTime: '6h 30m' },
  { marketName: 'Tumakuru APMC', sellingPrice: 2830, transportCost: 150, netProfit: 2680, distance: 35, travelTime: '50m' },
];

export const MOCK_DEMAND_SUPPLY: DemandSupplyMetrics = {
  currentDemand: 85,
  expectedDemand: 95,
  regionalSupply: 40,
  nationalSupply: 60,
  expectedMarketPressure: 'High'
};

export const MOCK_MARKET_TRENDS: MarketTrendAnalysis[] = [
  { sentiment: 'Bullish', explanation: 'Tomato prices rising due to continuous festival demand.' },
  { sentiment: 'Stable', explanation: 'Paddy arrivals are consistent with local consumption.' },
  { sentiment: 'Bearish', explanation: 'Onion market oversupplied from neighboring states.' }
];

export const MOCK_PERFORMANCE_METRICS: MarketPerformanceMetrics = {
  highestGrowth: 'Tomato (+15%)',
  highestDemand: 'Chili',
  largestPriceIncrease: 'Garlic (+₹400/qtl)',
  highestRisk: 'Onion (Oversupplied)',
  mostProfitable: 'Tomato',
  mostStable: 'Paddy'
};

export const MOCK_COMMODITIES: CommodityDetail[] = [
  { id: 'com1', name: 'Tomato', currentPrice: 2850, yesterdayPrice: 2500, priceChange: 14, predictedPrice: 3100, confidence: 92, trend: 'Bullish', status: 'Sell Today' },
  { id: 'com2', name: 'Onion', currentPrice: 1800, yesterdayPrice: 1950, priceChange: -7.6, predictedPrice: 1700, confidence: 85, trend: 'Bearish', status: 'Store' },
  { id: 'com3', name: 'Paddy', currentPrice: 2100, yesterdayPrice: 2100, priceChange: 0, predictedPrice: 2150, confidence: 96, trend: 'Stable', status: 'Wait' },
  { id: 'com4', name: 'Maize', currentPrice: 2400, yesterdayPrice: 2350, priceChange: 2.1, predictedPrice: 2500, confidence: 88, trend: 'Bullish', status: 'Wait' },
];

export const MOCK_ALERTS: MarketAlert[] = [
  { id: 'al1', title: 'Tomato Price Spike', description: 'Bengaluru APMC reporting 15% price increase in the last 4 hours.', severity: 'High Risk', time: '1 hour ago' },
  { id: 'al2', title: 'Onion Oversupply', description: '120 trucks arrived from Maharashtra. Prices expected to drop.', severity: 'Warning', time: '3 hours ago' },
];

export const MOCK_TIMELINE: RecommendationHistoryItem[] = [
  { date: 'Yesterday', action: 'Wait', commodity: 'Tomato', details: 'Prices were stabilizing, advised to hold stock.' },
  { date: 'Today', action: 'Sell Today', commodity: 'Tomato', details: 'Demand spiked. Sell immediately.' },
  { date: 'Tomorrow', action: 'Transport', commodity: 'Tomato', details: 'Move remaining stock to Mysuru for better net profit.' },
];

export const MOCK_PRICE_CHART: PricePredictionData[] = [
  { date: 'Mon', price: 2100, predictedPrice: 2100, confidenceHigh: 2150, confidenceLow: 2050 },
  { date: 'Tue', price: 2200, predictedPrice: 2200, confidenceHigh: 2250, confidenceLow: 2150 },
  { date: 'Wed', price: 2150, predictedPrice: 2150, confidenceHigh: 2200, confidenceLow: 2100 },
  { date: 'Thu', price: 2300, predictedPrice: 2300, confidenceHigh: 2350, confidenceLow: 2250 },
  { date: 'Fri', price: 2500, predictedPrice: 2500, confidenceHigh: 2600, confidenceLow: 2400 },
  { date: 'Sat (Today)', price: 2850, predictedPrice: 2850, confidenceHigh: 2950, confidenceLow: 2750 },
  { date: 'Sun (Pred)', price: 0, predictedPrice: 3100, confidenceHigh: 3300, confidenceLow: 2900 },
  { date: 'Mon (Pred)', price: 0, predictedPrice: 3250, confidenceHigh: 3500, confidenceLow: 3000 },
];
