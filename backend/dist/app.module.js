"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_1 = require("@nestjs/mongoose");
const database_config_1 = __importDefault(require("./config/database.config"));
const auth_config_1 = __importDefault(require("./config/auth.config"));
const mongodb_config_1 = __importDefault(require("./mongodb/config/mongodb.config"));
const notifications_config_1 = __importDefault(require("./config/notifications.config"));
const mongodb_module_1 = require("./mongodb/mongodb.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const farmer_profiles_module_1 = require("./farmer-profiles/farmer-profiles.module");
const land_parcels_module_1 = require("./land-parcels/land-parcels.module");
const crops_module_1 = require("./crops/crops.module");
const farmer_crops_module_1 = require("./farmer-crops/farmer-crops.module");
const calendar_module_1 = require("./calendar/calendar.module");
const weather_module_1 = require("./weather/weather.module");
const storage_module_1 = require("./storage/common/storage.module");
const scheduler_module_1 = require("./scheduler/scheduler.module");
const market_module_1 = require("./market/market.module");
const master_data_module_1 = require("./master-data/master-data.module");
const geoboundary_module_1 = require("./geoboundary/geoboundary.module");
const harvest_intelligence_module_1 = require("./harvest-intelligence/harvest-intelligence.module");
const yield_intelligence_module_1 = require("./yield-intelligence/yield-intelligence.module");
const supply_intelligence_module_1 = require("./supply-intelligence/supply-intelligence.module");
const demand_intelligence_module_1 = require("./demand-intelligence/demand-intelligence.module");
const gemini_module_1 = require("./gemini/gemini.module");
const user_entity_1 = require("./users/user.entity");
const farmer_profile_entity_1 = require("./farmer-profiles/farmer-profile.entity");
const land_parcel_entity_1 = require("./land-parcels/land-parcel.entity");
const crop_entity_1 = require("./crops/crop.entity");
const farmer_crop_entity_1 = require("./farmer-crops/farmer-crop.entity");
const calendar_event_entity_1 = require("./calendar/calendar-event.entity");
const crop_calendar_template_entity_1 = require("./calendar/crop-calendar-template.entity");
const notification_preferences_entity_1 = require("./notifications/notification-preferences.entity");
const notification_consent_entity_1 = require("./notifications/notification-consent.entity");
const notification_job_entity_1 = require("./notifications/notification-job.entity");
const notification_attempt_entity_1 = require("./notifications/notification-attempt.entity");
const notifications_module_1 = require("./notifications/notifications.module");
const decision_trace_entity_1 = require("./decision-center/decision-trace.entity");
const decision_center_module_1 = require("./decision-center/decision-center.module");
const report_entity_1 = require("./reports/report.entity");
const reports_module_1 = require("./reports/reports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, auth_config_1.default, mongodb_config_1.default, notifications_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    entities: [
                        user_entity_1.User,
                        farmer_profile_entity_1.FarmerProfile,
                        land_parcel_entity_1.LandParcel,
                        crop_entity_1.Crop,
                        farmer_crop_entity_1.FarmerCrop,
                        calendar_event_entity_1.CalendarEvent,
                        crop_calendar_template_entity_1.CropCalendarTemplate,
                        notification_preferences_entity_1.NotificationPreferences,
                        notification_consent_entity_1.NotificationConsent,
                        notification_job_entity_1.NotificationJob,
                        notification_attempt_entity_1.NotificationAttempt,
                        decision_trace_entity_1.DecisionTrace,
                        report_entity_1.GeneratedReport,
                    ],
                    synchronize: false,
                }),
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('mongodb.uri'),
                    dbName: configService.get('mongodb.database'),
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            farmer_profiles_module_1.FarmerProfilesModule,
            land_parcels_module_1.LandParcelsModule,
            crops_module_1.CropsModule,
            farmer_crops_module_1.FarmerCropsModule,
            calendar_module_1.CalendarModule,
            mongodb_module_1.MongodbModule,
            weather_module_1.WeatherModule,
            storage_module_1.StorageModule,
            scheduler_module_1.SchedulerModule,
            market_module_1.MarketModule,
            master_data_module_1.MasterDataModule,
            geoboundary_module_1.GeoBoundaryModule,
            harvest_intelligence_module_1.HarvestIntelligenceModule,
            yield_intelligence_module_1.YieldIntelligenceModule,
            supply_intelligence_module_1.SupplyIntelligenceModule,
            demand_intelligence_module_1.DemandIntelligenceModule,
            gemini_module_1.GeminiModule,
            notifications_module_1.NotificationsModule,
            decision_center_module_1.DecisionCenterModule,
            reports_module_1.ReportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map