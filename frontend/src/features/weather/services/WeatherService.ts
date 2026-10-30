import { apiClient } from '@/lib/axios';

export interface WeatherParcel { id: string; parcelName: string; latitude: number | null; longitude: number | null }
export interface CurrentObservation {
  parcelId: string; district?: string; state?: string; timestamp: string; temperature: number; feelsLike: number;
  humidity: number; rainfall: number; windSpeed: number; pressure: number; weatherCondition: string;
  weatherDescription: string; source: string;
}
export interface ForecastObservation {
  forecastDate: string; temperature: number; feelsLike: number; humidity: number; rainProbability: number;
  windSpeed: number; weatherCondition: string; weatherDescription: string;
}
export interface HistoricalObservation {
  timestamp: string; temperature: number; humidity: number; rainfall: number; windSpeed: number;
  pressure: number; weatherCondition: string;
}

export class WeatherService {
  static async getParcels(): Promise<WeatherParcel[]> {
    const { data } = await apiClient.get('/land-parcels');
    return (data?.data || []).map((parcel: any) => ({ ...parcel, id: String(parcel.id) }));
  }
  static async getCurrentWeather(parcelId: string): Promise<CurrentObservation> {
    const { data } = await apiClient.get(`/weather/current/${parcelId}`); return data;
  }
  static async getForecast(parcelId: string): Promise<ForecastObservation[]> {
    const { data } = await apiClient.get(`/weather/forecast/${parcelId}`); return data.forecasts || [];
  }
  static async getHistory(parcelId: string): Promise<HistoricalObservation[]> {
    const { data } = await apiClient.get(`/weather/history/${parcelId}`); return data.history || [];
  }
}
