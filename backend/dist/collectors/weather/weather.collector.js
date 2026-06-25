"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WeatherCollector_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherCollector = void 0;
const common_1 = require("@nestjs/common");
const openweather_client_1 = require("../../integrations/weather/openweather.client");
const collector_logger_service_1 = require("../common/collector-logger.service");
const collector_constants_1 = require("../common/collector.constants");
const integration_constants_1 = require("../../integrations/common/integration.constants");
let WeatherCollector = WeatherCollector_1 = class WeatherCollector {
    openWeatherClient;
    collectorLogger;
    logger = new common_1.Logger(WeatherCollector_1.name);
    totalCollections = 0;
    successCount = 0;
    failureCount = 0;
    lastSuccessAt;
    lastFailureAt;
    constructor(openWeatherClient, collectorLogger) {
        this.openWeatherClient = openWeatherClient;
        this.collectorLogger = collectorLogger;
    }
    async collect(params) {
        const { operation, payload } = params;
        const startTime = Date.now();
        const requestedAt = new Date();
        this.collectorLogger.logStart(integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER, operation);
        this.totalCollections++;
        try {
            const latitude = payload['latitude'];
            const longitude = payload['longitude'];
            let rawData;
            if (operation === collector_constants_1.COLLECTOR_CONSTANTS.OPERATIONS.CURRENT_WEATHER) {
                rawData = await this.openWeatherClient.fetchCurrentWeather(latitude, longitude);
            }
            else if (operation === collector_constants_1.COLLECTOR_CONSTANTS.OPERATIONS.WEATHER_FORECAST) {
                rawData = await this.openWeatherClient.fetchForecast(latitude, longitude);
            }
            else {
                throw new Error(`WeatherCollector: unsupported operation "${operation}"`);
            }
            const durationMs = Date.now() - startTime;
            this.successCount++;
            this.lastSuccessAt = new Date();
            const result = {
                domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.WEATHER,
                operation,
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
                rawData,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS,
                collectedAt: requestedAt,
                durationMs,
                retryCount: 0,
            };
            this.collectorLogger.logCollection({
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
                operation,
                requestedAt,
                respondedAt: new Date(),
                durationMs,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS,
                retryCount: 0,
            });
            return result;
        }
        catch (error) {
            const durationMs = Date.now() - startTime;
            this.failureCount++;
            this.lastFailureAt = new Date();
            const result = {
                domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.WEATHER,
                operation,
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
                rawData: null,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.FAILED,
                collectedAt: requestedAt,
                durationMs,
                retryCount: 0,
                errorMessage: error?.message,
            };
            this.collectorLogger.logCollection({
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
                operation,
                requestedAt,
                respondedAt: new Date(),
                durationMs,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.FAILED,
                retryCount: 0,
                errorMessage: error?.message,
            });
            this.logger.error(`WeatherCollector.collect failed | operation=${operation} | ${error?.message}`);
            throw error;
        }
    }
    async store(result) {
        this.collectorLogger.logStore(result.provider, result.operation, 'data-lake/raw/weather (Phase 8.7)');
    }
    status() {
        return {
            domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.WEATHER,
            operational: true,
            lastSuccessAt: this.lastSuccessAt,
            lastFailureAt: this.lastFailureAt,
            totalCollections: this.totalCollections,
            successCount: this.successCount,
            failureCount: this.failureCount,
        };
    }
};
exports.WeatherCollector = WeatherCollector;
exports.WeatherCollector = WeatherCollector = WeatherCollector_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openweather_client_1.OpenWeatherClient,
        collector_logger_service_1.CollectorLogger])
], WeatherCollector);
//# sourceMappingURL=weather.collector.js.map