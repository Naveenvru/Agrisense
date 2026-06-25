import { Module } from '@nestjs/common';
import { IntegrationModule } from '../../integrations/common/integration.module';
import { OpenWeatherClient } from '../../integrations/weather/openweather.client';
import { WeatherMapper } from '../../integrations/weather/weather.mapper';
import { CollectorLogger } from './collector-logger.service';
import { WeatherCollector } from '../weather/weather.collector';
import { MarketCollector } from '../market/market.collector';
import { GovernmentCollector } from '../government/government.collector';

/**
 * CollectorModule
 *
 * The root NestJS module for the collector layer.
 * Any feature module that needs to collect external data imports this module.
 *
 * Exports
 * ────────
 * ✔ WeatherCollector      — live (Phase 8.6)
 * ✔ MarketCollector       — skeleton (Phase 9)
 * ✔ GovernmentCollector   — skeleton (future)
 * ✔ CollectorLogger       — shared telemetry logging
 *
 * Adding a new collector
 * ───────────────────────
 * 1. Create src/collectors/<domain>/<domain>.collector.ts
 * 2. Implement ICollector
 * 3. Add to providers[] and exports[] here
 * 4. Zero other changes needed
 */
@Module({
  imports: [
    // Integration layer — provides BaseHttpClient, RetryService, CacheService
    IntegrationModule,
  ],
  providers: [
    // Shared
    CollectorLogger,
    // Integration clients needed by collectors
    WeatherMapper,
    OpenWeatherClient,
    // Domain collectors
    WeatherCollector,
    MarketCollector,
    GovernmentCollector,
  ],
  exports: [
    CollectorLogger,
    WeatherCollector,
    MarketCollector,
    GovernmentCollector,
  ],
})
export class CollectorModule {}
