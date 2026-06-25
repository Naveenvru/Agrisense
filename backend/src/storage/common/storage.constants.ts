/**
 * Storage Layer Constants
 *
 * Centralised registry of all storage-layer configuration values.
 * Business modules and providers reference these — never hardcoded strings.
 */

import * as path from 'path';

/** Absolute path to the project root storage directory */
export const STORAGE_ROOT = path.resolve(process.cwd(), 'storage');

export const STORAGE_CONSTANTS = {
  // ---------------------------------------------------------------------------
  // Provider names
  // ---------------------------------------------------------------------------
  PROVIDERS: {
    LOCAL: 'local',
    IPFS: 'ipfs',
    AWS_S3: 'aws_s3',
    AZURE_BLOB: 'azure_blob',
    GOOGLE_GCS: 'google_gcs',
  },

  // ---------------------------------------------------------------------------
  // Storage tiers / folder names
  // ---------------------------------------------------------------------------
  TIERS: {
    RAW: 'raw',
    PROCESSED: 'processed',
    ARCHIVE: 'archive',
    REPORTS: 'reports',
  },

  // ---------------------------------------------------------------------------
  // Domain sub-folders inside each tier
  // ---------------------------------------------------------------------------
  DOMAINS: {
    WEATHER: 'weather',
    MARKET: 'market',
    GOVERNMENT: 'government',
    SOIL: 'soil',
    SENSOR: 'sensor',
  },

  // ---------------------------------------------------------------------------
  // File constraints (placeholders — enforced in Phase 8.8)
  // ---------------------------------------------------------------------------
  LIMITS: {
    /** Maximum file size: 50 MB */
    MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,
    /** Maximum files per directory before archiving is triggered */
    MAX_FILES_PER_DIR: 10_000,
  },

  // ---------------------------------------------------------------------------
  // Retention policies (Phase 8.8)
  // ---------------------------------------------------------------------------
  RETENTION: {
    /** Raw files older than 90 days are archived */
    RAW_DAYS: 90,
    /** Processed files older than 180 days are archived */
    PROCESSED_DAYS: 180,
    /** Archive files older than 365 days are deleted */
    ARCHIVE_DAYS: 365,
  },

  // ---------------------------------------------------------------------------
  // Supported file extensions
  // ---------------------------------------------------------------------------
  EXTENSIONS: {
    JSON: '.json',
    CSV: '.csv',
    XML: '.xml',
    PARQUET: '.parquet',
  },
} as const;

export type StorageProviderName =
  (typeof STORAGE_CONSTANTS.PROVIDERS)[keyof typeof STORAGE_CONSTANTS.PROVIDERS];

export type StorageTier =
  (typeof STORAGE_CONSTANTS.TIERS)[keyof typeof STORAGE_CONSTANTS.TIERS];

export type StorageDomain =
  (typeof STORAGE_CONSTANTS.DOMAINS)[keyof typeof STORAGE_CONSTANTS.DOMAINS];
