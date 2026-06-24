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
exports.FarmerCropsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const farmer_crop_entity_1 = require("./farmer-crop.entity");
const land_parcel_entity_1 = require("../land-parcels/land-parcel.entity");
const crop_entity_1 = require("../crops/crop.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
let FarmerCropsService = class FarmerCropsService {
    farmerCropsRepository;
    landParcelsRepository;
    cropsRepository;
    farmerProfilesRepository;
    constructor(farmerCropsRepository, landParcelsRepository, cropsRepository, farmerProfilesRepository) {
        this.farmerCropsRepository = farmerCropsRepository;
        this.landParcelsRepository = landParcelsRepository;
        this.cropsRepository = cropsRepository;
        this.farmerProfilesRepository = farmerProfilesRepository;
    }
    async verifyParcelOwnership(parcelId, userId) {
        const profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.ForbiddenException('Farmer profile not found. Cannot manage crops.');
        }
        const parcel = await this.landParcelsRepository.findOne({
            where: { id: parcelId },
        });
        if (!parcel) {
            throw new common_1.NotFoundException('Land parcel not found');
        }
        if (parcel.farmerProfileId !== profile.id) {
            throw new common_1.ForbiddenException('You do not have access to this land parcel');
        }
        return parcel;
    }
    async verifyFarmerCropOwnership(id, userId) {
        const farmerCrop = await this.farmerCropsRepository.findOne({
            where: { id },
            relations: { parcel: true },
        });
        if (!farmerCrop) {
            throw new common_1.NotFoundException('Farmer crop record not found');
        }
        await this.verifyParcelOwnership(farmerCrop.parcelId, userId);
        return farmerCrop;
    }
    async create(userId, createDto) {
        await this.verifyParcelOwnership(createDto.parcelId, userId);
        const crop = await this.cropsRepository.findOne({
            where: { id: createDto.cropId },
        });
        if (!crop) {
            throw new common_1.NotFoundException('Crop not found in master catalog');
        }
        const farmerCrop = this.farmerCropsRepository.create({
            parcelId: createDto.parcelId,
            cropId: createDto.cropId,
            cropVariety: createDto.cropVariety || null,
            sowingDate: createDto.sowingDate ? new Date(createDto.sowingDate) : null,
            expectedHarvestDate: createDto.expectedHarvestDate ? new Date(createDto.expectedHarvestDate) : null,
            estimatedYieldKg: createDto.estimatedYieldKg ?? null,
            actualYieldKg: createDto.actualYieldKg ?? null,
        });
        const savedCrop = await this.farmerCropsRepository.save(farmerCrop);
        return this.findOne(savedCrop.id, userId);
    }
    async findAll(userId) {
        const profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            return [];
        }
        return this.farmerCropsRepository.find({
            where: {
                parcel: {
                    farmerProfileId: profile.id,
                },
            },
            relations: {
                parcel: true,
                crop: true,
            },
            order: {
                createdAt: 'DESC',
            },
            select: {
                parcel: {
                    id: true,
                    parcelName: true,
                    areaAcres: true,
                },
                crop: {
                    id: true,
                    cropName: true,
                    scientificName: true,
                    season: true,
                },
            },
        });
    }
    async findOne(id, userId) {
        await this.verifyFarmerCropOwnership(id, userId);
        const farmerCrop = await this.farmerCropsRepository.findOne({
            where: { id },
            relations: {
                parcel: true,
                crop: true,
            },
            select: {
                parcel: {
                    id: true,
                    parcelName: true,
                    areaAcres: true,
                },
                crop: {
                    id: true,
                    cropName: true,
                    scientificName: true,
                    season: true,
                },
            },
        });
        if (!farmerCrop) {
            throw new common_1.NotFoundException('Farmer crop record not found');
        }
        return farmerCrop;
    }
    async update(id, userId, updateDto) {
        const farmerCrop = await this.verifyFarmerCropOwnership(id, userId);
        if (updateDto.cropVariety !== undefined)
            farmerCrop.cropVariety = updateDto.cropVariety;
        if (updateDto.sowingDate !== undefined)
            farmerCrop.sowingDate = updateDto.sowingDate ? new Date(updateDto.sowingDate) : null;
        if (updateDto.expectedHarvestDate !== undefined)
            farmerCrop.expectedHarvestDate = updateDto.expectedHarvestDate ? new Date(updateDto.expectedHarvestDate) : null;
        if (updateDto.estimatedYieldKg !== undefined)
            farmerCrop.estimatedYieldKg = updateDto.estimatedYieldKg;
        if (updateDto.actualYieldKg !== undefined)
            farmerCrop.actualYieldKg = updateDto.actualYieldKg;
        if (updateDto.status !== undefined)
            farmerCrop.status = updateDto.status;
        await this.farmerCropsRepository.save(farmerCrop);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        await this.verifyFarmerCropOwnership(id, userId);
        await this.farmerCropsRepository.delete(id);
    }
};
exports.FarmerCropsService = FarmerCropsService;
exports.FarmerCropsService = FarmerCropsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(farmer_crop_entity_1.FarmerCrop)),
    __param(1, (0, typeorm_1.InjectRepository)(land_parcel_entity_1.LandParcel)),
    __param(2, (0, typeorm_1.InjectRepository)(crop_entity_1.Crop)),
    __param(3, (0, typeorm_1.InjectRepository)(farmer_profile_entity_1.FarmerProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FarmerCropsService);
//# sourceMappingURL=farmer-crops.service.js.map