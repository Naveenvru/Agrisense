export interface GreetingData {
  userName: string;
  lastAnalysisTime: string;
  location: string;
  weatherSummary: string;
}

export interface RecommendationData {
  title: string;
  description: string;
  confidence: number;
  expectedProfitImpact: string;
  primaryActionText: string;
  secondaryActionText: string;
}
