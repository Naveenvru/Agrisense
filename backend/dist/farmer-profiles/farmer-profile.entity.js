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
exports.FarmerProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const land_parcel_entity_1 = require("../land-parcels/land-parcel.entity");
let FarmerProfile = class FarmerProfile {
    id;
    userId;
    user;
    district;
    state;
    village;
    totalLandArea;
    primarySoilType;
    primaryIrrigationType;
    createdAt;
    updatedAt;
    landParcels;
};
exports.FarmerProfile = FarmerProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], FarmerProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' }),
    __metadata("design:type", String)
], FarmerProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], FarmerProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FarmerProfile.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FarmerProfile.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FarmerProfile.prototype, "village", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_land_area', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FarmerProfile.prototype, "totalLandArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_soil_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FarmerProfile.prototype, "primarySoilType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primary_irrigation_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FarmerProfile.prototype, "primaryIrrigationType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FarmerProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FarmerProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => land_parcel_entity_1.LandParcel, (parcel) => parcel.farmerProfile),
    __metadata("design:type", Array)
], FarmerProfile.prototype, "landParcels", void 0);
exports.FarmerProfile = FarmerProfile = __decorate([
    (0, typeorm_1.Entity)({ name: 'farmer_profiles' })
], FarmerProfile);
//# sourceMappingURL=farmer-profile.entity.js.map