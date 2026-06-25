import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IntegrationRegistry } from './integration.registry';
import { OpenWeatherClient } from '../weather/openweather.client';
import { ProviderHealthResult } from './integration.types';
import { INTEGRATION_CONSTANTS } from './integration.constants';

/**
 * IntegrationHealthService
 *
 * Checks the health of every registered external provider and returns
 * a unified status report. Implements OnModuleInit to auto-register
 * the OpenWeather provider on startup.
 *
 * Responsibilities
 * ─────────────────
 * ✔ Register known providers into IntegrationRegistry on startup
 * ✔ Check health of all registered providers
 * ✔ Return structured ProviderHealthResult[] for dashboards / monitoring
 *
 * Future providers register themselves automatically — no code change here.
 *
 * Usage
 * ──────
 * // From any module that imports IntegrationModule:
 * const report = await integrationHealthService.checkAll();
 */
@Injectable()
export class IntegrationHealthService implements OnModuleInit {
  private readonly logger = new Logger(IntegrationHealthService.name);

  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly openWeatherClient: OpenWeatherClient,
  ) {}

  /**
   * Register all known providers when the module boots.
   * Future providers call registry.register() in their own OnModuleInit.
   */
  onModuleInit(): void {
    this.registry.register(
      INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
      this.openWeatherClient,
    );
    this.logger.log(
      `IntegrationHealthService initialised. Registered providers: [${this.registry.getRegisteredNames().join(', ')}]`,
    );
  }

  /**
   * Run health checks on all registered providers.
   *
   * @returns Array of ProviderHealthResult, one per registered provider.
   */
  async checkAll(): Promise<ProviderHealthResult[]> {
    this.logger.log('Running health checks on all registered providers...');
    const results = await this.registry.healthCheckAll();

    for (const r of results) {
      if (r.healthy) {
        this.logger.log(
          `[${r.provider}] ✓ Healthy | latency=${r.latencyMs ?? '?'}ms`,
        );
      } else {
        this.logger.warn(
          `[${r.provider}] ✗ Unhealthy | ${r.message ?? 'no details'}`,
        );
      }
    }

    return results;
  }

  /**
   * Check health for a single named provider.
   */
  async checkOne(providerName: string): Promise<ProviderHealthResult> {
    const provider = this.registry.get(providerName);

    if (!provider) {
      return {
        provider: providerName,
        healthy: false,
        message: `Provider "${providerName}" is not registered.`,
        checkedAt: new Date(),
      };
    }

    return provider.health();
  }

  /**
   * Return a summary of which providers are registered (no HTTP calls).
   */
  getRegisteredProviders(): string[] {
    return this.registry.getRegisteredNames();
  }
}
