import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StorageRegistry } from './storage.registry';
import { LocalStorageProvider } from '../local/local-storage.provider';
import { StorageHealthResult } from './storage.types';
import { STORAGE_CONSTANTS } from './storage.constants';

/**
 * StorageHealthService
 *
 * Checks the health of all registered storage providers on demand.
 * Implements OnModuleInit to auto-register LocalStorageProvider on startup.
 *
 * Future providers (IPFS, S3, Azure) register themselves via their own
 * OnModuleInit — no changes to this file required.
 */
@Injectable()
export class StorageHealthService implements OnModuleInit {
  private readonly logger = new Logger(StorageHealthService.name);

  constructor(
    private readonly registry: StorageRegistry,
    private readonly localProvider: LocalStorageProvider,
  ) {}

  onModuleInit(): void {
    // Register local storage as the default provider
    this.registry.register(
      {
        name: STORAGE_CONSTANTS.PROVIDERS.LOCAL,
        description: 'Local filesystem storage',
        rootPath: 'storage/',
        isDefault: true,
        supportsStreaming: false,
        supportsVersioning: false,
      },
      this.localProvider,
    );

    this.logger.log(
      `StorageHealthService initialised. Registered providers: [${this.registry.getRegisteredNames().join(', ')}]`,
    );
  }

  /**
   * Run health checks on all registered storage providers.
   */
  async checkAll(): Promise<StorageHealthResult[]> {
    this.logger.log('Running storage health checks...');
    const results = await this.registry.healthCheckAll();

    for (const r of results) {
      if (r.healthy) {
        this.logger.log(
          `[${r.provider}] ✓ Healthy | writable=${r.writable} | latency=${r.latencyMs}ms`,
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
  async checkOne(providerName: string): Promise<StorageHealthResult> {
    const provider = this.registry.get(providerName);

    if (!provider) {
      return {
        provider: providerName,
        healthy: false,
        writable: false,
        freeSpaceBytes: -1,
        latencyMs: -1,
        message: `Provider "${providerName}" is not registered.`,
        checkedAt: new Date(),
      };
    }

    return provider.health();
  }

  /**
   * Summary of all registered storage providers (no I/O).
   */
  getRegisteredProviders(): string[] {
    return this.registry.getRegisteredNames();
  }
}
