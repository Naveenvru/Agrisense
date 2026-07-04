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
exports.YieldIntelligenceSchema = exports.YieldIntelligenceDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let YieldIntelligenceDocument = class YieldIntelligenceDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    cropVariety;
    cropCategory;
    areaAcres;
    soilType;
    soilFertilityScore;
    irrigationType;
    lifecycleStage;
    growthPercentage;
    readinessScore;
    currentWeatherSummary;
    expectedYieldKg;
    yieldPerAcreKg;
    expectedProductionKg;
    confidence;
    explanation;
    explanations;
    riskLevel;
    riskScore;
    riskReasons;
    mitigationRecommendations;
    confidenceBand;
    confidenceExplanation;
    qualityGrade;
    qualityScore;
    qualityFactors;
    qualityExplanation;
    expectedLossPercent;
    expectedLossQuantityKg;
    lossReasons;
    lossExplanation;
    recommendations;
    weather;
    weatherHistory;
    activities;
    lifecycle;
    assessedAt;
    version;
};
exports.YieldIntelligenceDocument = YieldIntelligenceDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "cropVariety", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "cropCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "areaAcres", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "soilType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "soilFertilityScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "irrigationType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "lifecycleStage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "growthPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "readinessScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "currentWeatherSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "expectedYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "yieldPerAcreKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "expectedProductionKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "explanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "riskScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "riskReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "mitigationRecommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "confidenceBand", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "confidenceExplanation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "qualityGrade", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "qualityScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "qualityFactors", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "qualityExplanation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "expectedLossPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "expectedLossQuantityKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "lossReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldIntelligenceDocument.prototype, "lossExplanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldIntelligenceDocument.prototype, "weather", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], YieldIntelligenceDocument.prototype, "weatherHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldIntelligenceDocument.prototype, "activities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldIntelligenceDocument.prototype, "lifecycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], YieldIntelligenceDocument.prototype, "assessedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], YieldIntelligenceDocument.prototype, "version", void 0);
exports.YieldIntelligenceDocument = YieldIntelligenceDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'yield_intelligence', timestamps: true })
], YieldIntelligenceDocument);
exports.YieldIntelligenceSchema = mongoose_1.SchemaFactory.createForClass(YieldIntelligenceDocument);
exports.YieldIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
exports.YieldIntelligenceSchema.index({ farmerProfileId: 1 });
exports.YieldIntelligenceSchema.index({ assessedAt: -1 });
//# sourceMappingURL=yield-intelligence.schema.js.map