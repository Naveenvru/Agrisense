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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandAnalyticsSchema = exports.DemandAnalyticsDocument = exports.DemandHistorySchema = exports.DemandHistoryDocument = exports.DemandIntelligenceSchema = exports.DemandIntelligenceDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DemandIntelligenceDocument = class DemandIntelligenceDocument extends mongoose_2.Document {
    cropName;
    cropCategory;
    regionLevel;
    regionName;
    expectedDemandKg;
    demandDensityKgPerTransaction;
    confidence;
    confidenceBand;
    trend;
    explanation;
    explanations;
    risk;
    recommendations;
    assessedAt;
    version;
};
exports.DemandIntelligenceDocument = DemandIntelligenceDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "cropCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "expectedDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "demandDensityKgPerTransaction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "confidenceBand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "trend", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "explanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DemandIntelligenceDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandIntelligenceDocument.prototype, "risk", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], DemandIntelligenceDocument.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], DemandIntelligenceDocument.prototype, "assessedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "version", void 0);
exports.DemandIntelligenceDocument = DemandIntelligenceDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'demand_intelligence', timestamps: true })
], DemandIntelligenceDocument);
exports.DemandIntelligenceSchema = mongoose_1.SchemaFactory.createForClass(DemandIntelligenceDocument);
exports.DemandIntelligenceSchema.index({ cropName: 1, regionLevel: 1, regionName: 1 }, { unique: true });
exports.DemandIntelligenceSchema.index({ assessedAt: -1 });
let DemandHistoryDocument = class DemandHistoryDocument extends mongoose_2.Document {
    cropName;
    regionLevel;
    regionName;
    newDemandKg;
    previousDemandKg;
    confidence;
    reason;
    explanations;
    predictionTimestamp;
};
exports.DemandHistoryDocument = DemandHistoryDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "newDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "previousDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DemandHistoryDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], DemandHistoryDocument.prototype, "predictionTimestamp", void 0);
exports.DemandHistoryDocument = DemandHistoryDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'demand_history', timestamps: true })
], DemandHistoryDocument);
exports.DemandHistorySchema = mongoose_1.SchemaFactory.createForClass(DemandHistoryDocument);
exports.DemandHistorySchema.index({ cropName: 1, regionLevel: 1, regionName: 1 });
exports.DemandHistorySchema.index({ predictionTimestamp: -1 });
let DemandAnalyticsDocument = class DemandAnalyticsDocument extends mongoose_2.Document {
    scope;
    regionLevel;
    regionName;
    cropName;
    periodType;
    periodStart;
    periodEnd;
    cropWiseDemand;
    regionWiseDemand;
    weeklyDemand;
    monthlyDemand;
    seasonalDemand;
    averageDemandKg;
    demandTrend;
    topDemandRegions;
    cropDistribution;
    generatedAt;
};
exports.DemandAnalyticsDocument = DemandAnalyticsDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandAnalyticsDocument.prototype, "scope", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandAnalyticsDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandAnalyticsDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandAnalyticsDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandAnalyticsDocument.prototype, "periodType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], DemandAnalyticsDocument.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], DemandAnalyticsDocument.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandAnalyticsDocument.prototype, "cropWiseDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandAnalyticsDocument.prototype, "regionWiseDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandAnalyticsDocument.prototype, "weeklyDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandAnalyticsDocument.prototype, "monthlyDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandAnalyticsDocument.prototype, "seasonalDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DemandAnalyticsDocument.prototype, "averageDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], DemandAnalyticsDocument.prototype, "demandTrend", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], DemandAnalyticsDocument.prototype, "topDemandRegions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], DemandAnalyticsDocument.prototype, "cropDistribution", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], DemandAnalyticsDocument.prototype, "generatedAt", void 0);
exports.DemandAnalyticsDocument = DemandAnalyticsDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'demand_analytics', timestamps: true })
], DemandAnalyticsDocument);
exports.DemandAnalyticsSchema = mongoose_1.SchemaFactory.createForClass(DemandAnalyticsDocument);
exports.DemandAnalyticsSchema.index({ scope: 1, periodStart: -1 });
exports.DemandAnalyticsSchema.index({ generatedAt: -1 });
//# sourceMappingURL=demand-intelligence.schema.js.map