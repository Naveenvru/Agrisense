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
exports.YieldAnalyticsSchema = exports.YieldAnalyticsDocument = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let YieldAnalyticsDocument = class YieldAnalyticsDocument extends mongoose_2.Document {
    scope;
    regionLevel;
    regionName;
    cropName;
    periodType;
    periodStart;
    periodEnd;
    cropWiseYield;
    regionWiseYield;
    monthlyYield;
    seasonWiseYield;
    averageYieldKg;
    yieldTrend;
    topPerformingCrops;
    generatedAt;
};
exports.YieldAnalyticsDocument = YieldAnalyticsDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], YieldAnalyticsDocument.prototype, "scope", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], YieldAnalyticsDocument.prototype, "regionLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], YieldAnalyticsDocument.prototype, "regionName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], YieldAnalyticsDocument.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], YieldAnalyticsDocument.prototype, "periodType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, index: true }),
    __metadata("design:type", Date)
], YieldAnalyticsDocument.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], YieldAnalyticsDocument.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldAnalyticsDocument.prototype, "cropWiseYield", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldAnalyticsDocument.prototype, "regionWiseYield", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldAnalyticsDocument.prototype, "monthlyYield", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], YieldAnalyticsDocument.prototype, "seasonWiseYield", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], YieldAnalyticsDocument.prototype, "averageYieldKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], YieldAnalyticsDocument.prototype, "yieldTrend", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], YieldAnalyticsDocument.prototype, "topPerformingCrops", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], YieldAnalyticsDocument.prototype, "generatedAt", void 0);
exports.YieldAnalyticsDocument = YieldAnalyticsDocument = __decorate([
    (0, mongoose_1.Schema)({ collection: 'yield_analytics', timestamps: true })
], YieldAnalyticsDocument);
exports.YieldAnalyticsSchema = mongoose_1.SchemaFactory.createForClass(YieldAnalyticsDocument);
exports.YieldAnalyticsSchema.index({ scope: 1, periodStart: -1 });
exports.YieldAnalyticsSchema.index({ generatedAt: -1 });
//# sourceMappingURL=yield-analytics.schema.js.map