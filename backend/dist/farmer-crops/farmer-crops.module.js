"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerCropsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const farmer_crop_entity_1 = require("./farmer-crop.entity");
const farmer_crops_service_1 = require("./farmer-crops.service");
const farmer_crops_controller_1 = require("./farmer-crops.controller");
const land_parcel_entity_1 = require("../land-parcels/land-parcel.entity");
const crop_entity_1 = require("../crops/crop.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
let FarmerCropsModule = class FarmerCropsModule {
};
exports.FarmerCropsModule = FarmerCropsModule;
exports.FarmerCropsModule = FarmerCropsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([farmer_crop_entity_1.FarmerCrop, land_parcel_entity_1.LandParcel, crop_entity_1.Crop, farmer_profile_entity_1.FarmerProfile])],
        controllers: [farmer_crops_controller_1.FarmerCropsController],
        providers: [farmer_crops_service_1.FarmerCropsService],
        exports: [farmer_crops_service_1.FarmerCropsService],
    })
], FarmerCropsModule);
//# sourceMappingURL=farmer-crops.module.js.map