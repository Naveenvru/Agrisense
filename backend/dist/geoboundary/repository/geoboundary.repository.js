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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GeoBoundaryRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoBoundaryRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const geoboundary_cache_schema_1 = require("../../mongodb/geoboundary/geoboundary-cache.schema");
let GeoBoundaryRepository = GeoBoundaryRepository_1 = class GeoBoundaryRepository {
    cacheModel;
    logger = new common_1.Logger(GeoBoundaryRepository_1.name);
    constructor(cacheModel) {
        this.cacheModel = cacheModel;
    }
    async findByCoordinates(latitude, longitude) {
        const record = await this.cacheModel.findOne({ latitude, longitude }).exec();
        if (!record)
            return null;
        return {
            latitude: record.latitude,
            longitude: record.longitude,
            villageName: record.villageName,
            talukName: record.talukName,
            districtName: record.districtName,
            stateName: record.stateName,
            countryName: record.countryName,
            postalCode: record.postalCode,
            villageId: record.villageId,
            talukId: record.talukId,
            districtId: record.districtId,
            stateId: record.stateId,
            provider: record.provider,
            resolvedAt: record.resolvedAt,
        };
    }
    async save(result) {
        await this.cacheModel.updateOne({ latitude: result.latitude, longitude: result.longitude }, { $set: result }, { upsert: true }).exec();
    }
    async findPolygonByAdminUnit(adminLevel, name) {
        const record = await this.cacheModel
            .findOne({
            polygonCacheKey: `${adminLevel}:${name.toLowerCase()}`,
        })
            .exec();
        if (!record || !record.boundaryPolygon)
            return null;
        this.logger.debug(`Polygon cache hit for adminLevel=${adminLevel}, name=${name}`);
        return record.boundaryPolygon;
    }
    async savePolygon(adminLevel, name, polygon) {
        const key = `${adminLevel}:${name.toLowerCase()}`;
        await this.cacheModel.updateOne({ polygonCacheKey: key }, {
            $set: {
                polygonCacheKey: key,
                latitude: 0,
                longitude: 0,
                provider: polygon.properties?.source ?? 'unknown',
                boundaryPolygon: polygon,
                resolvedAt: new Date(),
            },
        }, { upsert: true }).exec();
        this.logger.debug(`Polygon cached for adminLevel=${adminLevel}, name=${name}`);
    }
};
exports.GeoBoundaryRepository = GeoBoundaryRepository;
exports.GeoBoundaryRepository = GeoBoundaryRepository = GeoBoundaryRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(geoboundary_cache_schema_1.GeoBoundaryCache.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GeoBoundaryRepository);
//# sourceMappingURL=geoboundary.repository.js.map