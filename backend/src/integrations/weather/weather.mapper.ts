import { Injectable } from '@nestjs/common';
import { IWeatherHistory, IWeatherForecast } from '../../mongodb/interfaces/weather.interface';
import { OWCurrentWeatherResponse, OWForecastResponse } from './weather.types';
import { INTEGRATION_CONSTANTS } from '../common/integration.constants';

/**
 * WeatherMapper
 *
 * Single Responsibility: Convert raw OpenWeather API responses into
 * AgriSense's internal IWeatherHistory and IWeatherForecast shapes.
 *
 * Rules
 * ─────
 * ✔ No HTTP calls — pure data transformation only.
 * ✔ No MongoDB calls — transformations only.
 * ✔ No business logic — mapping only.
 *
 * If OpenWeather changes a field name, only this file needs to change.
 */
@Injectable()
export class WeatherMapper {
  /**
   * Map a raw /weather response to AgriSense's IWeatherHistory.
   */
  mapCurrentWeather(
    raw: OWCurrentWeatherResponse,
    latitude: number,
    longitude: number,
  ): IWeatherHistory {
    return {
      locationId: this.buildLocationId(latitude, longitude),
      district: raw.name || 'Unknown',
      state: '',
      country: raw.sys?.country || 'Unknown',
      latitude,
      longitude,
      timestamp: new Date(raw.dt * 1000),
      temperature: raw.main.temp,
      humidity: raw.main.humidity,
      rainfall: raw.rain?.['1h'] ?? raw.rain?.['3h'] ?? 0,
      windSpeed: raw.wind.speed,
      pressure: raw.main.pressure,
      weatherCondition: raw.weather[0]?.main || 'Unknown',
      source: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
    };
  }

  /**
   * Map a raw /forecast response to an array of IWeatherForecast.
   */
  mapForecast(
    raw: OWForecastResponse,
    latitude: number,
    longitude: number,
  ): IWeatherForecast[] {
    const locationId = this.buildLocationId(latitude, longitude);

    return raw.list.map((item) => ({
      locationId,
      forecastDate: new Date(item.dt * 1000),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      rainProbability: Math.round((item.pop ?? 0) * 100),
      windSpeed: item.wind.speed,
      weatherCondition: item.weather[0]?.main || 'Unknown',
      source: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
    }));
  }

  private buildLocationId(latitude: number, longitude: number): string {
    return `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
  }
}
