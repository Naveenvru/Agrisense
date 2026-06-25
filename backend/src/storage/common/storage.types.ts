import { StorageProviderName, StorageTier, StorageDomain } from './storage.constants';

/**
 * Storage Layer Types
 *
 * All shared TypeScript types for the storage infrastructure.
 * Business modules and providers consume these types exclusively.
 */

// ---------------------------------------------------------------------------
// Storage Location
// ---------------------------------------------------------------------------

/**
 * Logical address of a stored file.
 * Providers resolve this to a concrete path/URL internally.
 */
export interface StorageLocation {
  /** Storage tier (raw / processed / archive / reports) */
  tier: StorageTier;
  /** Data domain (weather / market / government) */
  domain: StorageDomain;
  /** Filename including extension */
  filename: string;
  /** Optional sub-path within the domain folder */
  subPath?: string;
}

// ---------------------------------------------------------------------------
// Storage Metadata
// ---------------------------------------------------------------------------

/**
 * Descriptive metadata attached to every stored file.
 * Phase 8.8 will persist this to a MongoDB metadata catalog.
 */
export interface StorageMetadata {
  /** Unique identifier for this storage record */
  id: string;
  /** System-generated filename (e.g. weather_12.9_77.5_1719302400000.json) */
  filename: string;
  /** Original filename supplied by the caller */
  originalFilename: string;
  /** Storage provider that holds the file */
  provider: StorageProviderName;
  /** Resolved absolute path or URL */
  path: string;
  /** File extension (.json, .csv, .xml) */
  extension: string;
  /** MIME type of the file content */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** SHA-256 checksum — placeholder, computed in Phase 8.8 */
  checksum: string;
  /** UTC timestamp of creation */
  createdAt: Date;
  /** UTC timestamp of last update */
  updatedAt: Date;
  /** Source system or provider (e.g. 'openweather', 'agmarknet') */
  source: string;
  /** Lifecycle status (active / archived / deleted) */
  status: StorageFileStatus;
  /** Schema/format version for future migration support */
  version: number;
  /** Storage tier this file lives in */
  tier: StorageTier;
  /** Data domain */
  domain: StorageDomain;
  /** Arbitrary key-value tags for search/filter */
  tags?: Record<string, string>;
}

export type StorageFileStatus = 'active' | 'archived' | 'deleted' | 'processing';

// ---------------------------------------------------------------------------
// Storage Result
// ---------------------------------------------------------------------------

/**
 * Result returned by storage operations (save, read, delete).
 */
export interface StorageResult<T = unknown> {
  success: boolean;
  location?: StorageLocation;
  metadata?: StorageMetadata;
  /** Resolved data on read operations */
  data?: T;
  errorMessage?: string;
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Storage Provider Info
// ---------------------------------------------------------------------------

/** Descriptor registered in StorageRegistry per provider */
export interface StorageProviderInfo {
  name: StorageProviderName;
  description: string;
  rootPath?: string;
  endpoint?: string;
  isDefault: boolean;
  supportsStreaming: boolean;
  supportsVersioning: boolean;
}

// ---------------------------------------------------------------------------
// Storage Health
// ---------------------------------------------------------------------------

/** Health check result returned per storage provider */
export interface StorageHealthResult {
  provider: StorageProviderName | string;
  healthy: boolean;
  /** Whether the storage location is writable */
  writable: boolean;
  /** Free space in bytes — placeholder (-1 = not measured yet) */
  freeSpaceBytes: number;
  /** Latency of the health probe in milliseconds */
  latencyMs: number;
  message?: string;
  checkedAt: Date;
}

// ---------------------------------------------------------------------------
// Storage Operation Options
// ---------------------------------------------------------------------------

export interface SaveOptions {
  /** Overwrite if file already exists (default: false) */
  overwrite?: boolean;
  /** Tags to attach to the file metadata */
  tags?: Record<string, string>;
  /** MIME type override */
  mimeType?: string;
}

export interface ReadOptions {
  /** Encoding for text files (default: 'utf8') */
  encoding?: BufferEncoding;
}

export interface ListOptions {
  /** Filter by file extension */
  extension?: string;
  /** Maximum number of results */
  limit?: number;
  /** Sort order */
  sortBy?: 'name' | 'createdAt' | 'size';
  sortOrder?: 'asc' | 'desc';
}
