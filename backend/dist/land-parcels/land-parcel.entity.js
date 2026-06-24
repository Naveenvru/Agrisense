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
exports.LandParcel = void 0;
const typeorm_1 = require("typeorm");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
const farmer_crop_entity_1 = require("../farmer-crops/farmer-crop.entity");
let LandParcel = class LandParcel {
    id;
    farmerProfileId;
    farmerProfile;
    parcelName;
    areaAcres;
    soilType;
    landType;
    irrigationType;
    location;
    additionalMetadata;
    createdAt;
    updatedAt;
    farmerCrops;
};
exports.LandParcel = LandParcel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], LandParcel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'farmer_profile_id', type: 'bigint' }),
    __metadata("design:type", String)
], LandParcel.prototype, "farmerProfileId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farmer_profile_entity_1.FarmerProfile),
    (0, typeorm_1.JoinColumn)({ name: 'farmer_profile_id' }),
    __metadata("design:type", farmer_profile_entity_1.FarmerProfile)
], LandParcel.prototype, "farmerProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parcel_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], LandParcel.prototype, "parcelName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'area_acres', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], LandParcel.prototype, "areaAcres", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'soil_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], LandParcel.prototype, "soilType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'land_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], LandParcel.prototype, "landType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'irrigation_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], LandParcel.prototype, "irrigationType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], LandParcel.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'additional_metadata', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], LandParcel.prototype, "additionalMetadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], LandParcel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], LandParcel.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farmer_crop_entity_1.FarmerCrop, (farmerCrop) => farmerCrop.parcel),
    __metadata("design:type", Array)
], LandParcel.prototype, "farmerCrops", void 0);
exports.LandParcel = LandParcel = __decorate([
    (0, typeorm_1.Entity)({ name: 'farmer_land_parcels' })
], LandParcel);
//# sourceMappingURL=land-parcel.entity.js.map