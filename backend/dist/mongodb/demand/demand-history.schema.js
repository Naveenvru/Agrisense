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
exports.DemandHistorySchema = exports.DemandHistoryDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DemandHistoryDocument = class DemandHistoryDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    previousDemandKg;
    newDemandKg;
    reason;
    confidence;
    riskLevel;
    demandDensityKgPerAcre;
    explanations;
    recommendations;
    version;
    predictionTimestamp;
};
exports.DemandHistoryDocument = DemandHistoryDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "previousDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "newDemandKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DemandHistoryDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "demandDensityKgPerAcre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DemandHistoryDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], DemandHistoryDocument.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], DemandHistoryDocument.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], DemandHistoryDocument.prototype, "predictionTimestamp", void 0);
exports.DemandHistoryDocument = DemandHistoryDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'demand_history', timestamps: true })
], DemandHistoryDocument);
exports.DemandHistorySchema = mongoose_1.SchemaFactory.createForClass(DemandHistoryDocument);
exports.DemandHistorySchema.index({ farmerCropId: 1 });
exports.DemandHistorySchema.index({ farmerProfileId: 1 });
exports.DemandHistorySchema.index({ predictionTimestamp: -1 });
//# sourceMappingURL=demand-history.schema.js.map