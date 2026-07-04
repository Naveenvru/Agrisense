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
exports.HarvestAnalyticsSchema = exports.HarvestAnalyticsDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HarvestAnalyticsDocument = class HarvestAnalyticsDocument extends mongoose_2.Document {
    regionLevel;
    regionName;
    periodType;
    periodStart;
    periodEnd;
    totalFarmers;
    totalCrops;
    totalExpectedYieldKg;
    harvestedCount;
    readyCount;
    almostReadyCount;
    delayedCount;
    avgReadinessScore;
    avgHarvestScore;
    avgConfidenceScore;
    avgDelayDays;
    dominantRisks;
    cropBreakdown;
    harvestTimeline;
    generatedAt;
};
exports.HarvestAnalyticsDocument = HarvestAnalyticsDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], HarvestAnalyticsDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], HarvestAnalyticsDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], HarvestAnalyticsDocument.prototype, "periodType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, index: true }),
    __metadata("design:type", Date)
], HarvestAnalyticsDocument.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], HarvestAnalyticsDocument.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "totalFarmers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "totalCrops", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "totalExpectedYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "harvestedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "readyCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "almostReadyCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "delayedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "avgReadinessScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "avgHarvestScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "avgConfidenceScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestAnalyticsDocument.prototype, "avgDelayDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HarvestAnalyticsDocument.prototype, "dominantRisks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], HarvestAnalyticsDocument.prototype, "cropBreakdown", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], HarvestAnalyticsDocument.prototype, "harvestTimeline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], HarvestAnalyticsDocument.prototype, "generatedAt", void 0);
exports.HarvestAnalyticsDocument = HarvestAnalyticsDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'harvest_analytics', timestamps: true })
], HarvestAnalyticsDocument);
exports.HarvestAnalyticsSchema = mongoose_1.SchemaFactory.createForClass(HarvestAnalyticsDocument);
exports.HarvestAnalyticsSchema.index({ regionLevel: 1, regionName: 1, periodStart: -1 });
exports.HarvestAnalyticsSchema.index({ generatedAt: -1 });
//# sourceMappingURL=harvest-analytics.schema.js.map