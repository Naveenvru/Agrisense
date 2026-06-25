import { Module } from '@nestjs/common';
import { BaseHttpClient } from './base-http.client';
import { RetryService } from './retry.service';
import { CacheService } from './cache.service';
import { IntegrationRegistry } from './integration.registry';
import { IntegrationHealthService } from './integration-health.service';
import { OpenWeatherClient } from '../weather/openweather.client';
import { WeatherMapper } from '../weather/weather.mapper';

/**
 * IntegrationModule
 *
 * The root infrastructure module for the AgriSense Integration Layer.
 *
 * Exports (Phase 8.5 + 8.6)
 * ──────────────────────────
 * ✔ BaseHttpClient          — all HTTP communication
 * ✔ RetryService            — exponential-backoff retry
 * ✔ CacheService            — in-memory TTL cache (Redis-ready)
 * ✔ IntegrationRegistry     — self-registering provider directory
 * ✔ IntegrationHealthService — provider health checks
 * ✔ OpenWeatherClient       — OpenWeather API gateway
 * ✔ WeatherMapper           — OW response → AgriSense internal types
 *
 * Any feature module needing external API access imports IntegrationModule.
 */
@Module({
  providers: [
    // Core infrastructure
    RetryService,
    CacheService,
    BaseHttpClient,
    // Registry & health
    IntegrationRegistry,
    // Weather integration
    WeatherMapper,
    OpenWeatherClient,
    // Health service depends on Registry + OpenWeatherClient
    IntegrationHealthService,
  ],
  exports: [
    RetryService,
    CacheService,
    BaseHttpClient,
    IntegrationRegistry,
    IntegrationHealthService,
    WeatherMapper,
    OpenWeatherClient,
  ],
})
export class IntegrationModule {}
