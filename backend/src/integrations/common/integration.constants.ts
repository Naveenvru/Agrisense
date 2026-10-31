/**
 * Integration Layer Constants
 *
 * Central registry of constants used across the integration framework.
 * All external providers reference these constants for consistency.
 */

export const INTEGRATION_CONSTANTS = {
  /** Default timeout for all HTTP calls in milliseconds */
  DEFAULT_TIMEOUT_MS: 10_000,

  /** Default maximum number of retry attempts */
  DEFAULT_MAX_RETRIES: 3,

  /** Base delay in milliseconds for exponential backoff */
  DEFAULT_RETRY_DELAY_MS: 1_000,

  /** Default in-memory cache TTL in milliseconds (30 minutes) */
  DEFAULT_CACHE_TTL_MS: 30 * 60 * 1_000,

  /** HTTP status codes that should trigger a retry */
  RETRYABLE_STATUS_CODES: [429, 500, 502, 503, 504],

  /** Provider source identifiers */
  PROVIDERS: {
    OPENWEATHER: 'openweather',
    AGMARKNET: 'agmarknet',
    MANDI_API: 'mandi_api',
    ENAM: 'enam',
    IMD: 'imd',
    ICAR: 'icar',
    SOIL_API: 'soil_api',
    FIREBASE: 'firebase',
  },
} as const;

export type ProviderName =
  (typeof INTEGRATION_CONSTANTS.PROVIDERS)[keyof typeof INTEGRATION_CONSTANTS.PROVIDERS];
