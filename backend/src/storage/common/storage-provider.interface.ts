import {
  StorageLocation,
  StorageResult,
  StorageHealthResult,
  SaveOptions,
  ReadOptions,
  ListOptions,
} from './storage.types';

/**
 * IStorageProvider
 *
 * The root interface that every storage backend must implement.
 * Business modules only ever talk to StorageService which delegates
 * to a registered IStorageProvider — they never know which backend is used.
 *
 * Implementations
 * ────────────────
 * ✔ LocalStorageProvider   — Phase 8.7 (filesystem)
 * ⬜ IPFSStorageProvider    — future
 * ⬜ S3StorageProvider      — future
 * ⬜ AzureBlobProvider      — future
 */
export interface IStorageProvider {
  /** Unique name of this provider (must match STORAGE_CONSTANTS.PROVIDERS) */
  readonly providerName: string;

  /**
   * Save content to a storage location.
   *
   * @param location  Logical address (tier + domain + filename)
   * @param content   File content — string (JSON/CSV/XML) or Buffer (binary)
   * @param options   Optional save settings
   */
  save(
    location: StorageLocation,
    content: string | Buffer,
    options?: SaveOptions,
  ): Promise<StorageResult>;

  /**
   * Read content from a storage location.
   *
   * @param location  Logical address to read from
   * @param options   Read encoding options
   */
  read(location: StorageLocation, options?: ReadOptions): Promise<StorageResult<string | Buffer>>;

  /**
   * Delete a file from storage.
   *
   * @param location  Logical address to delete
   */
  delete(location: StorageLocation): Promise<StorageResult>;

  /**
   * Check whether a file exists at the given location.
   *
   * @param location  Logical address to check
   */
  exists(location: StorageLocation): Promise<boolean>;

  /**
   * List files in a storage tier + domain directory.
   *
   * @param tier    Storage tier (raw / processed / archive / reports)
   * @param domain  Data domain (weather / market / government)
   * @param options Filtering and sorting options
   */
  list(
    tier: string,
    domain: string,
    options?: ListOptions,
  ): Promise<string[]>;

  /**
   * Perform a health check on this storage provider.
   */
  health(): Promise<StorageHealthResult>;
}
