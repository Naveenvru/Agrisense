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
exports.SupplyEventPublisher = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../common/events/event-bus.service");
let SupplyEventPublisher = class SupplyEventPublisher {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async publishPredicted(payload) {
        await this.eventBus.publish(this.eventBus.createEvent('supply.predicted', 'SupplyIntelligenceService', payload));
    }
    async publishUpdated(payload) {
        await this.eventBus.publish(this.eventBus.createEvent('supply.updated', 'SupplyIntelligenceService', payload));
    }
    async publishWarning(payload) {
        await this.eventBus.publish(this.eventBus.createEvent('supply.warning', 'SupplyIntelligenceService', payload));
    }
    async publishCompleted(payload) {
        await this.eventBus.publish(this.eventBus.createEvent('supply.completed', 'SupplyIntelligenceService', payload));
    }
};
exports.SupplyEventPublisher = SupplyEventPublisher;
exports.SupplyEventPublisher = SupplyEventPublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService])
], SupplyEventPublisher);
//# sourceMappingURL=supply-event.publisher.js.map