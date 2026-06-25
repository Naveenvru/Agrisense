import { Injectable, Logger } from '@nestjs/common';
import { IIntegrationProvider } from './provider.interface';
import { ProviderHealthResult } from './integration.types';
import { ProviderName } from './integration.constants';

/**
 * IntegrationRegistry
 *
 * A self-registering provider directory.
 * Every new provider registers itself here; business modules query it
 * without knowing which concrete providers exist.
 *
 * Design
 * ───────
 * ✔ Open/Closed — add providers by registering, not modifying
 * ✔ Future providers (AGMARKNET, IMD, ICAR, Firebase) call register() on startup
 * ✔ IntegrationHealthService reads all registered providers automatically
 *
 * How to register a new provider (Phase 9 example)
 * ──────────────────────────────────────────────────
 * constructor(registry: IntegrationRegistry, client: AgmarknetClient) {
 *   registry.register('agmarknet', client);
 * }
 */
@Injectable()
export class IntegrationRegistry {
  private readonly logger = new Logger(IntegrationRegistry.name);
  private readonly providers = new Map<string, IIntegrationProvider>();

  /**
   * Register a provider under the given name.
   * Overwrites any existing registration with the same name.
   */
  register(name: ProviderName | string, provider: IIntegrationProvider): void {
    this.providers.set(name, provider);
    this.logger.log(`Provider registered: "${name}"`);
  }

  /**
   * Retrieve a registered provider by name.
   * Returns undefined if not registered.
   */
  get(name: ProviderName | string): IIntegrationProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Returns all registered providers as a read-only map.
   */
  getAll(): ReadonlyMap<string, IIntegrationProvider> {
    return this.providers;
  }

  /**
   * Returns the names of all registered providers.
   */
  getRegisteredNames(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is registered.
   */
  isRegistered(name: string): boolean {
    return this.providers.has(name);
  }

  /**
   * Run health checks on all registered providers.
   */
  async healthCheckAll(): Promise<ProviderHealthResult[]> {
    const results: ProviderHealthResult[] = [];

    for (const [name, provider] of this.providers) {
      try {
        const result = await provider.health();
        results.push(result);
      } catch (error: any) {
        results.push({
          provider: name,
          healthy: false,
          message: `Health check threw: ${error?.message}`,
          checkedAt: new Date(),
        });
      }
    }

    return results;
  }
}
