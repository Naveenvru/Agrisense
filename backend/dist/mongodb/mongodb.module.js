"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const weather_history_schema_1 = require("./weather/weather-history.schema");
const weather_forecast_schema_1 = require("./weather/weather-forecast.schema");
const market_price_schema_1 = require("./market-price/market-price.schema");
const weather_mongo_service_1 = require("./weather/weather-mongo.service");
const market_price_mongo_service_1 = require("./market-price/market-price-mongo.service");
const mongodb_service_1 = require("./mongodb.service");
let MongodbModule = class MongodbModule {
};
exports.MongodbModule = MongodbModule;
exports.MongodbModule = MongodbModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: weather_history_schema_1.WeatherHistory.name, schema: weather_history_schema_1.WeatherHistorySchema },
                { name: weather_forecast_schema_1.WeatherForecast.name, schema: weather_forecast_schema_1.WeatherForecastSchema },
                { name: market_price_schema_1.MarketPrice.name, schema: market_price_schema_1.MarketPriceSchema },
            ]),
        ],
        providers: [mongodb_service_1.MongodbService, weather_mongo_service_1.WeatherMongoService, market_price_mongo_service_1.MarketPriceMongoService],
        exports: [mongodb_service_1.MongodbService, weather_mongo_service_1.WeatherMongoService, market_price_mongo_service_1.MarketPriceMongoService, mongoose_1.MongooseModule],
    })
], MongodbModule);
//# sourceMappingURL=mongodb.module.js.map