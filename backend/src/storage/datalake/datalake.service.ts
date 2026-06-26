import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../common/storage.service';
import {
  StorageLocation,
  StorageResult,
  StorageMetadata,
} from '../common/storage.types';
import { STORAGE_CONSTANTS, StorageDomain, StorageTier } from '../common/storage.constants';
import { CollectionResult } from '../../collectors/common/collector.types';
import {
  DataLakeFormat,
  DataLakeSaveOptions,
  DataLakeReadResult,
  DataLakeListEntry,
  DataLakeArchiveResult,
  FORMAT_MIME,
  FORMAT_EXT,
} from './datalake.types';

/**
 * DataLakeService — Phase 8.8 (Data Lake Engine)
 *
 * The single entry-point for writing and reading raw collected datasets.
 * Collectors and business modules call DataLakeService; they never call
 * StorageService or LocalStorageProvider directly.
 *
 * Architecture
 * ─────────────
 *   Business Module → Collector → DataLakeService
 *                                      ↓
 *                               StorageService
 *                                      ↓
 *                          LocalStorageProvider
 *
 * Algorithms used
 * ────────────────
 * ✔ HashMap (metadataIndex)    — O(1) metadata lookup by tier/domain/filename key
 * ✔ SHA-256 checksum           — computed inside LocalStorageProvider, stored in metadata
 * ✔ Timestamp-based naming     — collision-free ISO-compact filenames
 * ✔ Filesystem directory index — leverages OS filesystem; no custom tree structure
 *
 * Operations
 * ───────────
 * ✔ save()        — store any JSON / CSV / XML content in any tier/domain
 * ✔ read()        — retrieve file content + metadata
 * ✔ exists()      — check presence of a stored file
 * ✔ delete()      — remove a file, evict from index
 * ✔ list()        — list files in a tier/domain with optional filters
 * ✔ archive()     — move a file from raw/ into archive/
 * ✔ writeRaw()    — store a CollectionResult in storage/raw/<domain>/
 * ✔ readRaw()     — retrieve a raw file
 * ✔ archiveRaw()  — move a raw file to archive/
 */
@Injectable()
export class DataLakeService {
  private readonly logger = new Logger(DataLakeService.name);

  /**
   * In-memory HashMap: "tier/domain/filename" → StorageMetadata
   *
   * Purpose: O(1) metadata lookups without repeated filesystem scans.
   * Populated on every successful save and evicted on delete/archive.
   * Survives only in-process; a cold-start re-populates on first access.
   */
  private readonly metadataIndex = new Map<string, StorageMetadata>();

  constructor(private readonly storageService: StorageService) {}

  // ---------------------------------------------------------------------------
  // save() — Generic store operation
  // ---------------------------------------------------------------------------

  /**
   * Store any dataset in the Data Lake.
   *
   * @param tier      Storage tier (raw / processed / archive / reports)
   * @param domain    Data domain (weather / market / government)
   * @param content   File content — string (JSON/CSV/XML) or Buffer
   * @param options   Format, source, tags, optional filename override
   * @returns         StorageResult with populated metadata on success
   */
  async save(
    tier: StorageTier,
    domain: StorageDomain,
    content: string | Buffer,
    options?: DataLakeSaveOptions,
  ): Promise<StorageResult> {
    const format: DataLakeFormat = options?.format ?? 'json';
    const filename =
      options?.filename ?? this.generateFilename(domain, format);

    const location: StorageLocation = { tier, domain, filename };

    const saveOpts = {
      mimeType: FORMAT_MIME[format],
      tags: {
        ...(options?.tags ?? {}),
        source: options?.source ?? 'unknown',
        format,
        domain,
        tier,
      },
    };

    const result = await this.storageService.save(location, content, saveOpts);

    if (result.success && result.metadata) {
      this.indexPut(tier, domain, filename, result.metadata);
      this.logger.log(
        `FILE STORED | tier=${tier} domain=${domain} file=${filename} size=${result.metadata.size}B checksum=${result.metadata.checksum.substring(0, 12)}...`,
      );
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // read() — Generic read operation
  // ---------------------------------------------------------------------------

  /**
   * Read a dataset from the Data Lake.
   *
   * Returns file content as a UTF-8 string plus metadata.
   * Metadata is served from the HashMap index when available; otherwise
   * derived from the StorageResult.
   *
   * @param tier      Storage tier
   * @param domain    Data domain
   * @param filename  Filename including extension
   */
  async read(
    tier: StorageTier,
    domain: StorageDomain,
    filename: string,
  ): Promise<DataLakeReadResult | null> {
    const location: StorageLocation = { tier, domain, filename };
    const result = await this.storageService.read(location, { encoding: 'utf8' });

    if (!result.success || result.data === undefined) {
      this.logger.warn(
        `FILE READ FAILED | tier=${tier} domain=${domain} file=${filename} | ${result.errorMessage}`,
      );
      return null;
    }

    // Prefer the HashMap entry; fall back to metadata from the provider
    const indexedMeta = this.indexGet(tier, domain, filename);
    const metadata = indexedMeta ?? result.metadata;

    if (!metadata) {
      this.logger.warn(
        `FILE READ | no metadata available for ${tier}/${domain}/${filename}`,
      );
      return null;
    }

    // Update index with freshest metadata
    this.indexPut(tier, domain, filename, metadata);

    const ext = filename.split('.').pop() ?? 'json';
    const format = this.extToFormat(ext);

    this.logger.log(
      `FILE READ | tier=${tier} domain=${domain} file=${filename} size=${metadata.size}B`,
    );

    return {
      content: result.data as string,
      metadata,
      format,
    };
  }

  // ---------------------------------------------------------------------------
  // exists()
  // ---------------------------------------------------------------------------

  /**
   * Check whether a file exists in the Data Lake.
   *
   * Fast path: checks HashMap index first (O(1)).
   * Slow path: delegates to StorageService → LocalStorageProvider (fs.existsSync).
   */
  async exists(
    tier: StorageTier,
    domain: StorageDomain,
    filename: string,
  ): Promise<boolean> {
    if (this.metadataIndex.has(this.indexKey(tier, domain, filename))) {
      return true;
    }
    const location: StorageLocation = { tier, domain, filename };
    return this.storageService.exists(location);
  }

  // ---------------------------------------------------------------------------
  // delete()
  // ---------------------------------------------------------------------------

  /**
   * Delete a file from the Data Lake.
   * Evicts the entry from the HashMap index on success.
   */
  async delete(
    tier: StorageTier,
    domain: StorageDomain,
    filename: string,
  ): Promise<StorageResult> {
    const location: StorageLocation = { tier, domain, filename };
    const result = await this.storageService.delete(location);

    if (result.success) {
      this.indexEvict(tier, domain, filename);
      this.logger.log(
        `FILE DELETED | tier=${tier} domain=${domain} file=${filename}`,
      );
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // list()
  // ---------------------------------------------------------------------------

  /**
   * List files in a given tier/domain directory.
   *
   * Enriches the filename list with metadata from the HashMap index
   * where available.
   */
  async list(
    tier: StorageTier,
    domain: StorageDomain,
    options?: { extension?: string; limit?: number },
  ): Promise<DataLakeListEntry[]> {
    const files = await this.storageService.list(tier, domain, {
      extension: options?.extension,
      limit: options?.limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    return files.map((filename) => ({
      filename,
      metadata: this.indexGet(tier, domain, filename),
    }));
  }

  // ---------------------------------------------------------------------------
  // archive() — Move a file from raw/ to archive/
  // ---------------------------------------------------------------------------

  /**
   * Move a file from any tier into archive/.
   *
   * Algorithm:
   *   1. Read file content from source tier/domain
   *   2. Write content to archive/<domain>/<filename>
   *   3. Delete original from source tier/domain
   *   4. Update HashMap index (evict source, insert archive key)
   *
   * Never bypasses StorageService.
   */
  async archive(
    sourceTier: StorageTier,
    domain: StorageDomain,
    filename: string,
  ): Promise<DataLakeArchiveResult> {
    const start = Date.now();
    const sourceLocation: StorageLocation = {
      tier: sourceTier,
      domain,
      filename,
    };
    const archiveLocation: StorageLocation = {
      tier: STORAGE_CONSTANTS.TIERS.ARCHIVE as StorageTier,
      domain,
      filename,
    };

    const sourcePath = `${sourceTier}/${domain}/${filename}`;
    const archivePath = `archive/${domain}/${filename}`;

    try {
      // Step 1 — Read from source
      const readResult = await this.storageService.read(sourceLocation, {
        encoding: 'utf8',
      });

      if (!readResult.success || readResult.data === undefined) {
        return {
          success: false,
          sourcePath,
          archivePath,
          durationMs: Date.now() - start,
          errorMessage: `Archive read failed: ${readResult.errorMessage}`,
        };
      }

      // Step 2 — Write to archive
      const sourceMeta = this.indexGet(sourceTier, domain, filename);
      const saveResult = await this.storageService.save(
        archiveLocation,
        readResult.data as string,
        {
          overwrite: true,
          mimeType: sourceMeta?.mimeType,
          tags: {
            ...(sourceMeta?.tags ?? {}),
            archivedFrom: sourcePath,
            archivedAt: new Date().toISOString(),
          },
        },
      );

      if (!saveResult.success) {
        return {
          success: false,
          sourcePath,
          archivePath,
          durationMs: Date.now() - start,
          errorMessage: `Archive write failed: ${saveResult.errorMessage}`,
        };
      }

      // Step 3 — Delete from source
      const deleteResult = await this.storageService.delete(sourceLocation);

      if (!deleteResult.success) {
        return {
          success: false,
          sourcePath,
          archivePath,
          durationMs: Date.now() - start,
          errorMessage: `Archive cleanup failed (file copied but not deleted): ${deleteResult.errorMessage}`,
        };
      }

      // Step 4 — Update HashMap index
      this.indexEvict(sourceTier, domain, filename);
      if (saveResult.metadata) {
        this.indexPut(
          STORAGE_CONSTANTS.TIERS.ARCHIVE as StorageTier,
          domain,
          filename,
          saveResult.metadata,
        );
      }

      this.logger.log(
        `FILE ARCHIVED | ${sourcePath} → ${archivePath} | ${Date.now() - start}ms`,
      );

      return {
        success: true,
        sourcePath,
        archivePath,
        durationMs: Date.now() - start,
      };
    } catch (error: any) {
      this.logger.error(
        `ARCHIVE FAILED | ${sourcePath} → ${archivePath} | ${error?.message}`,
      );
      return {
        success: false,
        sourcePath,
        archivePath,
        durationMs: Date.now() - start,
        errorMessage: `Archive failed: ${error?.message}`,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // writeRaw() — Store a CollectionResult (Phase 8.7 stub activated)
  // ---------------------------------------------------------------------------

  /**
   * Persist a raw CollectionResult to storage/raw/<domain>/.
   *
   * Serializes the CollectionResult to JSON and delegates to save().
   * This activates the Phase 8.7 stub.
   */
  async writeRaw(
    domain: StorageDomain,
    result: CollectionResult,
  ): Promise<StorageResult> {
    const filename = this.generateFilenameFromCollection(domain, result);
    const content = JSON.stringify(result, null, 2);

    const storageResult = await this.save(
      STORAGE_CONSTANTS.TIERS.RAW as StorageTier,
      domain,
      content,
      {
        format: 'json',
        source: result.provider,
        filename,
        tags: {
          provider: result.provider,
          operation: result.operation,
          status: result.status,
          collectedAt: result.collectedAt.toISOString(),
        },
      },
    );

    return storageResult;
  }

  // ---------------------------------------------------------------------------
  // readRaw() — Retrieve a raw file (Phase 8.7 stub activated)
  // ---------------------------------------------------------------------------

  /**
   * Read a raw file from storage/raw/<domain>/.
   *
   * Activates the Phase 8.7 stub.
   */
  async readRaw(
    domain: StorageDomain,
    filename: string,
  ): Promise<StorageResult> {
    const location: StorageLocation = {
      tier: STORAGE_CONSTANTS.TIERS.RAW as StorageTier,
      domain,
      filename,
    };

    const result = await this.storageService.read(location, {
      encoding: 'utf8',
    });

    if (result.success) {
      this.logger.log(
        `FILE READ | tier=raw domain=${domain} file=${filename}`,
      );
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  // archiveRaw() — Move a raw file to archive/ (Phase 8.7 stub activated)
  // ---------------------------------------------------------------------------

  /**
   * Move a raw file into storage/archive/<domain>/.
   *
   * Activates the Phase 8.7 stub.
   */
  async archiveRaw(
    domain: StorageDomain,
    filename: string,
  ): Promise<StorageResult> {
    const archiveResult = await this.archive(
      STORAGE_CONSTANTS.TIERS.RAW as StorageTier,
      domain,
      filename,
    );

    return {
      success: archiveResult.success,
      errorMessage: archiveResult.errorMessage,
      durationMs: archiveResult.durationMs,
    };
  }

  // ---------------------------------------------------------------------------
  // listRaw() — Convenience wrapper
  // ---------------------------------------------------------------------------

  /**
   * List raw files for a given domain.
   */
  async listRaw(domain: StorageDomain): Promise<string[]> {
    const entries = await this.list(
      STORAGE_CONSTANTS.TIERS.RAW as StorageTier,
      domain,
    );
    return entries.map((e) => e.filename);
  }

  // ---------------------------------------------------------------------------
  // HashMap index helpers
  // ---------------------------------------------------------------------------

  /**
   * Compose the HashMap key: "tier/domain/filename"
   */
  private indexKey(
    tier: string,
    domain: string,
    filename: string,
  ): string {
    return `${tier}/${domain}/${filename}`;
  }

  private indexPut(
    tier: string,
    domain: string,
    filename: string,
    metadata: StorageMetadata,
  ): void {
    this.metadataIndex.set(this.indexKey(tier, domain, filename), metadata);
  }

  private indexGet(
    tier: string,
    domain: string,
    filename: string,
  ): StorageMetadata | undefined {
    return this.metadataIndex.get(this.indexKey(tier, domain, filename));
  }

  private indexEvict(
    tier: string,
    domain: string,
    filename: string,
  ): void {
    this.metadataIndex.delete(this.indexKey(tier, domain, filename));
  }

  // ---------------------------------------------------------------------------
  // Filename generation helpers
  // ---------------------------------------------------------------------------

  /**
   * Generate a timestamp-based, collision-free filename.
   *
   * Format: <domain>_<YYYYMMDDTHHMMSS>.<ext>
   * Example: weather_20260626T215320.json
   *
   * UTC time is used to ensure cross-timezone consistency.
   */
  private generateFilename(domain: string, format: DataLakeFormat): string {
    const ts = new Date()
      .toISOString()                // "2026-06-26T21:53:20.000Z"
      .replace(/[-:]/g, '')         // "20260626T215320.000Z"
      .replace(/\.\d{3}Z$/, '');    // "20260626T215320"
    return `${domain}_${ts}${FORMAT_EXT[format]}`;
  }

  /**
   * Generate a filename from a CollectionResult.
   *
   * Format: <domain>_<provider>_<operation>_<timestamp>.json
   * Example: weather_openweather_current_1750000000000.json
   */
  private generateFilenameFromCollection(
    domain: StorageDomain,
    result: CollectionResult,
  ): string {
    const ts = result.collectedAt.getTime();
    const sanitize = (s: string) =>
      s.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
    return `${sanitize(domain)}_${sanitize(result.provider)}_${sanitize(result.operation)}_${ts}.json`;
  }

  /**
   * Derive DataLakeFormat from a file extension string.
   */
  private extToFormat(ext: string): DataLakeFormat {
    const map: Record<string, DataLakeFormat> = {
      json: 'json',
      csv: 'csv',
      xml: 'xml',
    };
    return map[ext.toLowerCase()] ?? 'json';
  }
}
