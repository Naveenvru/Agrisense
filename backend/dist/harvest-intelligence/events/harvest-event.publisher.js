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
var HarvestEventPublisher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestEventPublisher = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../common/events/event-bus.service");
let HarvestEventPublisher = HarvestEventPublisher_1 = class HarvestEventPublisher {
    eventBus;
    logger = new common_1.Logger(HarvestEventPublisher_1.name);
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async publishPredicted(payload) {
        const event = this.eventBus.createEvent('harvest.predicted', 'HarvestIntelligenceService', payload);
        await this.eventBus.publish(event);
        this.logger.debug(`Event published: harvest.predicted | farmerCropId=${payload.farmerCropId}`);
    }
    async publishUpdated(payload) {
        const event = this.eventBus.createEvent('harvest.updated', 'HarvestIntelligenceService', payload);
        await this.eventBus.publish(event);
        this.logger.debug(`Event published: harvest.updated | farmerCropId=${payload.farmerCropId}`);
    }
    async publishDelayed(payload) {
        const event = this.eventBus.createEvent('harvest.delayed', 'HarvestIntelligenceService', payload);
        await this.eventBus.publish(event);
        this.logger.log(`Event published: harvest.delayed | farmerCropId=${payload.farmerCropId} | delayDays=${payload.delayDays}`);
    }
    async publishCompleted(payload) {
        const event = this.eventBus.createEvent('harvest.completed', 'HarvestIntelligenceService', payload);
        await this.eventBus.publish(event);
        this.logger.log(`Event published: harvest.completed | farmerCropId=${payload.farmerCropId}`);
    }
    async publishReadinessAlert(payload) {
        const event = this.eventBus.createEvent('harvest.readiness.alert', 'HarvestIntelligenceService', payload);
        await this.eventBus.publish(event);
        this.logger.log(`Event published: harvest.readiness.alert | farmerCropId=${payload.farmerCropId}`);
    }
};
exports.HarvestEventPublisher = HarvestEventPublisher;
exports.HarvestEventPublisher = HarvestEventPublisher = HarvestEventPublisher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService])
], HarvestEventPublisher);
//# sourceMappingURL=harvest-event.publisher.js.map