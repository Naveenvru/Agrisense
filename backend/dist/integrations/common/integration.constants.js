"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTEGRATION_CONSTANTS = void 0;
exports.INTEGRATION_CONSTANTS = {
    DEFAULT_TIMEOUT_MS: 10_000,
    DEFAULT_MAX_RETRIES: 3,
    DEFAULT_RETRY_DELAY_MS: 1_000,
    DEFAULT_CACHE_TTL_MS: 30 * 60 * 1_000,
    RETRYABLE_STATUS_CODES: [429, 500, 502, 503, 504],
    PROVIDERS: {
        OPENWEATHER: 'openweather',
        AGMARKNET: 'agmarknet',
        ENAM: 'enam',
        IMD: 'imd',
        ICAR: 'icar',
        SOIL_API: 'soil_api',
        FIREBASE: 'firebase',
    },
};
//# sourceMappingURL=integration.constants.js.map