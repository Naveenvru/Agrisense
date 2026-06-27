export interface MarketData {
  commodity: string;
  currentPrice: number;
  predictedPrice: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  confidenceScore: number;
}
