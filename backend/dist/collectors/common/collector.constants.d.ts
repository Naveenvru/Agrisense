export declare const COLLECTOR_CONSTANTS: {
    readonly DOMAINS: {
        readonly WEATHER: "weather";
        readonly MARKET: "market";
        readonly GOVERNMENT: "government";
        readonly SOIL: "soil";
        readonly SENSOR: "sensor";
    };
    readonly OPERATIONS: {
        readonly CURRENT_WEATHER: "current_weather";
        readonly WEATHER_FORECAST: "weather_forecast";
        readonly MARKET_PRICES: "market_prices";
        readonly SOIL_DATA: "soil_data";
        readonly GOVERNMENT_ADVISORY: "government_advisory";
    };
    readonly STATUS: {
        readonly SUCCESS: "success";
        readonly FAILED: "failed";
        readonly PARTIAL: "partial";
        readonly SKIPPED: "skipped";
    };
};
export type CollectorDomain = (typeof COLLECTOR_CONSTANTS.DOMAINS)[keyof typeof COLLECTOR_CONSTANTS.DOMAINS];
export type CollectorOperation = (typeof COLLECTOR_CONSTANTS.OPERATIONS)[keyof typeof COLLECTOR_CONSTANTS.OPERATIONS];
export type CollectionStatus = (typeof COLLECTOR_CONSTANTS.STATUS)[keyof typeof COLLECTOR_CONSTANTS.STATUS];
