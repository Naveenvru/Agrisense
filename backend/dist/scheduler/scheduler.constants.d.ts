export declare const SCHEDULER_CONSTANTS: {
    readonly JOBS: {
        readonly WEATHER_COLLECT: "weather_collect";
        readonly MARKET_COLLECT: "market_collect";
        readonly GOVERNMENT_COLLECT: "government_collect";
        readonly DATA_CLEANUP: "data_cleanup";
        readonly ARCHIVE_RAW: "archive_raw";
        readonly GENERATE_REPORTS: "generate_reports";
    };
    readonly CRON: {
        readonly EVERY_30_MINUTES: "*/30 * * * *";
        readonly EVERY_HOUR: "0 * * * *";
        readonly EVERY_6_HOURS: "0 */6 * * *";
        readonly DAILY_MIDNIGHT: "0 0 * * *";
        readonly WEEKLY: "0 2 * * 0";
    };
    readonly PRIORITY: {
        readonly CRITICAL: 1;
        readonly HIGH: 2;
        readonly NORMAL: 3;
        readonly LOW: 4;
        readonly BACKGROUND: 5;
    };
};
export type SchedulerJobName = (typeof SCHEDULER_CONSTANTS.JOBS)[keyof typeof SCHEDULER_CONSTANTS.JOBS];
