import { 
  WeatherData, AiWeatherRecommendation, HourlyForecast, DailyForecast, 
  WeatherRisk, FarmWeatherImpact, WeatherAlert, HistoricalWeatherPoint,
  AgriculturalDecision, CropWeatherImpact, WeatherImpactMatrixItem 
} from '../types';

export const MOCK_CURRENT_WEATHER: WeatherData = {
  temperature: 28,
  feelsLike: 31,
  humidity: 78,
  pressure: 1012,
  windSpeed: 14,
  windDirection: 'NE',
  visibility: 8,
  uvIndex: 6,
  airQuality: 45,
  dewPoint: 22,
  cloudCover: 65,
  rainfall: 12,
  sunrise: '06:12 AM',
  sunset: '06:45 PM',
  condition: 'Rain'
};

export const MOCK_AI_RECOMMENDATION: AiWeatherRecommendation = {
  id: 'rec1',
  recommendation: 'Delay Irrigation & Avoid Spraying',
  reason: '78% humidity and 12mm rainfall expected over the next 6 hours creating high wash-off risk.',
  confidence: 94,
  expectedBenefit: 'Save 4,000L water and prevent chemical runoff.',
  priority: 'High Risk'
};

export const MOCK_AGRICULTURAL_DECISIONS: AgriculturalDecision[] = [
  { type: 'Irrigation Decision', status: 'High Risk', confidence: 95, recommendedAction: 'Delay until tomorrow' },
  { type: 'Spraying Window', status: 'Critical', confidence: 92, recommendedAction: 'Avoid - Rain Expected' },
  { type: 'Harvest Window', status: 'Caution', confidence: 85, recommendedAction: 'Harvest early morning only' },
  { type: 'Fertilizer Window', status: 'High Risk', confidence: 88, recommendedAction: 'Delay - Runoff risk' },
  { type: 'Disease Risk', status: 'Caution', confidence: 78, recommendedAction: 'Monitor for Fungal activity' },
  { type: 'Water Stress', status: 'Safe', confidence: 96, recommendedAction: 'Optimal moisture' }
];

export const MOCK_HOURLY_FORECAST: HourlyForecast[] = [
  { time: '06:00', condition: 'Cloudy', temperature: 22, rainProbability: 10, windSpeed: 8, humidity: 85, recommendedAction: 'Best Harvest Window' },
  { time: '09:00', condition: 'Cloudy', temperature: 25, rainProbability: 30, windSpeed: 10, humidity: 80, recommendedAction: 'Safe for fieldwork' },
  { time: '12:00', condition: 'Rain', temperature: 27, rainProbability: 85, windSpeed: 15, humidity: 75, recommendedAction: 'Seek shelter / Indoor tasks' },
  { time: '15:00', condition: 'Rain', temperature: 26, rainProbability: 90, windSpeed: 18, humidity: 82, recommendedAction: 'Avoid Transplanting' },
  { time: '18:00', condition: 'Storm', temperature: 24, rainProbability: 95, windSpeed: 25, humidity: 88, recommendedAction: 'Delay all field activities' },
  { time: '21:00', condition: 'Rain', temperature: 22, rainProbability: 60, windSpeed: 12, humidity: 90, recommendedAction: 'Monitor greenhouse temps' },
];

export const MOCK_WEEKLY_FORECAST: DailyForecast[] = [
  { date: 'Today', condition: 'Rain', maxTemp: 28, minTemp: 22, rainProbability: 85, humidity: 78, windSpeed: 14, agriculturalImpact: 'Delay Irrigation' },
  { date: 'Tomorrow', condition: 'Cloudy', maxTemp: 30, minTemp: 23, rainProbability: 30, humidity: 70, windSpeed: 10, agriculturalImpact: 'Optimal Spraying' },
  { date: 'Wed', condition: 'Sunny', maxTemp: 33, minTemp: 24, rainProbability: 5, humidity: 55, windSpeed: 8, agriculturalImpact: 'Resume Irrigation' },
  { date: 'Thu', condition: 'Sunny', maxTemp: 35, minTemp: 25, rainProbability: 0, humidity: 50, windSpeed: 12, agriculturalImpact: 'Heat Stress Caution' },
  { date: 'Fri', condition: 'Sunny', maxTemp: 36, minTemp: 25, rainProbability: 0, humidity: 45, windSpeed: 15, agriculturalImpact: 'Increase Watering' },
  { date: 'Sat', condition: 'Cloudy', maxTemp: 34, minTemp: 24, rainProbability: 20, humidity: 60, windSpeed: 10, agriculturalImpact: 'Safe for Harvest' },
  { date: 'Sun', condition: 'Rain', maxTemp: 31, minTemp: 23, rainProbability: 65, humidity: 75, windSpeed: 12, agriculturalImpact: 'Monitor Disease' },
];

export const MOCK_WEATHER_RISKS: WeatherRisk[] = [
  { id: 'r1', type: 'Rain Risk', level: 'High Risk', description: 'Heavy rainfall expected this afternoon.', recommendation: 'Delay irrigation and chemical applications.', confidence: 92 },
  { id: 'r2', type: 'Disease Risk', level: 'Caution', description: 'High humidity favors fungal growth.', recommendation: 'Monitor susceptible crops (Tomato, Potato).', confidence: 78 },
  { id: 'r3', type: 'Heat Stress', level: 'Safe', description: 'Temperatures within optimal range.', recommendation: 'Standard watering schedule.', confidence: 95 },
  { id: 'r4', type: 'Wind Risk', level: 'Caution', description: 'Moderate gusts expected evening.', recommendation: 'Secure loose greenhouse panels.', confidence: 85 },
];

export const MOCK_FARM_IMPACTS: FarmWeatherImpact[] = [
  { farmId: 'f1', farmName: 'Sunny Valley Farm', condition: 'Rain Expected', impact: 'Delay Irrigation', confidence: 95 },
  { farmId: 'f2', farmName: 'Riverbed Acres', condition: 'High Humidity', impact: 'Disease Monitoring Recommended', confidence: 88 },
  { farmId: 'f3', farmName: 'Highland Farm', condition: 'Strong Winds', impact: 'Avoid Spraying Today', confidence: 92 },
];

export const MOCK_CROP_IMPACTS: CropWeatherImpact[] = [
  { crop: 'Tomato', status: 'Caution', impactDescription: 'Monitor for blight due to humidity' },
  { crop: 'Paddy', status: 'Safe', impactDescription: 'Rain Highly Beneficial' },
  { crop: 'Onion', status: 'High Risk', impactDescription: 'Vulnerable to current rainfall' },
  { crop: 'Corn', status: 'Safe', impactDescription: 'Normal Growth Conditions' },
];

export const MOCK_IMPACT_MATRIX: WeatherImpactMatrixItem[] = [
  { parameter: 'Heavy Rain', crop: 'Tomato', action: 'Delay Harvest' },
  { parameter: 'High Temperature', crop: 'Onion', action: 'Increase Irrigation' },
  { parameter: 'High Humidity', crop: 'Paddy', action: 'Monitor Disease' },
  { parameter: 'Strong Wind', crop: 'Corn', action: 'Avoid Spraying' },
];

export const MOCK_WEATHER_ALERTS: WeatherAlert[] = [
  { id: 'a1', title: 'Heavy Rain Warning', description: '12mm rainfall expected between 12:00 PM and 18:00 PM.', severity: 'Warning', time: '1 hour ago' },
  { id: 'a2', title: 'Fungal Disease Alert', description: 'Conditions highly favorable for Late Blight due to consecutive humid days.', severity: 'High Risk', time: '3 hours ago' },
];

export const MOCK_HISTORICAL_DATA: HistoricalWeatherPoint[] = [
  { date: 'Mon', temperature: 32, rainfall: 0, humidity: 55, windSpeed: 10 },
  { date: 'Tue', temperature: 34, rainfall: 0, humidity: 50, windSpeed: 12 },
  { date: 'Wed', temperature: 35, rainfall: 0, humidity: 48, windSpeed: 8 },
  { date: 'Thu', temperature: 33, rainfall: 2, humidity: 65, windSpeed: 15 },
  { date: 'Fri', temperature: 30, rainfall: 15, humidity: 82, windSpeed: 20 },
  { date: 'Sat', temperature: 29, rainfall: 8, humidity: 75, windSpeed: 14 },
  { date: 'Sun', temperature: 28, rainfall: 12, humidity: 78, windSpeed: 12 },
];
