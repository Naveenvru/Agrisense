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
exports.MarketPriceV2Schema = exports.MarketPriceV2 = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MarketPriceV2 = class MarketPriceV2 {
    commodity;
    market;
    district;
    state;
    date;
    minPrice;
    maxPrice;
    modalPrice;
    unit;
    source;
    variety;
    grade;
    normalizedAt;
    qualityScore;
};
exports.MarketPriceV2 = MarketPriceV2;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "commodity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "market", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], MarketPriceV2.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketPriceV2.prototype, "minPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketPriceV2.prototype, "maxPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketPriceV2.prototype, "modalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Quintal' }),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "variety", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MarketPriceV2.prototype, "grade", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MarketPriceV2.prototype, "normalizedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 100 }),
    __metadata("design:type", Number)
], MarketPriceV2.prototype, "qualityScore", void 0);
exports.MarketPriceV2 = MarketPriceV2 = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'market_prices_v2' })
], MarketPriceV2);
exports.MarketPriceV2Schema = mongoose_1.SchemaFactory.createForClass(MarketPriceV2);
exports.MarketPriceV2Schema.index({ commodity: 1, market: 1, date: -1 });
exports.MarketPriceV2Schema.index({ state: 1, date: -1 });
exports.MarketPriceV2Schema.index({ source: 1, state: 1, market: 1, commodity: 1, variety: 1, grade: 1, date: 1 }, { unique: true, partialFilterExpression: { source: 'mandi_api' } });
//# sourceMappingURL=market-price.schema.js.map