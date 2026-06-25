"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const base_http_client_1 = require("./base-http.client");
const retry_service_1 = require("./retry.service");
const cache_service_1 = require("./cache.service");
const integration_registry_1 = require("./integration.registry");
const integration_health_service_1 = require("./integration-health.service");
const openweather_client_1 = require("../weather/openweather.client");
const weather_mapper_1 = require("../weather/weather.mapper");
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        providers: [
            retry_service_1.RetryService,
            cache_service_1.CacheService,
            base_http_client_1.BaseHttpClient,
            integration_registry_1.IntegrationRegistry,
            weather_mapper_1.WeatherMapper,
            openweather_client_1.OpenWeatherClient,
            integration_health_service_1.IntegrationHealthService,
        ],
        exports: [
            retry_service_1.RetryService,
            cache_service_1.CacheService,
            base_http_client_1.BaseHttpClient,
            integration_registry_1.IntegrationRegistry,
            integration_health_service_1.IntegrationHealthService,
            weather_mapper_1.WeatherMapper,
            openweather_client_1.OpenWeatherClient,
        ],
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map