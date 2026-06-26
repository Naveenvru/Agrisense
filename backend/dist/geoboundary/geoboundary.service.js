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
var GeoBoundaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoBoundaryService = void 0;
const common_1 = require("@nestjs/common");
const geoboundary_repository_1 = require("./repository/geoboundary.repository");
const geoboundary_provider_interface_1 = require("./providers/geoboundary-provider.interface");
const hash_map_service_1 = require("../master-data/data-structures/hash-map.service");
let GeoBoundaryService = GeoBoundaryService_1 = class GeoBoundaryService {
    repository;
    provider;
    hashMapService;
    logger = new common_1.Logger(GeoBoundaryService_1.name);
    coordinateCache = new Map();
    constructor(repository, provider, hashMapService) {
        this.repository = repository;
        this.provider = provider;
        this.hashMapService = hashMapService;
    }
    async resolveLocation(latitude, longitude) {
        this.logger.log(`Resolving location for lat=${latitude}, lon=${longitude}`);
        const cacheKey = `${latitude},${longitude}`;
        if (this.coordinateCache.has(cacheKey)) {
            this.logger.debug(`L1 Cache hit for ${cacheKey}`);
            return this.coordinateCache.get(cacheKey);
        }
        const dbCachedResult = await this.repository.findByCoordinates(latitude, longitude);
        if (dbCachedResult) {
            this.logger.debug(`L2 DB Cache hit for ${cacheKey}`);
            this.coordinateCache.set(cacheKey, dbCachedResult);
            return dbCachedResult;
        }
        this.logger.debug(`Cache miss for ${cacheKey}. Calling Provider...`);
        const providerResult = await this.provider.reverseGeocode(latitude, longitude);
        const resolvedResult = {
            latitude,
            longitude,
            ...providerResult,
            resolvedAt: new Date(),
        };
        if (providerResult.stateName) {
            resolvedResult.stateId = this.hashMapService.getStateId(providerResult.stateName);
        }
        if (providerResult.districtName) {
            resolvedResult.districtId = this.hashMapService.getDistrictId(providerResult.districtName);
        }
        await this.repository.save(resolvedResult);
        this.coordinateCache.set(cacheKey, resolvedResult);
        return resolvedResult;
    }
    healthCheck() {
        this.logger.log('GeoBoundaryService health check called');
        return { status: 'initialising', module: 'geoboundary' };
    }
};
exports.GeoBoundaryService = GeoBoundaryService;
exports.GeoBoundaryService = GeoBoundaryService = GeoBoundaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(geoboundary_provider_interface_1.GEOBOUNDARY_PROVIDER)),
    __metadata("design:paramtypes", [geoboundary_repository_1.GeoBoundaryRepository, Object, hash_map_service_1.HashMapService])
], GeoBoundaryService);
//# sourceMappingURL=geoboundary.service.js.map