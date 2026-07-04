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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DemandMongoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandMongoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const demand_intelligence_schema_1 = require("./demand-intelligence.schema");
let DemandMongoService = DemandMongoService_1 = class DemandMongoService {
    intelligenceModel;
    historyModel;
    analyticsModel;
    logger = new common_1.Logger(DemandMongoService_1.name);
    constructor(intelligenceModel, historyModel, analyticsModel) {
        this.intelligenceModel = intelligenceModel;
        this.historyModel = historyModel;
        this.analyticsModel = analyticsModel;
    }
    async upsertAssessment(key, data) {
        await this.intelligenceModel.updateOne(key, { $set: { ...data, assessedAt: new Date() } }, { upsert: true }).exec();
        this.logger.debug(`Demand assessment upserted for ${key.cropName}/${key.regionLevel}/${key.regionName}`);
    }
    async findByKey(key) {
        return this.intelligenceModel.findOne(key).exec();
    }
    async findAllPredictions() {
        return this.intelligenceModel.find({}).sort({ assessedAt: -1 }).exec();
    }
    async appendHistory(entry) {
        await this.historyModel.create({ ...entry, predictionTimestamp: new Date() });
    }
    async upsertAnalytics(scope, periodType, periodStart, data) {
        await this.analyticsModel.updateOne({ scope, periodType, periodStart, regionLevel: data.regionLevel, regionName: data.regionName, cropName: data.cropName }, { $set: { ...data, generatedAt: new Date() } }, { upsert: true }).exec();
    }
    async findAnalytics(regionLevel, regionName, periodType, limit = 12) {
        const query = {};
        if (regionLevel)
            query.regionLevel = regionLevel;
        if (regionName)
            query.regionName = regionName;
        if (periodType)
            query.periodType = periodType;
        return this.analyticsModel.find(query).sort({ periodStart: -1 }).limit(limit).exec();
    }
};
exports.DemandMongoService = DemandMongoService;
exports.DemandMongoService = DemandMongoService = DemandMongoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(demand_intelligence_schema_1.DemandIntelligenceDocument.name)),
    __param(1, (0, mongoose_1.InjectModel)(demand_intelligence_schema_1.DemandHistoryDocument.name)),
    __param(2, (0, mongoose_1.InjectModel)(demand_intelligence_schema_1.DemandAnalyticsDocument.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DemandMongoService);
//# sourceMappingURL=demand-mongo.service.js.map