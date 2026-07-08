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
exports.DemandIntelligenceSchema = exports.DemandIntelligenceDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DemandIntelligenceDocument = class DemandIntelligenceDocument extends mongoose_2.Document {
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
    currentDemandKg;
    expectedDemandKg;
    governmentProcurementKg;
    exportDemandKg;
    retailDemandKg;
    industrialDemandKg;
    festivalDemandKg;
    demandDensityKgPerAcre;
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
    assessedAt;
    version;
};
exports.DemandIntelligenceDocument = DemandIntelligenceDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "cropVariety", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "cropCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "villageName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "talukName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "districtName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "stateName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "areaAcres", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], DemandIntelligenceDocument.prototype, "expectedHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "currentDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "expectedDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "governmentProcurementKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "exportDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "retailDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "industrialDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "festivalDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "demandDensityKgPerAcre", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "confidenceBand", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "explanation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DemandIntelligenceDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandIntelligenceDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandIntelligenceDocument.prototype, "riskScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DemandIntelligenceDocument.prototype, "riskReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DemandIntelligenceDocument.prototype, "mitigationRecommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], DemandIntelligenceDocument.prototype, "seasonalAnalysis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], DemandIntelligenceDocument.prototype, "timeline", void 0);
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
exports.DemandIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
exports.DemandIntelligenceSchema.index({ farmerProfileId: 1 });
exports.DemandIntelligenceSchema.index({ assessedAt: -1 });
exports.DemandIntelligenceSchema.index({ regionLevel: 1, regionName: 1 });
//# sourceMappingURL=demand-intelligence.schema.js.map