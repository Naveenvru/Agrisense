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
exports.SupplyIntelligenceSchema = exports.SupplyIntelligenceDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SupplyIntelligenceDocument = class SupplyIntelligenceDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    cropVariety;
    cropCategory;
    regionLevel;
    regionName;
    villageName;
    talukName;
    districtName;
    stateName;
    areaAcres;
    expectedHarvestDate;
    expectedSupplyKg;
    expectedYieldKg;
    availableSupplyKg;
    supplyDensityKgPerAcre;
    confidence;
    confidenceBand;
    explanation;
    explanations;
    riskLevel;
    riskScore;
    riskReasons;
    mitigationRecommendations;
    seasonalAnalysis;
    timeline;
    recommendations;
    harvestStage;
    yieldStage;
    weatherSummary;
    assessedAt;
    version;
};
exports.SupplyIntelligenceDocument = SupplyIntelligenceDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "cropVariety", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "cropCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "villageName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "talukName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "districtName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "stateName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "areaAcres", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], SupplyIntelligenceDocument.prototype, "expectedHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "expectedSupplyKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "expectedYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "availableSupplyKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "supplyDensityKgPerAcre", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "confidenceBand", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "explanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SupplyIntelligenceDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "riskScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SupplyIntelligenceDocument.prototype, "riskReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SupplyIntelligenceDocument.prototype, "mitigationRecommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], SupplyIntelligenceDocument.prototype, "seasonalAnalysis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], SupplyIntelligenceDocument.prototype, "timeline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], SupplyIntelligenceDocument.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "harvestStage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "yieldStage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyIntelligenceDocument.prototype, "weatherSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SupplyIntelligenceDocument.prototype, "assessedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], SupplyIntelligenceDocument.prototype, "version", void 0);
exports.SupplyIntelligenceDocument = SupplyIntelligenceDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'supply_intelligence', timestamps: true })
], SupplyIntelligenceDocument);
exports.SupplyIntelligenceSchema = mongoose_1.SchemaFactory.createForClass(SupplyIntelligenceDocument);
exports.SupplyIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
exports.SupplyIntelligenceSchema.index({ farmerProfileId: 1 });
exports.SupplyIntelligenceSchema.index({ assessedAt: -1 });
//# sourceMappingURL=supply-intelligence.schema.js.map