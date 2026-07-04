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
exports.HarvestIntelligenceSchema = exports.HarvestIntelligenceDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HarvestIntelligenceDocument = class HarvestIntelligenceDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    cropVariety;
    daysElapsed;
    daysRemaining;
    growthPercentage;
    lifecycleStage;
    readinessScore;
    readinessStatus;
    earliestHarvestDate;
    optimalHarvestDate;
    latestSafeHarvestDate;
    harvestScore;
    confidenceScore;
    riskLevel;
    riskFactors;
    mitigationRecommendations;
    delayDays;
    delayReasons;
    delayActions;
    expectedYieldKg;
    yieldConfidence;
    qualityGrade;
    qualityExplanation;
    workersRequired;
    harvestDurationDays;
    estimatedLabourHours;
    equipmentRecommendations;
    storageRecommendation;
    storageExplanation;
    explanations;
    assessedAt;
    version;
};
exports.HarvestIntelligenceDocument = HarvestIntelligenceDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "cropVariety", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "daysElapsed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "daysRemaining", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "growthPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "lifecycleStage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "readinessScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "readinessStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], HarvestIntelligenceDocument.prototype, "earliestHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], HarvestIntelligenceDocument.prototype, "optimalHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], HarvestIntelligenceDocument.prototype, "latestSafeHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "harvestScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "confidenceScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], HarvestIntelligenceDocument.prototype, "riskFactors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], HarvestIntelligenceDocument.prototype, "mitigationRecommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "delayDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HarvestIntelligenceDocument.prototype, "delayReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HarvestIntelligenceDocument.prototype, "delayActions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "expectedYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "yieldConfidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "qualityGrade", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "qualityExplanation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "workersRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "harvestDurationDays", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "estimatedLabourHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HarvestIntelligenceDocument.prototype, "equipmentRecommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "storageRecommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestIntelligenceDocument.prototype, "storageExplanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HarvestIntelligenceDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], HarvestIntelligenceDocument.prototype, "assessedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], HarvestIntelligenceDocument.prototype, "version", void 0);
exports.HarvestIntelligenceDocument = HarvestIntelligenceDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'harvest_intelligence', timestamps: true })
], HarvestIntelligenceDocument);
exports.HarvestIntelligenceSchema = mongoose_1.SchemaFactory.createForClass(HarvestIntelligenceDocument);
exports.HarvestIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
exports.HarvestIntelligenceSchema.index({ farmerProfileId: 1 });
exports.HarvestIntelligenceSchema.index({ assessedAt: -1 });
//# sourceMappingURL=harvest-intelligence.schema.js.map