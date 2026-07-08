"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandMongoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const demand_analytics_schema_1 = require("./demand-analytics.schema");
const demand_history_schema_1 = require("./demand-history.schema");
const demand_intelligence_schema_1 = require("./demand-intelligence.schema");
const demand_mongo_service_1 = require("./demand-mongo.service");
let DemandMongoModule = class DemandMongoModule {
};
exports.DemandMongoModule = DemandMongoModule;
exports.DemandMongoModule = DemandMongoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: demand_intelligence_schema_1.DemandIntelligenceDocument.name, schema: demand_intelligence_schema_1.DemandIntelligenceSchema },
                { name: demand_history_schema_1.DemandHistoryDocument.name, schema: demand_history_schema_1.DemandHistorySchema },
                { name: demand_analytics_schema_1.DemandAnalyticsDocument.name, schema: demand_analytics_schema_1.DemandAnalyticsSchema },
            ]),
        ],
        providers: [demand_mongo_service_1.DemandMongoService],
        exports: [demand_mongo_service_1.DemandMongoService, mongoose_1.MongooseModule],
    })
], DemandMongoModule);
//# sourceMappingURL=demand-mongo.module.js.map