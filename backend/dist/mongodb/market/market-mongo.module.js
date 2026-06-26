"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketMongoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const market_raw_schema_1 = require("./market-raw.schema");
const market_price_schema_1 = require("./market-price.schema");
const market_arrival_schema_1 = require("./market-arrival.schema");
const market_trend_schema_1 = require("./market-trend.schema");
const market_cache_schema_1 = require("./market-cache.schema");
let MarketMongoModule = class MarketMongoModule {
};
exports.MarketMongoModule = MarketMongoModule;
exports.MarketMongoModule = MarketMongoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: market_raw_schema_1.MarketRaw.name, schema: market_raw_schema_1.MarketRawSchema },
                { name: market_price_schema_1.MarketPriceV2.name, schema: market_price_schema_1.MarketPriceV2Schema },
                { name: market_arrival_schema_1.MarketArrival.name, schema: market_arrival_schema_1.MarketArrivalSchema },
                { name: market_trend_schema_1.MarketTrend.name, schema: market_trend_schema_1.MarketTrendSchema },
                { name: market_cache_schema_1.MarketCache.name, schema: market_cache_schema_1.MarketCacheSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], MarketMongoModule);
//# sourceMappingURL=market-mongo.module.js.map