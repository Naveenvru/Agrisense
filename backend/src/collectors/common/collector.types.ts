import { CollectorDomain, CollectorOperation, CollectionStatus } from './collector.constants';

/**
 * Collector Layer Types
 *
 * Shared TypeScript types for the entire collector framework.
 * Collectors produce CollectionResult; business modules consume it.
 */

/** Parameters passed into a collector's collect() method */
export interface CollectionParams {
  /** Which domain this collection targets (weather / market / government) */
  domain: CollectorDomain;
  /** Specific operation within the domain */
  operation: CollectorOperation;
  /** Any domain-specific input parameters */
  payload: Record<string, unknown>;
  /** UTC timestamp when the collection was requested */
  requestedAt: Date;
}

/**
 * Structured result returned by every collector.
 * Contains the raw provider response plus telemetry metadata.
 */
export interface CollectionResult<T = unknown> {
  /** Which domain produced this result */
  domain: CollectorDomain;
  /** Which operation was performed */
  operation: CollectorOperation;
  /** Name of the external provider that was called */
  provider: string;
  /** Raw data returned by the provider — NOT normalized */
  rawData: T;
  /** Collection outcome */
  status: CollectionStatus;
  /** UTC timestamp when collection started */
  collectedAt: Date;
  /** Duration of the full collection in milliseconds */
  durationMs: number;
  /** Number of retry attempts made (0 = first attempt succeeded) */
  retryCount: number;
  /** Error message if status is 'failed' */
  errorMessage?: string;
}

/** Structured status snapshot returned by collector.status() */
export interface CollectorStatus {
  /** Collector domain name */
  domain: CollectorDomain;
  /** Whether the collector is operational */
  operational: boolean;
  /** UTC timestamp of the last successful collection */
  lastSuccessAt?: Date;
  /** UTC timestamp of the last failed collection */
  lastFailureAt?: Date;
  /** Total collections performed since startup */
  totalCollections: number;
  /** Total successful collections */
  successCount: number;
  /** Total failed collections */
  failureCount: number;
}

/** Collector telemetry emitted per collection for logging */
export interface CollectionTelemetry {
  provider: string;
  operation: string;
  requestedAt: Date;
  respondedAt: Date;
  durationMs: number;
  status: CollectionStatus;
  retryCount: number;
  errorMessage?: string;
}
