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
exports.SupplyHistorySchema = exports.SupplyHistoryDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SupplyHistoryDocument = class SupplyHistoryDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    previousSupplyKg;
    newSupplyKg;
    reason;
    confidence;
    riskLevel;
    supplyDensityKgPerAcre;
    explanations;
    recommendations;
    version;
    predictionTimestamp;
};
exports.SupplyHistoryDocument = SupplyHistoryDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SupplyHistoryDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyHistoryDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyHistoryDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyHistoryDocument.prototype, "previousSupplyKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyHistoryDocument.prototype, "newSupplyKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyHistoryDocument.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyHistoryDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SupplyHistoryDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SupplyHistoryDocument.prototype, "supplyDensityKgPerAcre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], SupplyHistoryDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], SupplyHistoryDocument.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], SupplyHistoryDocument.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], SupplyHistoryDocument.prototype, "predictionTimestamp", void 0);
exports.SupplyHistoryDocument = SupplyHistoryDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'supply_history', timestamps: true })
], SupplyHistoryDocument);
exports.SupplyHistorySchema = mongoose_1.SchemaFactory.createForClass(SupplyHistoryDocument);
exports.SupplyHistorySchema.index({ farmerCropId: 1 });
exports.SupplyHistorySchema.index({ farmerProfileId: 1 });
exports.SupplyHistorySchema.index({ predictionTimestamp: -1 });
//# sourceMappingURL=supply-history.schema.js.map