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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandParcelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const land_parcels_service_1 = require("./land-parcels.service");
const create_land_parcel_dto_1 = require("./dto/create-land-parcel.dto");
const update_land_parcel_dto_1 = require("./dto/update-land-parcel.dto");
let LandParcelsController = class LandParcelsController {
    landParcelsService;
    constructor(landParcelsService) {
        this.landParcelsService = landParcelsService;
    }
    async previewArea(body) {
        return { data: await this.landParcelsService.previewArea(body?.boundaryGeoJson) };
    }
    async findNearby(req, latitude, longitude, radiusMeters = '10000') {
        return {
            data: await this.landParcelsService.findNearby(req.user.id, Number(latitude), Number(longitude), Number(radiusMeters)),
        };
    }
    async findContaining(req, latitude, longitude) {
        return { data: await this.landParcelsService.findContaining(req.user.id, Number(latitude), Number(longitude)) };
    }
    async create(req, createDto) {
        const parcel = await this.landParcelsService.create(req.user.id, createDto);
        return {
            message: 'Land parcel created successfully',
            data: parcel,
        };
    }
    async findAll(req) {
        const parcels = await this.landParcelsService.findAllByUser(req.user.id);
        return {
            data: parcels,
            count: parcels.length,
        };
    }
    async findOne(id, req) {
        const parcel = await this.landParcelsService.findOneByUser(id, req.user.id);
        return {
            data: parcel,
        };
    }
    async overlapSummary(id, req) {
        return { data: await this.landParcelsService.overlapSummary(id, req.user.id) };
    }
    async update(id, req, updateDto) {
        const parcel = await this.landParcelsService.update(id, req.user.id, updateDto);
        return {
            message: 'Land parcel updated successfully',
            data: parcel,
        };
    }
    async remove(id, req) {
        await this.landParcelsService.remove(id, req.user.id);
        return {
            message: 'Land parcel deleted successfully',
        };
    }
};
exports.LandParcelsController = LandParcelsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Calculate area and centroid for a GeoJSON farm boundary using PostGIS' }),
    (0, common_1.Post)('area-preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "previewArea", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find the signed-in farmer’s own parcels within a radius' }),
    (0, common_1.Get)('spatial/nearby'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('latitude')),
    __param(2, (0, common_1.Query)('longitude')),
    __param(3, (0, common_1.Query)('radiusMeters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "findNearby", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find the signed-in farmer’s parcels containing a coordinate (boundary inclusive)' }),
    (0, common_1.Get)('spatial/containing'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('latitude')),
    __param(2, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "findContaining", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create land parcel' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_land_parcel_dto_1.CreateLandParcelDto]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List user land parcels' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific land parcel' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the land parcel', example: '3' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check for potential boundary overlaps with other parcels; does not expose their details' }),
    (0, common_1.Get)(':id/overlap-summary'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "overlapSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a specific land parcel' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the land parcel', example: '3' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_land_parcel_dto_1.UpdateLandParcelDto]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific land parcel' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the land parcel', example: '3' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LandParcelsController.prototype, "remove", null);
exports.LandParcelsController = LandParcelsController = __decorate([
    (0, swagger_1.ApiTags)('Land Parcels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('land-parcels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [land_parcels_service_1.LandParcelsService])
], LandParcelsController);
//# sourceMappingURL=land-parcels.controller.js.map