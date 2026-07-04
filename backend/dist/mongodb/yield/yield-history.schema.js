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
exports.YieldHistorySchema = exports.YieldHistoryDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let YieldHistoryDocument = class YieldHistoryDocument extends mongoose_2.Document {
    farmerCropId;
    farmerProfileId;
    cropName;
    predictionTimestamp;
    previousYieldKg;
    newYieldKg;
    reason;
    confidence;
    qualityGrade;
    riskLevel;
    lossPercent;
    explanations;
    recommendations;
    version;
};
exports.YieldHistoryDocument = YieldHistoryDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], YieldHistoryDocument.prototype, "farmerCropId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], YieldHistoryDocument.prototype, "farmerProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldHistoryDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], YieldHistoryDocument.prototype, "predictionTimestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldHistoryDocument.prototype, "previousYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldHistoryDocument.prototype, "newYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldHistoryDocument.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldHistoryDocument.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldHistoryDocument.prototype, "qualityGrade", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], YieldHistoryDocument.prototype, "riskLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], YieldHistoryDocument.prototype, "lossPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], YieldHistoryDocument.prototype, "explanations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], YieldHistoryDocument.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], YieldHistoryDocument.prototype, "version", void 0);
exports.YieldHistoryDocument = YieldHistoryDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'yield_history', timestamps: true })
], YieldHistoryDocument);
exports.YieldHistorySchema = mongoose_1.SchemaFactory.createForClass(YieldHistoryDocument);
exports.YieldHistorySchema.index({ farmerCropId: 1, predictionTimestamp: -1 });
exports.YieldHistorySchema.index({ farmerProfileId: 1 });
//# sourceMappingURL=yield-history.schema.js.map