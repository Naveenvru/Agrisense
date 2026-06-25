"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const land_parcel_entity_1 = require("../land-parcels/land-parcel.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
const mongodb_module_1 = require("../mongodb/mongodb.module");
const integration_module_1 = require("../integrations/common/integration.module");
const collector_module_1 = require("../collectors/common/collector.module");
const weather_controller_1 = require("./weather.controller");
const weather_service_1 = require("./weather.service");
const weather_api_service_1 = require("./weather-api.service");
let WeatherModule = class WeatherModule {
};
exports.WeatherModule = WeatherModule;
exports.WeatherModule = WeatherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([land_parcel_entity_1.LandParcel, farmer_profile_entity_1.FarmerProfile]),
            mongodb_module_1.MongodbModule,
            integration_module_1.IntegrationModule,
            collector_module_1.CollectorModule,
        ],
        controllers: [weather_controller_1.WeatherController],
        providers: [
            weather_api_service_1.WeatherApiService,
            weather_service_1.WeatherService,
        ],
        exports: [weather_service_1.WeatherService, weather_api_service_1.WeatherApiService],
    })
], WeatherModule);
//# sourceMappingURL=weather.module.js.map