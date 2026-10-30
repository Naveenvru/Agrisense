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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const calendar_service_1 = require("./calendar.service");
let CalendarController = class CalendarController {
    calendarService;
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    async generate(farmerCropId, req) {
        const result = await this.calendarService.generate(farmerCropId, req.user.id);
        return {
            message: result.message,
            data: {
                eventsGenerated: result.count,
            },
        };
    }
    async findAll(req) {
        const events = await this.calendarService.findAll(req.user.id);
        return { data: events, count: events.length };
    }
    async findAllEvents(req) {
        const events = await this.calendarService.findAll(req.user.id);
        return {
            data: events,
            count: events.length,
        };
    }
    async findCropCycleEvents(farmerCropId, req) {
        const events = await this.calendarService.findForCropCycle(farmerCropId, req.user.id);
        return { data: events, count: events.length };
    }
    async findOneEvent(id, req) {
        const event = await this.calendarService.findOne(id, req.user.id);
        return {
            data: event,
        };
    }
    async completeEvent(id, req) {
        const event = await this.calendarService.complete(id, req.user.id);
        return {
            message: 'Event marked as completed',
            data: event,
        };
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Generate calendar events for a farmer crop' }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'ID of the farmer crop', example: '3' }),
    (0, common_1.Post)('generate/:farmerCropId'),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "generate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List calendar events for the signed-in farmer’s active crop cycles' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List calendar events' }),
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findAllEvents", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'List calendar events for a specific crop cycle, including its history' }),
    (0, common_1.Get)('crop-cycles/:farmerCropId/events'),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findCropCycleEvents", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get specific calendar event' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the calendar event', example: '3' }),
    (0, common_1.Get)('events/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "findOneEvent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Complete a specific calendar event' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID of the calendar event', example: '3' }),
    (0, common_1.Patch)('events/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "completeEvent", null);
exports.CalendarController = CalendarController = __decorate([
    (0, swagger_1.ApiTags)('Calendar'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('calendar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map