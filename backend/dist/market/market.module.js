"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketModule = void 0;
const common_1 = require("@nestjs/common");
const market_controller_1 = require("./market.controller");
const market_service_1 = require("./market.service");
const market_repository_1 = require("./repository/market.repository");
const market_normalization_service_1 = require("./normalization/market-normalization.service");
const market_quality_service_1 = require("./quality/market-quality.service");
const market_aggregation_service_1 = require("./aggregation/market-aggregation.service");
const market_mongo_module_1 = require("../mongodb/market/market-mongo.module");
const collector_module_1 = require("../collectors/common/collector.module");
const farmer_profiles_module_1 = require("../farmer-profiles/farmer-profiles.module");
const ai_ml_service_client_1 = require("../ai/ai-ml-service.client");
let MarketModule = class MarketModule {
};
exports.MarketModule = MarketModule;
exports.MarketModule = MarketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            market_mongo_module_1.MarketMongoModule,
            collector_module_1.CollectorModule,
            farmer_profiles_module_1.FarmerProfilesModule,
        ],
        controllers: [market_controller_1.MarketController],
        providers: [
            market_repository_1.MarketRepository,
            market_normalization_service_1.MarketNormalizationService,
            market_quality_service_1.MarketQualityService,
            market_aggregation_service_1.MarketAggregationService,
            market_service_1.MarketService,
            ai_ml_service_client_1.AiMlServiceClient,
        ],
        exports: [market_service_1.MarketService, market_repository_1.MarketRepository, ai_ml_service_client_1.AiMlServiceClient],
    })
], MarketModule);
//# sourceMappingURL=market.module.js.map