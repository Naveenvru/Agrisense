/**
 * Integration Layer Types
 *
 * Shared TypeScript types used across the entire integration framework.
 * Business modules must use these types when interacting with providers.
 */

/** Standard HTTP methods supported by BaseHttpClient */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** Configuration for a single HTTP request */
export interface HttpRequestConfig {
  /** Full URL to call */
  url: string;
  /** HTTP method */
  method?: HttpMethod;
  /** Request headers (merged with defaults) */
  headers?: Record<string, string>;
  /** Query parameters appended to the URL */
  params?: Record<string, string | number | boolean>;
  /** Request body for POST / PUT / PATCH */
  body?: unknown;
  /** Per-request timeout override in milliseconds */
  timeoutMs?: number;
}

/** Standardised response returned by BaseHttpClient */
export interface HttpResponse<T = unknown> {
  /** Parsed response body */
  data: T;
  /** HTTP status code */
  status: number;
  /** Response headers */
  headers: Record<string, string>;
  /** Duration of the request in milliseconds */
  durationMs: number;
}

/** Retry configuration for RetryService */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in milliseconds — doubled with each attempt (default: 1000) */
  baseDelayMs?: number;
  /** HTTP status codes that trigger a retry */
  retryableStatusCodes?: number[];
}

/** Cache entry stored by CacheService */
export interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number; // Unix timestamp in ms
}

/** Cache operation options */
export interface CacheOptions {
  /** Time-to-live in milliseconds */
  ttlMs: number;
}

/** Result from a provider health check */
export interface ProviderHealthResult {
  provider: string;
  healthy: boolean;
  latencyMs?: number;
  message?: string;
  checkedAt: Date;
}

/** Generic API error returned by providers */
export interface IntegrationError {
  provider: string;
  statusCode?: number;
  message: string;
  retried: boolean;
  attempts: number;
}
