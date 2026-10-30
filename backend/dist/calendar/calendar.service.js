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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const calendar_event_entity_1 = require("./calendar-event.entity");
const crop_calendar_template_entity_1 = require("./crop-calendar-template.entity");
const farmer_crop_entity_1 = require("../farmer-crops/farmer-crop.entity");
const farmer_profile_entity_1 = require("../farmer-profiles/farmer-profile.entity");
let CalendarService = class CalendarService {
    calendarEventsRepository;
    templatesRepository;
    farmerCropsRepository;
    farmerProfilesRepository;
    constructor(calendarEventsRepository, templatesRepository, farmerCropsRepository, farmerProfilesRepository) {
        this.calendarEventsRepository = calendarEventsRepository;
        this.templatesRepository = templatesRepository;
        this.farmerCropsRepository = farmerCropsRepository;
        this.farmerProfilesRepository = farmerProfilesRepository;
    }
    async getVerifiedFarmerCrop(farmerCropId, userId) {
        const profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.ForbiddenException('Farmer profile not found.');
        }
        const farmerCrop = await this.farmerCropsRepository.findOne({
            where: { id: farmerCropId },
            relations: { parcel: true },
        });
        if (!farmerCrop) {
            throw new common_1.NotFoundException('Farmer crop record not found');
        }
        if (farmerCrop.parcel.farmerProfileId !== profile.id) {
            throw new common_1.ForbiddenException('You do not have access to this farmer crop');
        }
        return farmerCrop;
    }
    async getVerifiedCalendarEvent(eventId, userId) {
        const event = await this.calendarEventsRepository.findOne({
            where: { id: eventId },
            relations: {
                farmerCrop: {
                    parcel: true,
                    crop: true,
                },
            },
        });
        if (!event) {
            throw new common_1.NotFoundException('Calendar event not found');
        }
        const profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (!profile || event.farmerCrop.parcel.farmerProfileId !== profile.id) {
            throw new common_1.ForbiddenException('You do not have access to this calendar event');
        }
        return event;
    }
    async generate(farmerCropId, userId) {
        const farmerCrop = await this.getVerifiedFarmerCrop(farmerCropId, userId);
        if (!farmerCrop.sowingDate) {
            throw new common_1.BadRequestException('Sowing date must be set on the farmer crop to generate a calendar');
        }
        const existingEventsCount = await this.calendarEventsRepository.count({
            where: { farmerCropId, sourceConditionId: (0, typeorm_3.IsNull)() },
        });
        if (existingEventsCount > 0)
            return { message: 'Calendar already exists for this crop cycle', count: existingEventsCount };
        const templates = await this.templatesRepository.find({
            where: { cropId: farmerCrop.cropId },
        });
        if (templates.length === 0) {
            throw new common_1.NotFoundException('No calendar templates found for this crop type');
        }
        const sowingDate = new Date(farmerCrop.sowingDate);
        const eventsToCreate = templates.map((template) => {
            const eventDate = new Date(sowingDate);
            eventDate.setDate(eventDate.getDate() + template.dayOffset);
            return this.calendarEventsRepository.create({
                farmerCropId,
                eventDate,
                taskName: template.taskName,
                taskDescription: template.taskDescription,
            });
        });
        await this.calendarEventsRepository.save(eventsToCreate);
        return {
            message: 'Calendar events generated successfully',
            count: eventsToCreate.length,
        };
    }
    async findAll(userId) {
        const profile = await this.farmerProfilesRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            return [];
        }
        return this.calendarEventsRepository.find({
            where: {
                farmerCrop: {
                    status: farmer_crop_entity_1.CropStatus.ACTIVE,
                    parcel: {
                        farmerProfileId: profile.id,
                    },
                },
            },
            relations: {
                farmerCrop: {
                    parcel: true,
                    crop: true,
                },
            },
            order: {
                eventDate: 'ASC',
            },
            select: {
                id: true,
                eventDate: true,
                taskName: true,
                taskDescription: true,
                isCompleted: true,
                completedAt: true,
                generatedByWeather: true,
                generatedByAi: true,
                farmerCrop: {
                    id: true,
                    cropVariety: true,
                    parcel: {
                        id: true,
                        parcelName: true,
                    },
                    crop: {
                        id: true,
                        cropName: true,
                    },
                },
            },
        });
    }
    async findForCropCycle(farmerCropId, userId) {
        await this.getVerifiedFarmerCrop(farmerCropId, userId);
        return this.calendarEventsRepository.find({
            where: { farmerCropId },
            relations: { farmerCrop: { parcel: true, crop: true } },
            order: { eventDate: 'ASC' },
            select: {
                id: true, eventDate: true, taskName: true, taskDescription: true,
                isCompleted: true, completedAt: true, sourceConditionId: true,
                generatedByAi: true,
                farmerCrop: {
                    id: true, cropVariety: true,
                    parcel: { id: true, parcelName: true },
                    crop: { id: true, cropName: true },
                },
            },
        });
    }
    async findOne(id, userId) {
        const event = await this.getVerifiedCalendarEvent(id, userId);
        return this.calendarEventsRepository.findOneOrFail({
            where: { id: event.id },
            relations: {
                farmerCrop: {
                    parcel: true,
                    crop: true,
                },
            },
            select: {
                id: true,
                eventDate: true,
                taskName: true,
                taskDescription: true,
                isCompleted: true,
                completedAt: true,
                generatedByWeather: true,
                generatedByAi: true,
                farmerCrop: {
                    id: true,
                    cropVariety: true,
                    parcel: {
                        id: true,
                        parcelName: true,
                    },
                    crop: {
                        id: true,
                        cropName: true,
                    },
                },
            },
        });
    }
    async complete(id, userId) {
        const event = await this.getVerifiedCalendarEvent(id, userId);
        if (event.isCompleted) {
            throw new common_1.BadRequestException('Event is already marked as completed');
        }
        event.isCompleted = true;
        event.completedAt = new Date();
        await this.calendarEventsRepository.save(event);
        return this.findOne(id, userId);
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __param(1, (0, typeorm_1.InjectRepository)(crop_calendar_template_entity_1.CropCalendarTemplate)),
    __param(2, (0, typeorm_1.InjectRepository)(farmer_crop_entity_1.FarmerCrop)),
    __param(3, (0, typeorm_1.InjectRepository)(farmer_profile_entity_1.FarmerProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map