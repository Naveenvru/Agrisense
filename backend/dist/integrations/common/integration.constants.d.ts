export declare const INTEGRATION_CONSTANTS: {
    readonly DEFAULT_TIMEOUT_MS: 10000;
    readonly DEFAULT_MAX_RETRIES: 3;
    readonly DEFAULT_RETRY_DELAY_MS: 1000;
    readonly DEFAULT_CACHE_TTL_MS: number;
    readonly RETRYABLE_STATUS_CODES: readonly [429, 500, 502, 503, 504];
    readonly PROVIDERS: {
        readonly OPENWEATHER: "openweather";
        readonly AGMARKNET: "agmarknet";
        readonly MANDI_API: "mandi_api";
        readonly ENAM: "enam";
        readonly IMD: "imd";
        readonly ICAR: "icar";
        readonly SOIL_API: "soil_api";
        readonly FIREBASE: "firebase";
    };
};
export type ProviderName = (typeof INTEGRATION_CONSTANTS.PROVIDERS)[keyof typeof INTEGRATION_CONSTANTS.PROVIDERS];
