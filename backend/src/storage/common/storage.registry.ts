import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider } from './storage-provider.interface';
import { StorageProviderInfo, StorageHealthResult } from './storage.types';
import { StorageProviderName } from './storage.constants';

/**
 * StorageRegistry
 *
 * A self-registering directory of all active storage providers.
 * Mirrors the pattern of IntegrationRegistry from Phase 8.5.
 *
 * Design
 * ───────
 * ✔ Open/Closed — new providers register without modifying this file
 * ✔ StorageService queries the registry; it never hardcodes a provider
 * ✔ StorageHealthService uses getAll() to health-check every provider
 *
 * Future providers (IPFS, S3, Azure) call register() in their OnModuleInit.
 */
@Injectable()
export class StorageRegistry {
  private readonly logger = new Logger(StorageRegistry.name);

  private readonly providers = new Map<string, IStorageProvider>();
  private readonly providerInfos = new Map<string, StorageProviderInfo>();

  /** Default provider name — used when no specific provider is requested */
  private defaultProvider: string = 'local';

  /**
   * Register a storage provider.
   *
   * @param info      Metadata about the provider
   * @param provider  The IStorageProvider implementation
   */
  register(info: StorageProviderInfo, provider: IStorageProvider): void {
    this.providers.set(info.name, provider);
    this.providerInfos.set(info.name, info);

    if (info.isDefault) {
      this.defaultProvider = info.name;
    }

    this.logger.log(`Storage provider registered: "${info.name}" | default=${info.isDefault}`);
  }

  /**
   * Retrieve a provider by name.
   * Falls back to the default provider if name not found.
   */
  get(name?: StorageProviderName | string): IStorageProvider | undefined {
    const key = name ?? this.defaultProvider;
    const provider = this.providers.get(key);

    if (!provider) {
      this.logger.warn(`Storage provider "${key}" is not registered. Available: [${this.getRegisteredNames().join(', ')}]`);
    }

    return provider;
  }

  /** Return the default provider instance */
  getDefault(): IStorageProvider | undefined {
    return this.providers.get(this.defaultProvider);
  }

  /** All registered providers as a read-only map */
  getAll(): ReadonlyMap<string, IStorageProvider> {
    return this.providers;
  }

  /** Names of all registered providers */
  getRegisteredNames(): string[] {
    return Array.from(this.providers.keys());
  }

  /** Provider info records (for health dashboards) */
  getAllInfo(): StorageProviderInfo[] {
    return Array.from(this.providerInfos.values());
  }

  /** Whether a provider with the given name is registered */
  isRegistered(name: string): boolean {
    return this.providers.has(name);
  }

  /** Run health checks on every registered provider */
  async healthCheckAll(): Promise<StorageHealthResult[]> {
    const results: StorageHealthResult[] = [];

    for (const [name, provider] of this.providers) {
      try {
        const result = await provider.health();
        results.push(result);
      } catch (error: any) {
        results.push({
          provider: name,
          healthy: false,
          writable: false,
          freeSpaceBytes: -1,
          latencyMs: -1,
          message: `Health check threw: ${error?.message}`,
          checkedAt: new Date(),
        });
      }
    }

    return results;
  }
}
