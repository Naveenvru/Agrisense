"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestMongoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const harvest_intelligence_schema_1 = require("./harvest-intelligence.schema");
const harvest_history_schema_1 = require("./harvest-history.schema");
const harvest_analytics_schema_1 = require("./harvest-analytics.schema");
const harvest_mongo_service_1 = require("./harvest-mongo.service");
let HarvestMongoModule = class HarvestMongoModule {
};
exports.HarvestMongoModule = HarvestMongoModule;
exports.HarvestMongoModule = HarvestMongoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: harvest_intelligence_schema_1.HarvestIntelligenceDocument.name, schema: harvest_intelligence_schema_1.HarvestIntelligenceSchema },
                { name: harvest_history_schema_1.HarvestHistoryDocument.name, schema: harvest_history_schema_1.HarvestHistorySchema },
                { name: harvest_analytics_schema_1.HarvestAnalyticsDocument.name, schema: harvest_analytics_schema_1.HarvestAnalyticsSchema },
            ]),
        ],
        providers: [harvest_mongo_service_1.HarvestMongoService],
        exports: [harvest_mongo_service_1.HarvestMongoService, mongoose_1.MongooseModule],
    })
], HarvestMongoModule);
//# sourceMappingURL=harvest-mongo.module.js.map