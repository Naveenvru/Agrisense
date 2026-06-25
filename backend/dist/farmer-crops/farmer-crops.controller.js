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
exports.FarmerCropsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const farmer_crops_service_1 = require("./farmer-crops.service");
const create_farmer_crop_dto_1 = require("./dto/create-farmer-crop.dto");
const update_farmer_crop_dto_1 = require("./dto/update-farmer-crop.dto");
let FarmerCropsController = class FarmerCropsController {
    farmerCropsService;
    constructor(farmerCropsService) {
        this.farmerCropsService = farmerCropsService;
    }
    async create(req, createDto) {
        const farmerCrop = await this.farmerCropsService.create(req.user.id, createDto);
        return {
            message: 'Farmer crop assigned successfully',
            data: farmerCrop,
        };
    }
    async findAll(req) {
        const farmerCrops = await this.farmerCropsService.findAll(req.user.id);
        return {
            data: farmerCrops,
            count: farmerCrops.length,
        };
    }
    async findOne(id, req) {
        const farmerCrop = await this.farmerCropsService.findOne(id, req.user.id);
        return {
            data: farmerCrop,
        };
    }
    async update(id, req, updateDto) {
        const farmerCrop = await this.farmerCropsService.update(id, req.user.id, updateDto);
        return {
            message: 'Farmer crop updated successfully',
            data: farmerCrop,
        };
    }
    async remove(id, req) {
        await this.farmerCropsService.remove(id, req.user.id);
        return {
            message: 'Farmer crop deleted successfully',
        };
    }
};
exports.FarmerCropsController = FarmerCropsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Assign crop to land parcel' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_farmer_crop_dto_1.CreateFarmerCropDto]),
    __metadata("design:returntype", Promise)
], FarmerCropsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List user farmer crops' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FarmerCropsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get specific farmer crop' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the farmer crop', example: '3' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FarmerCropsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update specific farmer crop' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the farmer crop', example: '3' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_farmer_crop_dto_1.UpdateFarmerCropDto]),
    __metadata("design:returntype", Promise)
], FarmerCropsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete specific farmer crop' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the farmer crop', example: '3' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FarmerCropsController.prototype, "remove", null);
exports.FarmerCropsController = FarmerCropsController = __decorate([
    (0, swagger_1.ApiTags)('Farmer Crops'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('farmer-crops'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [farmer_crops_service_1.FarmerCropsService])
], FarmerCropsController);
//# sourceMappingURL=farmer-crops.controller.js.map