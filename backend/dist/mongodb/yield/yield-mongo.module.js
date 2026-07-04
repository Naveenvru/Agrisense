"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldMongoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const yield_analytics_schema_1 = require("./yield-analytics.schema");
const yield_history_schema_1 = require("./yield-history.schema");
const yield_intelligence_schema_1 = require("./yield-intelligence.schema");
const yield_mongo_service_1 = require("./yield-mongo.service");
let YieldMongoModule = class YieldMongoModule {
};
exports.YieldMongoModule = YieldMongoModule;
exports.YieldMongoModule = YieldMongoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: yield_intelligence_schema_1.YieldIntelligenceDocument.name, schema: yield_intelligence_schema_1.YieldIntelligenceSchema },
                { name: yield_history_schema_1.YieldHistoryDocument.name, schema: yield_history_schema_1.YieldHistorySchema },
                { name: yield_analytics_schema_1.YieldAnalyticsDocument.name, schema: yield_analytics_schema_1.YieldAnalyticsSchema },
            ]),
        ],
        providers: [yield_mongo_service_1.YieldMongoService],
        exports: [yield_mongo_service_1.YieldMongoService, mongoose_1.MongooseModule],
    })
], YieldMongoModule);
//# sourceMappingURL=yield-mongo.module.js.map