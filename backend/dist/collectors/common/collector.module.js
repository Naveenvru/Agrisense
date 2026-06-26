"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorModule = void 0;
const common_1 = require("@nestjs/common");
const integration_module_1 = require("../../integrations/common/integration.module");
const storage_module_1 = require("../../storage/common/storage.module");
const openweather_client_1 = require("../../integrations/weather/openweather.client");
const weather_mapper_1 = require("../../integrations/weather/weather.mapper");
const collector_logger_service_1 = require("./collector-logger.service");
const weather_collector_1 = require("../weather/weather.collector");
const market_collector_1 = require("../market/market.collector");
const mock_market_data_source_1 = require("../market/mock-market-data.source");
const government_collector_1 = require("../government/government.collector");
let CollectorModule = class CollectorModule {
};
exports.CollectorModule = CollectorModule;
exports.CollectorModule = CollectorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            integration_module_1.IntegrationModule,
            storage_module_1.StorageModule,
        ],
        providers: [
            collector_logger_service_1.CollectorLogger,
            weather_mapper_1.WeatherMapper,
            openweather_client_1.OpenWeatherClient,
            mock_market_data_source_1.MockMarketDataSource,
            weather_collector_1.WeatherCollector,
            market_collector_1.MarketCollector,
            government_collector_1.GovernmentCollector,
        ],
        exports: [
            collector_logger_service_1.CollectorLogger,
            weather_collector_1.WeatherCollector,
            market_collector_1.MarketCollector,
            government_collector_1.GovernmentCollector,
            mock_market_data_source_1.MockMarketDataSource,
        ],
    })
], CollectorModule);
//# sourceMappingURL=collector.module.js.map