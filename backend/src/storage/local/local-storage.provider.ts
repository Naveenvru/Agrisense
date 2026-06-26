import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { IStorageProvider } from '../common/storage-provider.interface';
import {
  StorageLocation,
  StorageResult,
  StorageMetadata,
  StorageHealthResult,
  SaveOptions,
  ReadOptions,
  ListOptions,
} from '../common/storage.types';
import {
  STORAGE_CONSTANTS,
  STORAGE_ROOT,
  StorageProviderName,
} from '../common/storage.constants';

/**
 * LocalStorageProvider
 *
 * Stores files on the local filesystem under `storage/`.
 * Implements IStorageProvider so it is fully swappable for IPFS or cloud.
 *
 * Phase 8.8: Full save() / read() / delete() implementation with
 *   ✔ SHA-256 checksum generation
 *   ✔ StorageMetadata construction
 *   ✔ File size limit enforcement
 *   ✔ Overwrite guard
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
  readonly providerName: StorageProviderName = STORAGE_CONSTANTS.PROVIDERS.LOCAL;
  private readonly logger = new Logger(LocalStorageProvider.name);

  /**
   * Ensure all required storage directories exist on startup.
   */
  onModuleInit(): void {
    this.ensureDirectories();
  }

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  async save(
    location: StorageLocation,
    content: string | Buffer,
    options?: SaveOptions,
  ): Promise<StorageResult> {
    const start = Date.now();
    const filePath = this.resolvePath(location);

    try {
      // Enforce file size limit
      const byteLength = Buffer.isBuffer(content)
        ? content.length
        : Buffer.byteLength(content, 'utf8');

      if (byteLength > STORAGE_CONSTANTS.LIMITS.MAX_FILE_SIZE_BYTES) {
        return {
          success: false,
          location,
          errorMessage: `File exceeds maximum size of ${STORAGE_CONSTANTS.LIMITS.MAX_FILE_SIZE_BYTES} bytes (got ${byteLength} bytes).`,
          durationMs: Date.now() - start,
        };
      }

      // Overwrite guard
      if (!options?.overwrite && fs.existsSync(filePath)) {
        return {
          success: false,
          location,
          errorMessage: `File already exists at ${filePath}. Pass overwrite=true to replace it.`,
          durationMs: Date.now() - start,
        };
      }

      // Ensure target directory exists
      await fsp.mkdir(path.dirname(filePath), { recursive: true });

      // Write file
      await fsp.writeFile(filePath, content, 'utf8');

      // Compute SHA-256 checksum
      const contentBuffer = Buffer.isBuffer(content)
        ? content
        : Buffer.from(content, 'utf8');
      const checksum = crypto
        .createHash('sha256')
        .update(contentBuffer)
        .digest('hex');

      // Stat for actual size on disk
      const stat = await fsp.stat(filePath);
      const ext = path.extname(location.filename);
      const now = new Date();

      const metadata: StorageMetadata = {
        id: `${location.tier}-${location.domain}-${location.filename}-${Date.now()}`,
        filename: location.filename,
        originalFilename: location.filename,
        provider: this.providerName,
        path: filePath,
        extension: ext,
        mimeType: options?.mimeType ?? this.resolveMimeType(ext),
        size: stat.size,
        checksum,
        createdAt: now,
        updatedAt: now,
        source: options?.tags?.source ?? 'unknown',
        status: 'active',
        version: 1,
        tier: location.tier as any,
        domain: location.domain as any,
        tags: options?.tags,
      };

      this.logger.log(
        `FILE STORED | provider=local tier=${location.tier} domain=${location.domain} file=${location.filename} size=${stat.size}B checksum=${checksum.substring(0, 12)}...`,
      );

      return {
        success: true,
        location,
        metadata,
        durationMs: Date.now() - start,
      };
    } catch (error: any) {
      this.logger.error(
        `SAVE FAILED | file=${location.filename} error=${error?.message}`,
      );
      return {
        success: false,
        location,
        errorMessage: `Save failed: ${error?.message}`,
        durationMs: Date.now() - start,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Read
  // ---------------------------------------------------------------------------

  async read(
    location: StorageLocation,
    options?: ReadOptions,
  ): Promise<StorageResult<string | Buffer>> {
    const start = Date.now();
    const filePath = this.resolvePath(location);

    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          location,
          errorMessage: `File not found: ${filePath}`,
          durationMs: Date.now() - start,
        };
      }

      const encoding = options?.encoding ?? 'utf8';
      const raw = await fsp.readFile(filePath, encoding);

      // Compute checksum on read content for integrity
      const contentBuffer = Buffer.isBuffer(raw)
        ? raw
        : Buffer.from(raw, 'utf8');
      const checksum = crypto
        .createHash('sha256')
        .update(contentBuffer)
        .digest('hex');

      const stat = await fsp.stat(filePath);
      const ext = path.extname(location.filename);
      const now = new Date();

      const metadata: StorageMetadata = {
        id: `${location.tier}-${location.domain}-${location.filename}`,
        filename: location.filename,
        originalFilename: location.filename,
        provider: this.providerName,
        path: filePath,
        extension: ext,
        mimeType: this.resolveMimeType(ext),
        size: stat.size,
        checksum,
        createdAt: stat.birthtime,
        updatedAt: stat.mtime,
        source: 'unknown',
        status: 'active',
        version: 1,
        tier: location.tier as any,
        domain: location.domain as any,
      };

      this.logger.log(
        `FILE READ | provider=local tier=${location.tier} domain=${location.domain} file=${location.filename} size=${stat.size}B`,
      );

      return {
        success: true,
        location,
        metadata,
        data: raw,
        durationMs: Date.now() - start,
      };
    } catch (error: any) {
      this.logger.error(
        `READ FAILED | file=${location.filename} error=${error?.message}`,
      );
      return {
        success: false,
        location,
        errorMessage: `Read failed: ${error?.message}`,
        durationMs: Date.now() - start,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  async delete(location: StorageLocation): Promise<StorageResult> {
    const start = Date.now();
    const filePath = this.resolvePath(location);

    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          location,
          errorMessage: `File not found for deletion: ${filePath}`,
          durationMs: Date.now() - start,
        };
      }

      await fsp.unlink(filePath);

      this.logger.log(
        `FILE DELETED | provider=local tier=${location.tier} domain=${location.domain} file=${location.filename}`,
      );

      return {
        success: true,
        location,
        durationMs: Date.now() - start,
      };
    } catch (error: any) {
      this.logger.error(
        `DELETE FAILED | file=${location.filename} error=${error?.message}`,
      );
      return {
        success: false,
        location,
        errorMessage: `Delete failed: ${error?.message}`,
        durationMs: Date.now() - start,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Exists
  // ---------------------------------------------------------------------------

  async exists(location: StorageLocation): Promise<boolean> {
    const filePath = this.resolvePath(location);
    return fs.existsSync(filePath);
  }

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async list(
    tier: string,
    domain: string,
    options?: ListOptions,
  ): Promise<string[]> {
    const dirPath = path.join(STORAGE_ROOT, tier, domain);

    if (!fs.existsSync(dirPath)) {
      return [];
    }

    let files = fs.readdirSync(dirPath).filter((f) => {
      // Only return files, not subdirectories
      const fullPath = path.join(dirPath, f);
      return fs.statSync(fullPath).isFile();
    });

    if (options?.extension) {
      files = files.filter((f) => f.endsWith(options.extension!));
    }

    // Sorting
    if (options?.sortBy === 'createdAt' || options?.sortBy === 'size') {
      files = files.sort((a, b) => {
        const statA = fs.statSync(path.join(dirPath, a));
        const statB = fs.statSync(path.join(dirPath, b));
        const valA =
          options.sortBy === 'createdAt'
            ? statA.birthtimeMs
            : statA.size;
        const valB =
          options.sortBy === 'createdAt'
            ? statB.birthtimeMs
            : statB.size;
        return options.sortOrder === 'desc' ? valB - valA : valA - valB;
      });
    } else if (options?.sortBy === 'name') {
      files = files.sort((a, b) =>
        options.sortOrder === 'desc' ? b.localeCompare(a) : a.localeCompare(b),
      );
    }

    if (options?.limit) {
      files = files.slice(0, options.limit);
    }

    return files;
  }

  // ---------------------------------------------------------------------------
  // Health
  // ---------------------------------------------------------------------------

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
        freeSpaceBytes: -1, // disk-usage not needed for Phase 8.8
        latencyMs: Date.now() - start,
        message:
          exists && writable
            ? 'Local storage is healthy.'
            : 'Storage directory not writable.',
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

    for (const tier of Object.values(STORAGE_CONSTANTS.TIERS)) {
      if (tier === STORAGE_CONSTANTS.TIERS.RAW) {
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

  /**
   * Resolve MIME type from file extension.
   */
  private resolveMimeType(ext: string): string {
    const mimeMap: Record<string, string> = {
      '.json': 'application/json',
      '.csv': 'text/csv',
      '.xml': 'application/xml',
      '.txt': 'text/plain',
    };
    return mimeMap[ext] ?? 'application/octet-stream';
  }
}
