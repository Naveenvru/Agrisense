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
    /** Phase 11 — daily harvest readiness assessment for all active crops */
    HARVEST_ASSESS: 'harvest_assess',
    /** Phase 12 — daily yield intelligence recalculation for all active crops */
    YIELD_ASSESS: 'yield_assess',
    /** Phase 13 — daily supply intelligence recalculation for all active crops */
    SUPPLY_ASSESS: 'supply_assess',
    /** Phase 14 — daily demand intelligence recalculation for all active crops */
    DEMAND_ASSESS: 'demand_assess',
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
    /** Once per day at 6 AM */
    DAILY_6AM: '0 6 * * *',
    /** Once per day at 7 AM */
    DAILY_7AM: '0 7 * * *',
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

  /** Job-specific timeout configurations (ms) */
  TIMEOUTS: {
    HARVEST_ASSESS: 5 * 60 * 1000, // 5 minutes
    YIELD_ASSESS: 5 * 60 * 1000, // 5 minutes
    SUPPLY_ASSESS: 5 * 60 * 1000, // 5 minutes
    DEMAND_ASSESS: 5 * 60 * 1000, // 5 minutes
  },
} as const;

export type SchedulerJobName =
  (typeof SCHEDULER_CONSTANTS.JOBS)[keyof typeof SCHEDULER_CONSTANTS.JOBS];
