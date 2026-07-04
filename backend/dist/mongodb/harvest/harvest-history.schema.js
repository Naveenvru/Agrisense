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
exports.HarvestHistorySchema = exports.HarvestHistoryDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HarvestHistoryDocument = class HarvestHistoryDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    predictionTimestamp;
    previousHarvestDate;
    newHarvestDate;
    reason;
    readinessScore;
    harvestScore;
    confidenceScore;
    riskLevel;
    delayDays;
    explanations;
    version;
};
exports.HarvestHistoryDocument = HarvestHistoryDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], HarvestHistoryDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], HarvestHistoryDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestHistoryDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], HarvestHistoryDocument.prototype, "predictionTimestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], HarvestHistoryDocument.prototype, "previousHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], HarvestHistoryDocument.prototype, "newHarvestDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestHistoryDocument.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestHistoryDocument.prototype, "readinessScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestHistoryDocument.prototype, "harvestScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HarvestHistoryDocument.prototype, "confidenceScore", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HarvestHistoryDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], HarvestHistoryDocument.prototype, "delayDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HarvestHistoryDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], HarvestHistoryDocument.prototype, "version", void 0);
exports.HarvestHistoryDocument = HarvestHistoryDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'harvest_history', timestamps: true })
], HarvestHistoryDocument);
exports.HarvestHistorySchema = mongoose_1.SchemaFactory.createForClass(HarvestHistoryDocument);
exports.HarvestHistorySchema.index({ farmerCropId: 1, predictionTimestamp: -1 });
exports.HarvestHistorySchema.index({ farmerProfileId: 1 });
//# sourceMappingURL=harvest-history.schema.js.map