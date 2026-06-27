import { GreetingData, RecommendationData } from '@/types/dashboard/Recommendation';
import { FarmData } from '@/types/dashboard/Farm';
import { WeatherData } from '@/types/dashboard/Weather';
import { MarketData } from '@/types/dashboard/Market';
import { TaskData } from '@/types/dashboard/Task';
import { ActivityData } from '@/types/dashboard/Activity';

export const MOCK_GREETING_DATA: GreetingData = {
  userName: "Alex",
  lastAnalysisTime: "10 minutes ago",
  location: "Midwest Region, Farm Alpha",
  weatherSummary: "Optimal conditions for scheduled activities."
};

export const MOCK_RECOMMENDATION_DATA: RecommendationData = {
  title: "Yield Optimization Opportunity",
  description: "Based on recent soil moisture analysis and the upcoming 48-hour rain forecast, delaying irrigation on Field A and applying Nitrogen fertilizer now will maximize absorption.",
  confidence: 94,
  expectedProfitImpact: "+₹2,450",
  primaryActionText: "Apply Nitrogen & Delay Irrigation",
  secondaryActionText: "View Analysis Details"
};

export const MOCK_FARMS_DATA: FarmData[] = [
  { id: "f1", name: "Field Alpha", crop: "Winter Wheat", area: 120, growthStage: "Tillering", healthScore: 92, status: 'Healthy', harvestCountdownDays: 145 },
  { id: "f2", name: "Field Beta", crop: "Soybeans", area: 85, growthStage: "Pod Development", healthScore: 64, status: 'Attention Required', harvestCountdownDays: 40 },
  { id: "f3", name: "Field Gamma", crop: "Corn", area: 210, growthStage: "Silking", healthScore: 88, status: 'Healthy', harvestCountdownDays: 65 },
  { id: "f4", name: "Field Delta", crop: "Barley", area: 60, growthStage: "Emergence", healthScore: 42, status: 'Critical', harvestCountdownDays: 120 }
];

export const MOCK_WEATHER_DATA: WeatherData = {
  temperature: 24,
  condition: "Partly Cloudy",
  humidity: 62,
  windSpeed: 14,
  rainfallMm: 0,
  pressureHpa: 1012,
  impactSummary: "Low disease pressure today. Favorable for spraying.",
  isAlert: false
};

export const MOCK_MARKET_DATA: MarketData[] = [
  { commodity: "Wheat (SRW)", currentPrice: 582.50, predictedPrice: 590.25, trend: "up", trendPercentage: 1.3, confidenceScore: 85 },
  { commodity: "Soybeans", currentPrice: 1145.00, predictedPrice: 1130.50, trend: "down", trendPercentage: 1.2, confidenceScore: 78 },
  { commodity: "Corn", currentPrice: 435.75, predictedPrice: 436.00, trend: "stable", trendPercentage: 0.1, confidenceScore: 92 },
  { commodity: "Oats", currentPrice: 340.20, predictedPrice: 355.00, trend: "up", trendPercentage: 4.3, confidenceScore: 64 }
];

export const MOCK_TASKS_DATA: TaskData[] = [
  { id: "t1", title: "Apply Nitrogen Fertilizer", location: "Field Alpha", date: "Today, 14:00", priority: "High", status: "Pending" },
  { id: "t2", title: "Inspect Irrigation Line B", location: "Field Beta", date: "Today, 16:30", priority: "Medium", status: "Pending" },
  { id: "t3", title: "Soil Sampling", location: "Field Gamma", date: "Tomorrow, 09:00", priority: "Low", status: "Pending" }
];

export const MOCK_ACTIVITY_DATA: ActivityData[] = [
  { id: "a1", time: "10 min ago", description: "AI generated new irrigation recommendation based on latest weather models.", type: "prediction" },
  { id: "a2", time: "1 hour ago", description: "Market data synchronized with CBOT feeds.", type: "market" },
  { id: "a3", time: "3 hours ago", description: "Automated weather station recorded 12mm rainfall.", type: "weather" },
  { id: "a4", time: "Yesterday", description: "System maintenance completed successfully.", type: "system" }
];
