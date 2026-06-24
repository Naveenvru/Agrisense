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
exports.LandParcelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const land_parcel_entity_1 = require("./land-parcel.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
let LandParcelsService = class LandParcelsService {
    landParcelsRepository;
    farmerProfilesRepository;
    dataSource;
    constructor(landParcelsRepository, farmerProfilesRepository, dataSource) {
        this.landParcelsRepository = landParcelsRepository;
        this.farmerProfilesRepository = farmerProfilesRepository;
        this.dataSource = dataSource;
    }
    async getFarmerProfileId(userId) {
        const profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Farmer profile not found. Create a farmer profile before managing land parcels.');
        }
        return profile.id;
    }
    async verifyOwnership(parcelId, farmerProfileId) {
        const parcel = await this.landParcelsRepository.findOne({
            where: { id: parcelId },
        });
        if (!parcel) {
            throw new common_1.NotFoundException('Land parcel not found');
        }
        if (parcel.farmerProfileId !== farmerProfileId) {
            throw new common_1.ForbiddenException('You do not have access to this land parcel');
        }
        return parcel;
    }
    buildLocationPoint(longitude, latitude) {
        if (latitude !== undefined && longitude !== undefined) {
            return () => `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;
        }
        return undefined;
    }
    async create(userId, createDto) {
        const farmerProfileId = await this.getFarmerProfileId(userId);
        const locationSql = this.buildLocationPoint(createDto.longitude, createDto.latitude);
        const result = await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(land_parcel_entity_1.LandParcel)
            .values({
            farmerProfileId,
            parcelName: createDto.parcelName || null,
            areaAcres: createDto.areaAcres ?? null,
            soilType: createDto.soilType || null,
            landType: createDto.landType || null,
            irrigationType: createDto.irrigationType || null,
            location: locationSql,
            additionalMetadata: createDto.additionalMetadata || null,
        })
            .returning('id')
            .execute();
        const insertedId = result.generatedMaps[0]?.id ?? result.raw[0]?.id;
        return this.findOneRaw(insertedId);
    }
    async findAllByUser(userId) {
        const farmerProfileId = await this.getFarmerProfileId(userId);
        const parcels = await this.dataSource.query(`SELECT
        id,
        farmer_profile_id AS "farmerProfileId",
        parcel_name AS "parcelName",
        area_acres AS "areaAcres",
        soil_type AS "soilType",
        land_type AS "landType",
        irrigation_type AS "irrigationType",
        ST_Y(location::geometry) AS "latitude",
        ST_X(location::geometry) AS "longitude",
        additional_metadata AS "additionalMetadata",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM farmer_land_parcels
      WHERE farmer_profile_id = $1
      ORDER BY created_at DESC`, [farmerProfileId]);
        return parcels;
    }
    async findOneByUser(parcelId, userId) {
        const farmerProfileId = await this.getFarmerProfileId(userId);
        await this.verifyOwnership(parcelId, farmerProfileId);
        return this.findOneRaw(parcelId);
    }
    async update(parcelId, userId, updateDto) {
        const farmerProfileId = await this.getFarmerProfileId(userId);
        const parcel = await this.verifyOwnership(parcelId, farmerProfileId);
        const setClauses = [];
        const params = [];
        let paramIndex = 1;
        if (updateDto.parcelName !== undefined) {
            setClauses.push(`parcel_name = $${paramIndex++}`);
            params.push(updateDto.parcelName);
        }
        if (updateDto.areaAcres !== undefined) {
            setClauses.push(`area_acres = $${paramIndex++}`);
            params.push(updateDto.areaAcres);
        }
        if (updateDto.soilType !== undefined) {
            setClauses.push(`soil_type = $${paramIndex++}`);
            params.push(updateDto.soilType);
        }
        if (updateDto.landType !== undefined) {
            setClauses.push(`land_type = $${paramIndex++}`);
            params.push(updateDto.landType);
        }
        if (updateDto.irrigationType !== undefined) {
            setClauses.push(`irrigation_type = $${paramIndex++}`);
            params.push(updateDto.irrigationType);
        }
        if (updateDto.latitude !== undefined && updateDto.longitude !== undefined) {
            setClauses.push(`location = ST_SetSRID(ST_MakePoint($${paramIndex++}, $${paramIndex++}), 4326)`);
            params.push(updateDto.longitude, updateDto.latitude);
        }
        if (updateDto.additionalMetadata !== undefined) {
            setClauses.push(`additional_metadata = $${paramIndex++}`);
            params.push(JSON.stringify(updateDto.additionalMetadata));
        }
        if (setClauses.length === 0) {
            return this.findOneRaw(parcelId);
        }
        setClauses.push(`updated_at = NOW()`);
        params.push(parcelId);
        await this.dataSource.query(`UPDATE farmer_land_parcels SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`, params);
        return this.findOneRaw(parcelId);
    }
    async remove(parcelId, userId) {
        const farmerProfileId = await this.getFarmerProfileId(userId);
        await this.verifyOwnership(parcelId, farmerProfileId);
        await this.landParcelsRepository.delete(parcelId);
    }
    async findOneRaw(parcelId) {
        const rows = await this.dataSource.query(`SELECT
        id,
        farmer_profile_id AS "farmerProfileId",
        parcel_name AS "parcelName",
        area_acres AS "areaAcres",
        soil_type AS "soilType",
        land_type AS "landType",
        irrigation_type AS "irrigationType",
        ST_Y(location::geometry) AS "latitude",
        ST_X(location::geometry) AS "longitude",
        additional_metadata AS "additionalMetadata",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM farmer_land_parcels
      WHERE id = $1`, [parcelId]);
        if (!rows.length) {
            throw new common_1.NotFoundException('Land parcel not found');
        }
        return rows[0];
    }
};
exports.LandParcelsService = LandParcelsService;
exports.LandParcelsService = LandParcelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(land_parcel_entity_1.LandParcel)),
    __param(1, (0, typeorm_1.InjectRepository)(farmer_profile_entity_1.FarmerProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LandParcelsService);
//# sourceMappingURL=land-parcels.service.js.map