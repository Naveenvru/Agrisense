import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IWeatherHistory, IWeatherForecast } from '../../mongodb/interfaces/weather.interface';
import { IIntegrationProvider } from '../common/provider.interface';
import { ProviderHealthResult } from '../common/integration.types';
import { INTEGRATION_CONSTANTS } from '../common/integration.constants';
import { BaseHttpClient } from '../common/base-http.client';
import { WeatherMapper } from './weather.mapper';
import { OWCurrentWeatherResponse, OWForecastResponse } from './weather.types';

/**
 * OpenWeatherClient
 *
 * The ONLY class in AgriSense allowed to communicate with the OpenWeather API.
 *
 * Responsibilities
 * ─────────────────
 * ✔ Builds request URLs using API key + coordinates
 * ✔ Delegates all HTTP calls to BaseHttpClient (never uses fetch directly)
 * ✔ Delegates response mapping to WeatherMapper
 * ✔ Implements IIntegrationProvider for uniform provider contract
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No MongoDB operations
 * ✗ No cache logic
 * ✗ No business decisions
 */
@Injectable()
export class OpenWeatherClient implements IIntegrationProvider {
  private readonly logger = new Logger(OpenWeatherClient.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: BaseHttpClient,
    private readonly mapper: WeatherMapper,
  ) {
    this.apiKey =
      this.configService.get<string>('OPENWEATHER_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('OPENWEATHER_BASE_URL') ||
      'https://api.openweathermap.org/data/2.5';
  }

  // ---------------------------------------------------------------------------
  // IIntegrationProvider implementation
  // ---------------------------------------------------------------------------

  /**
   * Generic fetch — delegates to specific methods based on params.endpoint.
   */
  async fetch<T = unknown>(params: Record<string, unknown>): Promise<T> {
    const endpoint = params['endpoint'] as string;
    const latitude = params['latitude'] as number;
    const longitude = params['longitude'] as number;

    if (endpoint === 'current') {
      return this.fetchCurrentWeather(latitude, longitude) as Promise<T>;
    }
    if (endpoint === 'forecast') {
      return this.fetchForecast(latitude, longitude) as Promise<T>;
    }

    throw new Error(`OpenWeatherClient.fetch: unknown endpoint "${endpoint}"`);
  }

  /**
   * API-key based — no runtime authentication needed.
   */
  async authenticate(): Promise<void> {
    this.logger.debug('OpenWeather uses API key authentication — no token refresh required.');
  }

  /**
   * Lightweight health check: fetch weather for a well-known location (London).
   */
  async health(): Promise<ProviderHealthResult> {
    const start = Date.now();
    try {
      const url = `${this.baseUrl}/weather`;
      await this.httpClient.get<OWCurrentWeatherResponse>(url, {
        params: { lat: 51.5074, lon: -0.1278, appid: this.apiKey, units: 'metric' },
        timeoutMs: 5_000,
      });

      return {
        provider: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        healthy: true,
        latencyMs: Date.now() - start,
        checkedAt: new Date(),
      };
    } catch (error: any) {
      return {
        provider: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        healthy: false,
        latencyMs: Date.now() - start,
        message: error?.message,
        checkedAt: new Date(),
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Domain-specific fetch methods (used directly by WeatherApiService)
  // ---------------------------------------------------------------------------

  /**
   * Fetch current weather conditions for the given coordinates.
   */
  async fetchCurrentWeather(
    latitude: number,
    longitude: number,
  ): Promise<IWeatherHistory> {
    this.logger.log(`Fetching current weather | lat=${latitude} lon=${longitude}`);

    const url = `${this.baseUrl}/weather`;
    const response = await this.httpClient.get<OWCurrentWeatherResponse>(url, {
      params: { lat: latitude, lon: longitude, appid: this.apiKey, units: 'metric' },
    });

    return this.mapper.mapCurrentWeather(response.data, latitude, longitude);
  }

  /**
   * Fetch a 5-day / 3-hour forecast for the given coordinates.
   */
  async fetchForecast(
    latitude: number,
    longitude: number,
  ): Promise<IWeatherForecast[]> {
    this.logger.log(`Fetching forecast | lat=${latitude} lon=${longitude}`);

    const url = `${this.baseUrl}/forecast`;
    const response = await this.httpClient.get<OWForecastResponse>(url, {
      params: { lat: latitude, lon: longitude, appid: this.apiKey, units: 'metric' },
    });

    return this.mapper.mapForecast(response.data, latitude, longitude);
  }
}
