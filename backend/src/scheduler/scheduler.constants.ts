/**
 * Scheduler Constants
 *
 * Centralised cron expressions, job names, and timing configurations.
 * All scheduler jobs reference these — never hardcoded strings.
 */

export const SCHEDULER_CONSTANTS = {
  /** Named job identifiers */
  JOBS: {
    WEATHER_COLLECT: 'weather_collect',
    MARKET_COLLECT: 'market_collect',
    GOVERNMENT_COLLECT: 'government_collect',
    DATA_CLEANUP: 'data_cleanup',
    ARCHIVE_RAW: 'archive_raw',
    GENERATE_REPORTS: 'generate_reports',
  },

  /** Cron expressions — set here, referenced in job definitions */
  CRON: {
    /** Every 30 minutes */
    EVERY_30_MINUTES: '*/30 * * * *',
    /** Every hour */
    EVERY_HOUR: '0 * * * *',
    /** Every 6 hours */
    EVERY_6_HOURS: '0 */6 * * *',
    /** Once per day at midnight */
    DAILY_MIDNIGHT: '0 0 * * *',
    /** Once per week on Sunday at 2am */
    WEEKLY: '0 2 * * 0',
  },

  /** Default job priorities (lower = higher priority) */
  PRIORITY: {
    CRITICAL: 1,
    HIGH: 2,
    NORMAL: 3,
    LOW: 4,
    BACKGROUND: 5,
  },
} as const;

export type SchedulerJobName =
  (typeof SCHEDULER_CONSTANTS.JOBS)[keyof typeof SCHEDULER_CONSTANTS.JOBS];
