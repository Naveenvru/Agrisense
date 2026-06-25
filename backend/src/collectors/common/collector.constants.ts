/**
 * Collector Constants
 *
 * Central registry of collector-layer constants.
 * Keeps collector configuration decoupled from business config.
 */

export const COLLECTOR_CONSTANTS = {
  /** Collector domain identifiers — used in logs and status reports */
  DOMAINS: {
    WEATHER: 'weather',
    MARKET: 'market',
    GOVERNMENT: 'government',
    SOIL: 'soil',
    SENSOR: 'sensor',
  },

  /** Collection operation types */
  OPERATIONS: {
    CURRENT_WEATHER: 'current_weather',
    WEATHER_FORECAST: 'weather_forecast',
    MARKET_PRICES: 'market_prices',
    SOIL_DATA: 'soil_data',
    GOVERNMENT_ADVISORY: 'government_advisory',
  },

  /** Collection result statuses */
  STATUS: {
    SUCCESS: 'success',
    FAILED: 'failed',
    PARTIAL: 'partial',
    SKIPPED: 'skipped',
  },
} as const;

export type CollectorDomain =
  (typeof COLLECTOR_CONSTANTS.DOMAINS)[keyof typeof COLLECTOR_CONSTANTS.DOMAINS];

export type CollectorOperation =
  (typeof COLLECTOR_CONSTANTS.OPERATIONS)[keyof typeof COLLECTOR_CONSTANTS.OPERATIONS];

export type CollectionStatus =
  (typeof COLLECTOR_CONSTANTS.STATUS)[keyof typeof COLLECTOR_CONSTANTS.STATUS];
