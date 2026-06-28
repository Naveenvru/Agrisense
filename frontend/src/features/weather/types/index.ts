export type RiskLevel = 'Safe' | 'Caution' | 'High Risk' | 'Critical';
export type AlertSeverity = 'Information' | 'Warning' | 'High Risk' | 'Critical';
export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rain' | 'Storm' | 'Windy' | 'Clear';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  uvIndex: number;
  airQuality: number;
  dewPoint: number;
  cloudCover: number;
  rainfall: number;
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
}

export interface AiWeatherRecommendation {
  id: string;
  recommendation: string;
  reason: string;
  confidence: number;
  expectedBenefit: string;
  priority: RiskLevel;
}

export interface HourlyForecast {
  time: string;
  condition: WeatherCondition;
  temperature: number;
  rainProbability: number;
  windSpeed: number;
  humidity: number;
  recommendedAction: string;
}

export interface DailyForecast {
  date: string;
  condition: WeatherCondition;
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  humidity: number;
  windSpeed: number;
  agriculturalImpact: string;
}

export interface WeatherRisk {
  id: string;
  type: string; // e.g., 'Rain Risk', 'Heat Stress'
  level: RiskLevel;
  description: string;
  recommendation: string;
  confidence: number;
}

export interface FarmWeatherImpact {
  farmId: string;
  farmName: string;
  condition: string; // e.g., 'Rain Expected'
  impact: string; // e.g., 'Delay Irrigation'
  confidence: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  time: string;
}

export interface HistoricalWeatherPoint {
  date: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
}

export interface AgriculturalDecision {
  type: string; // e.g., 'Irrigation Decision', 'Spraying Window'
  status: RiskLevel; // Repurposed for color coding
  confidence: number;
  recommendedAction: string;
}

export interface CropWeatherImpact {
  crop: string;
  status: RiskLevel;
  impactDescription: string;
}

export interface WeatherImpactMatrixItem {
  parameter: string; // e.g., 'Heavy Rain'
  crop: string;
  action: string;
}
