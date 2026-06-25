import { Injectable, Logger } from '@nestjs/common';
import { IWeatherHistory, IWeatherForecast } from '../../mongodb/interfaces/weather.interface';
import { OpenWeatherClient } from '../../integrations/weather/openweather.client';
import { CollectorLogger } from '../common/collector-logger.service';
import { ICollector } from '../common/collector.interface';
import {
  CollectionParams,
  CollectionResult,
  CollectorStatus,
} from '../common/collector.types';
import {
  COLLECTOR_CONSTANTS,
  CollectorDomain,
} from '../common/collector.constants';
import { INTEGRATION_CONSTANTS } from '../../integrations/common/integration.constants';

/**
 * WeatherCollector
 *
 * Responsible ONLY for receiving a collection request, calling the
 * OpenWeatherClient, and returning the raw provider data with telemetry.
 *
 * What it does
 * ─────────────
 * ✔ Calls OpenWeatherClient.fetchCurrentWeather() / fetchForecast()
 * ✔ Records timing and retry metadata
 * ✔ Returns raw IWeatherHistory / IWeatherForecast (as-is from provider)
 * ✔ Logs every collection via CollectorLogger
 * ✔ Tracks its own operational status
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No normalization
 * ✗ No analytics
 * ✗ No MongoDB writes (those belong to WeatherService)
 * ✗ No business decisions
 */
@Injectable()
export class WeatherCollector implements ICollector {
  private readonly logger = new Logger(WeatherCollector.name);

  // Operational stats
  private totalCollections = 0;
  private successCount = 0;
  private failureCount = 0;
  private lastSuccessAt?: Date;
  private lastFailureAt?: Date;

  constructor(
    private readonly openWeatherClient: OpenWeatherClient,
    private readonly collectorLogger: CollectorLogger,
  ) {}

  // ---------------------------------------------------------------------------
  // ICollector.collect()
  // ---------------------------------------------------------------------------

  async collect(
    params: CollectionParams,
  ): Promise<CollectionResult<IWeatherHistory | IWeatherForecast[]>> {
    const { operation, payload } = params;
    const startTime = Date.now();
    const requestedAt = new Date();

    this.collectorLogger.logStart(
      INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
      operation,
    );

    this.totalCollections++;

    try {
      const latitude = payload['latitude'] as number;
      const longitude = payload['longitude'] as number;

      let rawData: IWeatherHistory | IWeatherForecast[];

      if (operation === COLLECTOR_CONSTANTS.OPERATIONS.CURRENT_WEATHER) {
        rawData = await this.openWeatherClient.fetchCurrentWeather(latitude, longitude);
      } else if (operation === COLLECTOR_CONSTANTS.OPERATIONS.WEATHER_FORECAST) {
        rawData = await this.openWeatherClient.fetchForecast(latitude, longitude);
      } else {
        throw new Error(`WeatherCollector: unsupported operation "${operation}"`);
      }

      const durationMs = Date.now() - startTime;
      this.successCount++;
      this.lastSuccessAt = new Date();

      const result: CollectionResult<IWeatherHistory | IWeatherForecast[]> = {
        domain: COLLECTOR_CONSTANTS.DOMAINS.WEATHER as CollectorDomain,
        operation,
        provider: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        rawData,
        status: COLLECTOR_CONSTANTS.STATUS.SUCCESS,
        collectedAt: requestedAt,
        durationMs,
        retryCount: 0,
      };

      this.collectorLogger.logCollection({
        provider: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        operation,
        requestedAt,
        respondedAt: new Date(),
        durationMs,
        status: COLLECTOR_CONSTANTS.STATUS.SUCCESS,
        retryCount: 0,
      });

      return result;
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      this.failureCount++;
      this.lastFailureAt = new Date();

      const result: CollectionResult<null> = {
        domain: COLLECTOR_CONSTANTS.DOMAINS.WEATHER as CollectorDomain,
        operation,
        provider: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        rawData: null,
        status: COLLECTOR_CONSTANTS.STATUS.FAILED,
        collectedAt: requestedAt,
        durationMs,
        retryCount: 0,
        errorMessage: error?.message,
      };

      this.collectorLogger.logCollection({
        provider: INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        operation,
        requestedAt,
        respondedAt: new Date(),
        durationMs,
        status: COLLECTOR_CONSTANTS.STATUS.FAILED,
        retryCount: 0,
        errorMessage: error?.message,
      });

      this.logger.error(
        `WeatherCollector.collect failed | operation=${operation} | ${error?.message}`,
      );

      throw error; // re-throw so callers can handle
    }
  }

  // ---------------------------------------------------------------------------
  // ICollector.store()
  // ---------------------------------------------------------------------------

  /**
   * Phase 8.6: logs the store intent to console.
   * Phase 8.7: will write to MongoDB Data Lake raw storage.
   */
  async store(result: CollectionResult): Promise<void> {
    this.collectorLogger.logStore(
      result.provider,
      result.operation,
      'data-lake/raw/weather (Phase 8.7)',
    );
    // Phase 8.7: await this.dataLakeService.writeRaw('weather', result);
  }

  // ---------------------------------------------------------------------------
  // ICollector.status()
  // ---------------------------------------------------------------------------

  status(): CollectorStatus {
    return {
      domain: COLLECTOR_CONSTANTS.DOMAINS.WEATHER as CollectorDomain,
      operational: true,
      lastSuccessAt: this.lastSuccessAt,
      lastFailureAt: this.lastFailureAt,
      totalCollections: this.totalCollections,
      successCount: this.successCount,
      failureCount: this.failureCount,
    };
  }
}
