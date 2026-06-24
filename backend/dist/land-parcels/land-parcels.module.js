"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandParcelsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const land_parcel_entity_1 = require("./land-parcel.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
const land_parcels_service_1 = require("./land-parcels.service");
const land_parcels_controller_1 = require("./land-parcels.controller");
let LandParcelsModule = class LandParcelsModule {
};
exports.LandParcelsModule = LandParcelsModule;
exports.LandParcelsModule = LandParcelsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([land_parcel_entity_1.LandParcel, farmer_profile_entity_1.FarmerProfile])],
        controllers: [land_parcels_controller_1.LandParcelsController],
        providers: [land_parcels_service_1.LandParcelsService],
        exports: [land_parcels_service_1.LandParcelsService],
    })
], LandParcelsModule);
//# sourceMappingURL=land-parcels.module.js.map