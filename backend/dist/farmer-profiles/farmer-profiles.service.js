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
exports.FarmerProfilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const farmer_profile_entity_1 = require("./farmer-profile.entity");
const user_entity_1 = require("../users/user.entity");
let FarmerProfilesService = class FarmerProfilesService {
    farmerProfilesRepository;
    usersRepository;
    constructor(farmerProfilesRepository, usersRepository) {
        this.farmerProfilesRepository = farmerProfilesRepository;
        this.usersRepository = usersRepository;
    }
    async create(userId, createDto) {
        const existing = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (existing) {
            throw new common_1.ConflictException('Farmer profile already exists for this user');
        }
        const profile = this.farmerProfilesRepository.create({
            userId,
            district: createDto.district || null,
            state: createDto.state || null,
            village: createDto.village || null,
            totalLandArea: createDto.totalLandArea ?? null,
            primarySoilType: createDto.primarySoilType || null,
            primaryIrrigationType: createDto.primaryIrrigationType || null,
        });
        return this.farmerProfilesRepository.save(profile);
    }
    async findByUserId(userId) {
        let profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
            relations: { user: true },
        });
        if (!profile) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            profile = this.farmerProfilesRepository.create({
                userId,
                district: null,
                state: null,
                village: null,
                totalLandArea: 0,
            });
            await this.farmerProfilesRepository.save(profile);
            if (user) {
                profile.user = user;
            }
        }
        return profile;
    }
    async update(userId, updateDto) {
        let profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
            relations: { user: true },
        });
        if (!profile) {
            profile = await this.findByUserId(userId);
        }
        if (updateDto.district !== undefined)
            profile.district = updateDto.district;
        if (updateDto.state !== undefined)
            profile.state = updateDto.state;
        if (updateDto.village !== undefined)
            profile.village = updateDto.village;
        if (updateDto.totalLandArea !== undefined)
            profile.totalLandArea = updateDto.totalLandArea;
        if (updateDto.primarySoilType !== undefined)
            profile.primarySoilType = updateDto.primarySoilType;
        if (updateDto.primaryIrrigationType !== undefined)
            profile.primaryIrrigationType = updateDto.primaryIrrigationType;
        const savedProfile = await this.farmerProfilesRepository.save(profile);
        const phone = updateDto.phoneNumber || updateDto.phone;
        const lang = updateDto.preferredLanguage || updateDto.language;
        const userUpdates = {};
        if (updateDto.name !== undefined)
            userUpdates.name = updateDto.name;
        if (phone !== undefined)
            userUpdates.phoneNumber = phone;
        if (lang !== undefined)
            userUpdates.preferredLanguage = lang;
        if (Object.keys(userUpdates).length > 0) {
            await this.usersRepository.update(userId, userUpdates);
            const updatedUser = await this.usersRepository.findOne({ where: { id: userId } });
            if (updatedUser) {
                savedProfile.user = updatedUser;
            }
        }
        return savedProfile;
    }
};
exports.FarmerProfilesService = FarmerProfilesService;
exports.FarmerProfilesService = FarmerProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(farmer_profile_entity_1.FarmerProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FarmerProfilesService);
//# sourceMappingURL=farmer-profiles.service.js.map