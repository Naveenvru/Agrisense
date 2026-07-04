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
exports.GeoBoundaryCacheSchema = exports.GeoBoundaryCache = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let GeoBoundaryCache = class GeoBoundaryCache extends mongoose_2.Document {
    latitude;
    longitude;
    villageName;
    talukName;
    districtName;
    stateName;
    countryName;
    postalCode;
    villageId;
    talukId;
    districtId;
    stateId;
    boundaryPolygon;
    provider;
    polygonCacheKey;
    resolvedAt;
};
exports.GeoBoundaryCache = GeoBoundaryCache;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], GeoBoundaryCache.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], GeoBoundaryCache.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "villageName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "talukName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "districtName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "stateName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "countryName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "postalCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "villageId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "talukId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "districtId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "stateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], GeoBoundaryCache.prototype, "boundaryPolygon", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], GeoBoundaryCache.prototype, "polygonCacheKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], GeoBoundaryCache.prototype, "resolvedAt", void 0);
exports.GeoBoundaryCache = GeoBoundaryCache = __decorate([
    (0, mongoose_1.Schema)({ collection: 'geoboundary_cache', timestamps: true })
], GeoBoundaryCache);
exports.GeoBoundaryCacheSchema = mongoose_1.SchemaFactory.createForClass(GeoBoundaryCache);
exports.GeoBoundaryCacheSchema.index({ latitude: 1, longitude: 1 }, { unique: true });
exports.GeoBoundaryCacheSchema.index({ polygonCacheKey: 1 }, { unique: true, sparse: true });
//# sourceMappingURL=geoboundary-cache.schema.js.map