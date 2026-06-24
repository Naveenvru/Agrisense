"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const calendar_event_entity_1 = require("./calendar-event.entity");
const crop_calendar_template_entity_1 = require("./crop-calendar-template.entity");
const farmer_crop_entity_1 = require("../farmer-crops/farmer-crop.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
const calendar_service_1 = require("./calendar.service");
const calendar_controller_1 = require("./calendar.controller");
let CalendarModule = class CalendarModule {
};
exports.CalendarModule = CalendarModule;
exports.CalendarModule = CalendarModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                calendar_event_entity_1.CalendarEvent,
                crop_calendar_template_entity_1.CropCalendarTemplate,
                farmer_crop_entity_1.FarmerCrop,
                farmer_profile_entity_1.FarmerProfile,
            ]),
        ],
        controllers: [calendar_controller_1.CalendarController],
        providers: [calendar_service_1.CalendarService],
        exports: [calendar_service_1.CalendarService],
    })
], CalendarModule);
//# sourceMappingURL=calendar.module.js.map