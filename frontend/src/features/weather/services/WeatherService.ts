import { 
  WeatherData, AiWeatherRecommendation, HourlyForecast, DailyForecast, 
  WeatherRisk, FarmWeatherImpact, WeatherAlert, HistoricalWeatherPoint,
  AgriculturalDecision, CropWeatherImpact, WeatherImpactMatrixItem 
} from '../types';

import {
  MOCK_CURRENT_WEATHER, MOCK_AI_RECOMMENDATION, MOCK_HOURLY_FORECAST,
  MOCK_WEEKLY_FORECAST, MOCK_WEATHER_RISKS, MOCK_FARM_IMPACTS,
  MOCK_WEATHER_ALERTS, MOCK_HISTORICAL_DATA, MOCK_AGRICULTURAL_DECISIONS,
  MOCK_CROP_IMPACTS, MOCK_IMPACT_MATRIX
} from '../mocks/weather.mock';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class WeatherService {
  static async getCurrentWeather(): Promise<WeatherData> {
    await delay(500);
    return MOCK_CURRENT_WEATHER;
  }

  static async getAiRecommendation(): Promise<AiWeatherRecommendation> {
    await delay(600);
    return MOCK_AI_RECOMMENDATION;
  }

  static async getAgriculturalDecisions(): Promise<AgriculturalDecision[]> {
    await delay(400);
    return MOCK_AGRICULTURAL_DECISIONS;
  }

  static async getHourlyForecast(): Promise<HourlyForecast[]> {
    await delay(700);
    return MOCK_HOURLY_FORECAST;
  }

  static async getWeeklyForecast(): Promise<DailyForecast[]> {
    await delay(600);
    return MOCK_WEEKLY_FORECAST;
  }

  static async getWeatherRisks(): Promise<WeatherRisk[]> {
    await delay(500);
    return MOCK_WEATHER_RISKS;
  }

  static async getFarmImpacts(): Promise<FarmWeatherImpact[]> {
    await delay(800);
    return MOCK_FARM_IMPACTS;
  }

  static async getCropImpacts(): Promise<CropWeatherImpact[]> {
    await delay(600);
    return MOCK_CROP_IMPACTS;
  }

  static async getImpactMatrix(): Promise<WeatherImpactMatrixItem[]> {
    await delay(500);
    return MOCK_IMPACT_MATRIX;
  }

  static async getWeatherAlerts(): Promise<WeatherAlert[]> {
    await delay(400);
    return MOCK_WEATHER_ALERTS;
  }

  static async getHistoricalWeather(): Promise<HistoricalWeatherPoint[]> {
    await delay(900);
    return MOCK_HISTORICAL_DATA;
  }
}
