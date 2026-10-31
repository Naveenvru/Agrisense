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
exports.MarketArrivalSchema = exports.MarketArrival = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MarketArrival = class MarketArrival {
    commodity;
    market;
    district;
    state;
    date;
    arrivalQty;
    unit;
    source;
    variety;
};
exports.MarketArrival = MarketArrival;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketArrival.prototype, "commodity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], MarketArrival.prototype, "market", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketArrival.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketArrival.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], MarketArrival.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MarketArrival.prototype, "arrivalQty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Quintal' }),
    __metadata("design:type", String)
], MarketArrival.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MarketArrival.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MarketArrival.prototype, "variety", void 0);
exports.MarketArrival = MarketArrival = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'market_arrivals' })
], MarketArrival);
exports.MarketArrivalSchema = mongoose_1.SchemaFactory.createForClass(MarketArrival);
exports.MarketArrivalSchema.index({ commodity: 1, market: 1, date: -1 });
exports.MarketArrivalSchema.index({ source: 1, state: 1, market: 1, commodity: 1, variety: 1, date: 1 }, { unique: true, partialFilterExpression: { source: 'mandi_api' } });
//# sourceMappingURL=market-arrival.schema.js.map