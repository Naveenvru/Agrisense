import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from '../common/storage.service';
import { StorageLocation, StorageResult } from '../common/storage.types';
import { STORAGE_CONSTANTS, StorageDomain } from '../common/storage.constants';
import { CollectionResult } from '../../collectors/common/collector.types';

/**
 * DataLakeService
 *
 * The entry point for writing raw collected data to the Data Lake.
 * Collectors call DataLakeService.writeRaw() — they never call StorageService directly.
 *
 * Responsibilities (Phase 8.8 will implement these fully)
 * ────────────────────────────────────────────────────────
 * ✔ writeRaw()      — store raw CollectionResult in storage/raw/<domain>/
 * ✔ readRaw()       — retrieve a raw file by filename and domain
 * ✔ archiveRaw()    — move files from raw/ to archive/
 * ✔ generatePath()  — deterministic, collision-free file paths
 *
 * Current phase (8.7): method stubs + path generation only.
 * Phase 8.8: Full file I/O via StorageService.
 */
@Injectable()
export class DataLakeService {
  private readonly logger = new Logger(DataLakeService.name);

  constructor(private readonly storageService: StorageService) {}

  /**
   * Persist a raw CollectionResult to the Data Lake.
   *
   * Phase 8.7: stub — logs intent, no file written.
   * Phase 8.8: serialize to JSON and call storageService.save().
   */
  async writeRaw(domain: StorageDomain, result: CollectionResult): Promise<StorageResult> {
    const filename = this.generateFilename(domain, result);
    const location: StorageLocation = {
      tier: STORAGE_CONSTANTS.TIERS.RAW,
      domain,
      filename,
    };

    this.logger.log(
      `DataLakeService.writeRaw (stub) | domain=${domain} file=${filename}`,
    );

    // Phase 8.8:
    // const content = JSON.stringify(result, null, 2);
    // return this.storageService.save(location, content, { mimeType: 'application/json' });

    return {
      success: false,
      location,
      errorMessage: 'DataLakeService.writeRaw() — not yet implemented (Phase 8.8).',
      durationMs: 0,
    };
  }

  /**
   * Read a raw file from the Data Lake.
   *
   * Phase 8.7: stub.
   * Phase 8.8: calls storageService.read().
   */
  async readRaw(domain: StorageDomain, filename: string): Promise<StorageResult> {
    const location: StorageLocation = {
      tier: STORAGE_CONSTANTS.TIERS.RAW,
      domain,
      filename,
    };

    this.logger.log(`DataLakeService.readRaw (stub) | domain=${domain} file=${filename}`);

    // Phase 8.8: return this.storageService.read(location);
    return {
      success: false,
      location,
      errorMessage: 'DataLakeService.readRaw() — not yet implemented (Phase 8.8).',
      durationMs: 0,
    };
  }

  /**
   * Move a raw file into the archive tier.
   *
   * Phase 8.7: stub.
   * Phase 8.8: read → save to archive/ → delete from raw/.
   */
  async archiveRaw(domain: StorageDomain, filename: string): Promise<StorageResult> {
    this.logger.log(`DataLakeService.archiveRaw (stub) | domain=${domain} file=${filename}`);

    return {
      success: false,
      errorMessage: 'DataLakeService.archiveRaw() — not yet implemented (Phase 8.8).',
      durationMs: 0,
    };
  }

  /**
   * List raw files for a given domain.
   * Phase 8.7: returns filesystem listing via StorageService.
   */
  async listRaw(domain: StorageDomain): Promise<string[]> {
    return this.storageService.list(STORAGE_CONSTANTS.TIERS.RAW, domain);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Generate a deterministic, collision-free filename for a CollectionResult.
   * Format: <domain>_<provider>_<operation>_<timestamp>.json
   */
  private generateFilename(domain: StorageDomain, result: CollectionResult): string {
    const ts = result.collectedAt.getTime();
    const sanitize = (s: string) => s.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
    return `${sanitize(domain)}_${sanitize(result.provider)}_${sanitize(result.operation)}_${ts}.json`;
  }
}
