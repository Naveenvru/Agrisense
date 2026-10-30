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
exports.FarmerCrop = exports.CropStatus = void 0;
const typeorm_1 = require("typeorm");
const land_parcel_entity_1 = require("../land-parcels/land-parcel.entity");
const crop_entity_1 = require("../crops/crop.entity");
var CropStatus;
(function (CropStatus) {
    CropStatus["ACTIVE"] = "active";
    CropStatus["HARVESTED"] = "harvested";
    CropStatus["FAILED"] = "failed";
})(CropStatus || (exports.CropStatus = CropStatus = {}));
let FarmerCrop = class FarmerCrop {
    id;
    parcelId;
    cropId;
    parcel;
    crop;
    cropVariety;
    sowingDate;
    expectedHarvestDate;
    estimatedYieldKg;
    actualYieldKg;
    status;
    createdAt;
    updatedAt;
};
exports.FarmerCrop = FarmerCrop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], FarmerCrop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parcel_id', type: 'bigint' }),
    __metadata("design:type", String)
], FarmerCrop.prototype, "parcelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crop_id', type: 'bigint' }),
    __metadata("design:type", String)
], FarmerCrop.prototype, "cropId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => land_parcel_entity_1.LandParcel, (parcel) => parcel.farmerCrops),
    (0, typeorm_1.JoinColumn)({ name: 'parcel_id' }),
    __metadata("design:type", land_parcel_entity_1.LandParcel)
], FarmerCrop.prototype, "parcel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crop_entity_1.Crop),
    (0, typeorm_1.JoinColumn)({ name: 'crop_id' }),
    __metadata("design:type", crop_entity_1.Crop)
], FarmerCrop.prototype, "crop", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crop_variety', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FarmerCrop.prototype, "cropVariety", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sowing_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], FarmerCrop.prototype, "sowingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_harvest_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], FarmerCrop.prototype, "expectedHarvestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_yield_kg', type: 'numeric', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FarmerCrop.prototype, "estimatedYieldKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_yield_kg', type: 'numeric', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], FarmerCrop.prototype, "actualYieldKg", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CropStatus,
        enumName: 'crop_status',
        default: CropStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], FarmerCrop.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FarmerCrop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], FarmerCrop.prototype, "updatedAt", void 0);
exports.FarmerCrop = FarmerCrop = __decorate([
    (0, typeorm_1.Entity)({ name: 'farmer_crops' })
], FarmerCrop);
//# sourceMappingURL=farmer-crop.entity.js.map