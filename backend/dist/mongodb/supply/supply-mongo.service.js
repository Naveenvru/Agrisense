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
var SupplyMongoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyMongoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const supply_analytics_schema_1 = require("./supply-analytics.schema");
const supply_history_schema_1 = require("./supply-history.schema");
const supply_intelligence_schema_1 = require("./supply-intelligence.schema");
let SupplyMongoService = SupplyMongoService_1 = class SupplyMongoService {
    intelligenceModel;
    historyModel;
    analyticsModel;
    logger = new common_1.Logger(SupplyMongoService_1.name);
    constructor(intelligenceModel, historyModel, analyticsModel) {
        this.intelligenceModel = intelligenceModel;
        this.historyModel = historyModel;
        this.analyticsModel = analyticsModel;
    }
    async upsertAssessment(farmerCropId, data) {
        await this.intelligenceModel.updateOne({ farmerCropId }, { $set: { ...data, assessedAt: new Date() } }, { upsert: true }).exec();
        this.logger.debug(`Supply assessment upserted for farmerCropId=${farmerCropId}`);
    }
    async findByFarmerCropId(farmerCropId) {
        return this.intelligenceModel.findOne({ farmerCropId }).exec();
    }
    async findByFarmerProfileId(farmerProfileId) {
        return this.intelligenceModel.find({ farmerProfileId }).sort({ assessedAt: -1 }).exec();
    }
    async findAllPredictions() {
        return this.intelligenceModel.find({}).sort({ assessedAt: -1 }).exec();
    }
    async appendHistory(entry) {
        await this.historyModel.create({ ...entry, predictionTimestamp: new Date() });
        this.logger.debug(`Supply history appended for farmerCropId=${entry.farmerCropId}`);
    }
    async findHistory(farmerCropId, limit = 20) {
        return this.historyModel.find({ farmerCropId }).sort({ predictionTimestamp: -1 }).limit(limit).exec();
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
exports.SupplyMongoService = SupplyMongoService;
exports.SupplyMongoService = SupplyMongoService = SupplyMongoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(supply_intelligence_schema_1.SupplyIntelligenceDocument.name)),
    __param(1, (0, mongoose_1.InjectModel)(supply_history_schema_1.SupplyHistoryDocument.name)),
    __param(2, (0, mongoose_1.InjectModel)(supply_analytics_schema_1.SupplyAnalyticsDocument.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SupplyMongoService);
//# sourceMappingURL=supply-mongo.service.js.map