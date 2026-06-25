import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageProvider } from '../common/storage-provider.interface';
import {
  StorageLocation,
  StorageResult,
  StorageHealthResult,
  SaveOptions,
  ReadOptions,
  ListOptions,
} from '../common/storage.types';
import {
  STORAGE_CONSTANTS,
  STORAGE_ROOT,
} from '../common/storage.constants';

/**
 * LocalStorageProvider
 *
 * Stores files on the local filesystem under `storage/`.
 * Implements IStorageProvider so it is fully swappable for IPFS or cloud.
 *
 * Phase 8.7: Folder creation + health check only.
 * Phase 8.8: Full save() / read() / delete() implementation.
 *
 * Directory layout
 * ─────────────────
 * storage/
 *   raw/weather/       ← WeatherCollector.store() → DataLakeService → here
 *   raw/market/
 *   raw/government/
 *   processed/
 *   archive/
 *   reports/
 */
@Injectable()
export class LocalStorageProvider implements IStorageProvider, OnModuleInit {
  readonly providerName = STORAGE_CONSTANTS.PROVIDERS.LOCAL;
  private readonly logger = new Logger(LocalStorageProvider.name);

  /**
   * Ensure all required storage directories exist on startup.
   */
  onModuleInit(): void {
    this.ensureDirectories();
  }

  // ---------------------------------------------------------------------------
  // IStorageProvider — Phase 8.8 will complete these implementations
  // ---------------------------------------------------------------------------

  async save(
    location: StorageLocation,
    _content: string | Buffer,
    _options?: SaveOptions,
  ): Promise<StorageResult> {
    const filePath = this.resolvePath(location);
    this.logger.debug(`SAVE (stub) → ${filePath}`);

    // Phase 8.8: fs.writeFile / fs.writeFileSync implementation
    return {
      success: false,
      location,
      errorMessage: 'LocalStorageProvider.save() — not yet implemented (Phase 8.8).',
      durationMs: 0,
    };
  }

  async read(
    location: StorageLocation,
    _options?: ReadOptions,
  ): Promise<StorageResult<string | Buffer>> {
    const filePath = this.resolvePath(location);
    this.logger.debug(`READ (stub) → ${filePath}`);

    // Phase 8.8: fs.readFile implementation
    return {
      success: false,
      location,
      errorMessage: 'LocalStorageProvider.read() — not yet implemented (Phase 8.8).',
      durationMs: 0,
    };
  }

  async delete(location: StorageLocation): Promise<StorageResult> {
    const filePath = this.resolvePath(location);
    this.logger.debug(`DELETE (stub) → ${filePath}`);

    // Phase 8.8: fs.unlink implementation
    return {
      success: false,
      location,
      errorMessage: 'LocalStorageProvider.delete() — not yet implemented (Phase 8.8).',
      durationMs: 0,
    };
  }

  async exists(location: StorageLocation): Promise<boolean> {
    const filePath = this.resolvePath(location);
    return fs.existsSync(filePath);
  }

  async list(
    tier: string,
    domain: string,
    options?: ListOptions,
  ): Promise<string[]> {
    const dirPath = path.join(STORAGE_ROOT, tier, domain);

    if (!fs.existsSync(dirPath)) {
      return [];
    }

    let files = fs.readdirSync(dirPath);

    if (options?.extension) {
      files = files.filter((f) => f.endsWith(options.extension!));
    }

    if (options?.limit) {
      files = files.slice(0, options.limit);
    }

    return files;
  }

  async health(): Promise<StorageHealthResult> {
    const start = Date.now();

    try {
      const testPath = path.join(STORAGE_ROOT, 'raw', 'weather');
      const exists = fs.existsSync(testPath);
      const writable = this.isWritable(STORAGE_ROOT);

      return {
        provider: this.providerName,
        healthy: exists && writable,
        writable,
        freeSpaceBytes: -1, // Phase 8.8: use fs.statfs or disk-usage package
        latencyMs: Date.now() - start,
        message: exists && writable ? 'Local storage is healthy.' : 'Storage directory not writable.',
        checkedAt: new Date(),
      };
    } catch (error: any) {
      return {
        provider: this.providerName,
        healthy: false,
        writable: false,
        freeSpaceBytes: -1,
        latencyMs: Date.now() - start,
        message: `Health check failed: ${error?.message}`,
        checkedAt: new Date(),
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private resolvePath(location: StorageLocation): string {
    const parts = [STORAGE_ROOT, location.tier, location.domain];
    if (location.subPath) parts.push(location.subPath);
    parts.push(location.filename);
    return path.join(...parts);
  }

  private ensureDirectories(): void {
    const dirs: string[] = [];

    // All tier × domain combinations
    for (const tier of Object.values(STORAGE_CONSTANTS.TIERS)) {
      if (tier === 'raw') {
        for (const domain of Object.values(STORAGE_CONSTANTS.DOMAINS)) {
          dirs.push(path.join(STORAGE_ROOT, tier, domain));
        }
      } else {
        dirs.push(path.join(STORAGE_ROOT, tier));
      }
    }

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created storage directory: ${dir}`);
      }
    }

    this.logger.log(`LocalStorageProvider initialised | root=${STORAGE_ROOT}`);
  }

  private isWritable(dirPath: string): boolean {
    try {
      fs.accessSync(dirPath, fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }
}
