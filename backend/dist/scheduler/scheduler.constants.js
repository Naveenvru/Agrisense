"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEDULER_CONSTANTS = void 0;
exports.SCHEDULER_CONSTANTS = {
    JOBS: {
        WEATHER_COLLECT: 'weather_collect',
        MARKET_COLLECT: 'market_collect',
        GOVERNMENT_COLLECT: 'government_collect',
        DATA_CLEANUP: 'data_cleanup',
        ARCHIVE_RAW: 'archive_raw',
        GENERATE_REPORTS: 'generate_reports',
    },
    CRON: {
        EVERY_30_MINUTES: '*/30 * * * *',
        EVERY_HOUR: '0 * * * *',
        EVERY_6_HOURS: '0 */6 * * *',
        DAILY_MIDNIGHT: '0 0 * * *',
        WEEKLY: '0 2 * * 0',
    },
    PRIORITY: {
        CRITICAL: 1,
        HIGH: 2,
        NORMAL: 3,
        LOW: 4,
        BACKGROUND: 5,
    },
};
//# sourceMappingURL=scheduler.constants.js.map