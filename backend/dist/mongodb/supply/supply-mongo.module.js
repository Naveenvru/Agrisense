"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyMongoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const supply_analytics_schema_1 = require("./supply-analytics.schema");
const supply_history_schema_1 = require("./supply-history.schema");
const supply_intelligence_schema_1 = require("./supply-intelligence.schema");
const supply_mongo_service_1 = require("./supply-mongo.service");
let SupplyMongoModule = class SupplyMongoModule {
};
exports.SupplyMongoModule = SupplyMongoModule;
exports.SupplyMongoModule = SupplyMongoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: supply_intelligence_schema_1.SupplyIntelligenceDocument.name, schema: supply_intelligence_schema_1.SupplyIntelligenceSchema },
                { name: supply_history_schema_1.SupplyHistoryDocument.name, schema: supply_history_schema_1.SupplyHistorySchema },
                { name: supply_analytics_schema_1.SupplyAnalyticsDocument.name, schema: supply_analytics_schema_1.SupplyAnalyticsSchema },
            ]),
        ],
        providers: [supply_mongo_service_1.SupplyMongoService],
        exports: [supply_mongo_service_1.SupplyMongoService, mongoose_1.MongooseModule],
    })
], SupplyMongoModule);
//# sourceMappingURL=supply-mongo.module.js.map