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
exports.MarketTrendSchema = exports.MarketTrend = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MarketTrend = class MarketTrend {
    commodity;
    market;
    state;
    district;
    period;
    startDate;
    endDate;
    avgPrice;
    minPrice;
    maxPrice;
    totalArrival;
    trend;
};
exports.MarketTrend = MarketTrend;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketTrend.prototype, "commodity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketTrend.prototype, "market", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketTrend.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketTrend.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['daily', 'weekly', 'monthly'] }),
    __metadata("design:type", String)
], MarketTrend.prototype, "period", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MarketTrend.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MarketTrend.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketTrend.prototype, "avgPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketTrend.prototype, "minPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketTrend.prototype, "maxPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], MarketTrend.prototype, "totalArrival", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['rising', 'falling', 'stable'] }),
    __metadata("design:type", String)
], MarketTrend.prototype, "trend", void 0);
exports.MarketTrend = MarketTrend = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'market_trends' })
], MarketTrend);
exports.MarketTrendSchema = mongoose_1.SchemaFactory.createForClass(MarketTrend);
exports.MarketTrendSchema.index({ commodity: 1, market: 1, period: 1, startDate: -1 });
//# sourceMappingURL=market-trend.schema.js.map