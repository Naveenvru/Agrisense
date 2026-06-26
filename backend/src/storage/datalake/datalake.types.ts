import { StorageMetadata } from '../common/storage.types';

/**
 * Data Lake Engine Types
 *
 * Phase 8.8 — type definitions used exclusively by DataLakeService.
 * Business modules and collectors consume these types via DataLakeService.
 */

// ---------------------------------------------------------------------------
// Supported File Formats
// ---------------------------------------------------------------------------

/**
 * File formats supported by the Data Lake Engine.
 * Determines MIME type and file extension during storage.
 */
export type DataLakeFormat = 'json' | 'csv' | 'xml';

// ---------------------------------------------------------------------------
// Save Options
// ---------------------------------------------------------------------------

/**
 * Options passed to DataLakeService.save().
 */
export interface DataLakeSaveOptions {
  /**
   * File format — determines extension and MIME type.
   * @default 'json'
   */
  format?: DataLakeFormat;

  /**
   * Source system that produced this dataset.
   * Examples: 'openweather', 'agmarknet', 'imd'
   */
  source?: string;

  /**
   * Arbitrary key-value tags for search and filtering.
   */
  tags?: Record<string, string>;

  /**
   * Override the auto-generated filename.
   * When omitted, a timestamp-based name is generated.
   */
  filename?: string;
}

// ---------------------------------------------------------------------------
// Read Result
// ---------------------------------------------------------------------------

/**
 * Result returned by DataLakeService.read() and DataLakeService.readRaw().
 * Pairs the raw file content with its metadata record.
 */
export interface DataLakeReadResult {
  /** Raw file content as a UTF-8 string */
  content: string;

  /** Metadata record for the stored file */
  metadata: StorageMetadata;

  /** Detected file format */
  format: DataLakeFormat;
}

// ---------------------------------------------------------------------------
// List Entry
// ---------------------------------------------------------------------------

/**
 * Lightweight entry returned by DataLakeService.list().
 */
export interface DataLakeListEntry {
  /** Stored filename including extension */
  filename: string;

  /** Metadata if available in the in-memory index */
  metadata?: StorageMetadata;
}

// ---------------------------------------------------------------------------
// Archive Result
// ---------------------------------------------------------------------------

/**
 * Result returned by DataLakeService.archive().
 */
export interface DataLakeArchiveResult {
  /** Whether the archive operation succeeded */
  success: boolean;

  /** Original location (raw tier) */
  sourcePath: string;

  /** Destination path (archive tier) */
  archivePath: string;

  /** Duration of the full archive operation in milliseconds */
  durationMs: number;

  /** Error message if the operation failed */
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// Format Helpers
// ---------------------------------------------------------------------------

/** Map DataLakeFormat → MIME type */
export const FORMAT_MIME: Record<DataLakeFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
  xml: 'application/xml',
};

/** Map DataLakeFormat → file extension */
export const FORMAT_EXT: Record<DataLakeFormat, string> = {
  json: '.json',
  csv: '.csv',
  xml: '.xml',
};
