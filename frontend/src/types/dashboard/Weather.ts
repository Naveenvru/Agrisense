export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfallMm: number;
  pressureHpa: number;
  impactSummary: string;
  isAlert: boolean;
}
