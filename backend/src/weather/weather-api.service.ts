import { Injectable } from '@nestjs/common';
import { IWeatherHistory, IWeatherForecast } from '../mongodb/interfaces/weather.interface';
import { OpenWeatherClient } from '../integrations/weather/openweather.client';

/**
 * WeatherApiService
 *
 * Facade between WeatherService (business logic) and OpenWeatherClient
 * (integration layer). Preserves the existing WeatherService interface
 * while delegating all external communication to OpenWeatherClient.
 *
 * Business rules: NONE — pure delegation.
 * HTTP logic: NONE — handled by BaseHttpClient.
 * Mapping logic: NONE — handled by WeatherMapper.
 */
@Injectable()
export class WeatherApiService {
  constructor(private readonly openWeatherClient: OpenWeatherClient) {}

  /**
   * Fetch current weather for the given coordinates.
   */
  async fetchCurrentWeather(
    latitude: number,
    longitude: number,
  ): Promise<IWeatherHistory> {
    return this.openWeatherClient.fetchCurrentWeather(latitude, longitude);
  }

  /**
   * Fetch the 5-day / 3-hour weather forecast for the given coordinates.
   */
  async fetchForecast(
    latitude: number,
    longitude: number,
  ): Promise<IWeatherForecast[]> {
    return this.openWeatherClient.fetchForecast(latitude, longitude);
  }
}
