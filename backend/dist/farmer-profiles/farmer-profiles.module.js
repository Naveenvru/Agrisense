"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const farmer_profile_entity_1 = require("./farmer-profile.entity");
const user_entity_1 = require("../users/user.entity");
const farmer_profiles_service_1 = require("./farmer-profiles.service");
const farmer_profiles_controller_1 = require("./farmer-profiles.controller");
let FarmerProfilesModule = class FarmerProfilesModule {
};
exports.FarmerProfilesModule = FarmerProfilesModule;
exports.FarmerProfilesModule = FarmerProfilesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([farmer_profile_entity_1.FarmerProfile, user_entity_1.User])],
        controllers: [farmer_profiles_controller_1.FarmerProfilesController],
        providers: [farmer_profiles_service_1.FarmerProfilesService],
        exports: [farmer_profiles_service_1.FarmerProfilesService],
    })
], FarmerProfilesModule);
//# sourceMappingURL=farmer-profiles.module.js.map