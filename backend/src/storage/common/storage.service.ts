import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StorageRegistry } from './storage.registry';
import {
  StorageLocation,
  StorageResult,
  SaveOptions,
  ReadOptions,
  ListOptions,
} from './storage.types';
import { StorageProviderName } from './storage.constants';

/**
 * StorageService
 *
 * The single façade that business modules and collectors use for all
 * storage operations.  It never exposes a filesystem path or cloud URL.
 *
 * Responsibilities
 * ─────────────────
 * ✔ Accept logical StorageLocation objects
 * ✔ Resolve the correct provider from StorageRegistry
 * ✔ Delegate save / read / delete / exists / list to the provider
 * ✔ Log all operations with duration telemetry
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No filesystem calls directly
 * ✗ No business logic
 * ✗ No transformation or normalisation
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly registry: StorageRegistry) {}

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  async save(
    location: StorageLocation,
    content: string | Buffer,
    options?: SaveOptions,
    providerName?: StorageProviderName | string,
  ): Promise<StorageResult> {
    const start = Date.now();
    const provider = this.resolveProvider(providerName);

    this.logger.log(
      `SAVE | provider=${provider.providerName} tier=${location.tier} domain=${location.domain} file=${location.filename}`,
    );

    const result = await provider.save(location, content, options);
    this.logger.log(`SAVE complete | ${Date.now() - start}ms | success=${result.success}`);
    return result;
  }

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------

  async read(
    location: StorageLocation,
    options?: ReadOptions,
    providerName?: StorageProviderName | string,
  ): Promise<StorageResult<string | Buffer>> {
    const start = Date.now();
    const provider = this.resolveProvider(providerName);

    this.logger.log(
      `READ | provider=${provider.providerName} tier=${location.tier} domain=${location.domain} file=${location.filename}`,
    );

    const result = await provider.read(location, options);
    this.logger.log(`READ complete | ${Date.now() - start}ms | success=${result.success}`);
    return result;
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  async delete(
    location: StorageLocation,
    providerName?: StorageProviderName | string,
  ): Promise<StorageResult> {
    const start = Date.now();
    const provider = this.resolveProvider(providerName);

    this.logger.log(
      `DELETE | provider=${provider.providerName} tier=${location.tier} domain=${location.domain} file=${location.filename}`,
    );

    const result = await provider.delete(location);
    this.logger.log(`DELETE complete | ${Date.now() - start}ms | success=${result.success}`);
    return result;
  }

  // ---------------------------------------------------------------------------
  // Exists
  // ---------------------------------------------------------------------------

  async exists(
    location: StorageLocation,
    providerName?: StorageProviderName | string,
  ): Promise<boolean> {
    const provider = this.resolveProvider(providerName);
    return provider.exists(location);
  }

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async list(
    tier: string,
    domain: string,
    options?: ListOptions,
    providerName?: StorageProviderName | string,
  ): Promise<string[]> {
    const provider = this.resolveProvider(providerName);
    return provider.list(tier, domain, options);
  }

  // ---------------------------------------------------------------------------
  // Helper
  // ---------------------------------------------------------------------------

  private resolveProvider(
    name?: StorageProviderName | string,
  ) {
    const provider = name ? this.registry.get(name) : this.registry.getDefault();

    if (!provider) {
      throw new NotFoundException(
        `Storage provider "${name ?? 'default'}" is not registered.`,
      );
    }

    return provider;
  }
}
