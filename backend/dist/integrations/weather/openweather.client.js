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
var OpenWeatherClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWeatherClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const integration_constants_1 = require("../common/integration.constants");
const base_http_client_1 = require("../common/base-http.client");
const weather_mapper_1 = require("./weather.mapper");
let OpenWeatherClient = OpenWeatherClient_1 = class OpenWeatherClient {
    configService;
    httpClient;
    mapper;
    logger = new common_1.Logger(OpenWeatherClient_1.name);
    apiKey;
    baseUrl;
    constructor(configService, httpClient, mapper) {
        this.configService = configService;
        this.httpClient = httpClient;
        this.mapper = mapper;
        this.apiKey =
            this.configService.get('OPENWEATHER_API_KEY') || '';
        this.baseUrl =
            this.configService.get('OPENWEATHER_BASE_URL') ||
                'https://api.openweathermap.org/data/2.5';
    }
    async fetch(params) {
        const endpoint = params['endpoint'];
        const latitude = params['latitude'];
        const longitude = params['longitude'];
        if (endpoint === 'current') {
            return this.fetchCurrentWeather(latitude, longitude);
        }
        if (endpoint === 'forecast') {
            return this.fetchForecast(latitude, longitude);
        }
        throw new Error(`OpenWeatherClient.fetch: unknown endpoint "${endpoint}"`);
    }
    async authenticate() {
        this.logger.debug('OpenWeather uses API key authentication — no token refresh required.');
    }
    async health() {
        const start = Date.now();
        try {
            const url = `${this.baseUrl}/weather`;
            await this.httpClient.get(url, {
                params: { lat: 51.5074, lon: -0.1278, appid: this.apiKey, units: 'metric' },
                timeoutMs: 5_000,
            });
            return {
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
                healthy: true,
                latencyMs: Date.now() - start,
                checkedAt: new Date(),
            };
        }
        catch (error) {
            return {
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
                healthy: false,
                latencyMs: Date.now() - start,
                message: error?.message,
                checkedAt: new Date(),
            };
        }
    }
    async fetchCurrentWeather(latitude, longitude) {
        this.logger.log(`Fetching current weather | lat=${latitude} lon=${longitude}`);
        const url = `${this.baseUrl}/weather`;
        const response = await this.httpClient.get(url, {
            params: { lat: latitude, lon: longitude, appid: this.apiKey, units: 'metric' },
        });
        return this.mapper.mapCurrentWeather(response.data, latitude, longitude);
    }
    async fetchForecast(latitude, longitude) {
        this.logger.log(`Fetching forecast | lat=${latitude} lon=${longitude}`);
        const url = `${this.baseUrl}/forecast`;
        const response = await this.httpClient.get(url, {
            params: { lat: latitude, lon: longitude, appid: this.apiKey, units: 'metric' },
        });
        return this.mapper.mapForecast(response.data, latitude, longitude);
    }
};
exports.OpenWeatherClient = OpenWeatherClient;
exports.OpenWeatherClient = OpenWeatherClient = OpenWeatherClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        base_http_client_1.BaseHttpClient,
        weather_mapper_1.WeatherMapper])
], OpenWeatherClient);
//# sourceMappingURL=openweather.client.js.map