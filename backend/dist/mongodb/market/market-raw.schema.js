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
exports.MarketRawSchema = exports.MarketRaw = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MarketRaw = class MarketRaw {
    commodity;
    variety;
    market;
    district;
    state;
    date;
    minPrice;
    maxPrice;
    modalPrice;
    arrivalQty;
    unit;
    source;
    rawPayload;
    collectedAt;
    batchId;
};
exports.MarketRaw = MarketRaw;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketRaw.prototype, "commodity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], MarketRaw.prototype, "variety", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketRaw.prototype, "market", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketRaw.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketRaw.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], MarketRaw.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketRaw.prototype, "minPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketRaw.prototype, "maxPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketRaw.prototype, "modalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketRaw.prototype, "arrivalQty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Quintal' }),
    __metadata("design:type", String)
], MarketRaw.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketRaw.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], MarketRaw.prototype, "rawPayload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MarketRaw.prototype, "collectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketRaw.prototype, "batchId", void 0);
exports.MarketRaw = MarketRaw = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'market_raw' })
], MarketRaw);
exports.MarketRawSchema = mongoose_1.SchemaFactory.createForClass(MarketRaw);
exports.MarketRawSchema.index({ commodity: 1, market: 1, date: 1 });
//# sourceMappingURL=market-raw.schema.js.map