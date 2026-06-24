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
exports.FarmerProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const farmer_profiles_service_1 = require("./farmer-profiles.service");
const create_farmer_profile_dto_1 = require("./dto/create-farmer-profile.dto");
const update_farmer_profile_dto_1 = require("./dto/update-farmer-profile.dto");
let FarmerProfilesController = class FarmerProfilesController {
    farmerProfilesService;
    constructor(farmerProfilesService) {
        this.farmerProfilesService = farmerProfilesService;
    }
    async create(req, createDto) {
        const profile = await this.farmerProfilesService.create(req.user.id, createDto);
        return {
            message: 'Farmer profile created successfully',
            data: profile,
        };
    }
    async getMyProfile(req) {
        const profile = await this.farmerProfilesService.findByUserId(req.user.id);
        if (profile.user) {
            const { passwordHash, ...safeUser } = profile.user;
            return {
                data: { ...profile, user: safeUser },
            };
        }
        return { data: profile };
    }
    async updateMyProfile(req, updateDto) {
        const profile = await this.farmerProfilesService.update(req.user.id, updateDto);
        return {
            message: 'Farmer profile updated successfully',
            data: profile,
        };
    }
};
exports.FarmerProfilesController = FarmerProfilesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create farmer profile' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_farmer_profile_dto_1.CreateFarmerProfileDto]),
    __metadata("design:returntype", Promise)
], FarmerProfilesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get current user farmer profile' }),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FarmerProfilesController.prototype, "getMyProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update current user farmer profile' }),
    (0, common_1.Put)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_farmer_profile_dto_1.UpdateFarmerProfileDto]),
    __metadata("design:returntype", Promise)
], FarmerProfilesController.prototype, "updateMyProfile", null);
exports.FarmerProfilesController = FarmerProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Farmer Profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('farmer-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [farmer_profiles_service_1.FarmerProfilesService])
], FarmerProfilesController);
//# sourceMappingURL=farmer-profiles.controller.js.map