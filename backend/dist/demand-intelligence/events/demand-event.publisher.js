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
var DemandEventPublisher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandEventPublisher = void 0;
const common_1 = require("@nestjs/common");
const event_bus_service_1 = require("../../common/events/event-bus.service");
let DemandEventPublisher = class DemandEventPublisher {
    static { DemandEventPublisher_1 = this; }
    eventBus;
    logger = new common_1.Logger(DemandEventPublisher_1.name);
    static SOURCE = 'demand-intelligence';
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    publishPredicted(result) {
        try {
            const event = this.eventBus.createEvent('demand.predicted', DemandEventPublisher_1.SOURCE, {
                farmerCropId: result.farmerCropId,
                cropName: result.cropName,
                currentDemandKg: result.currentDemandKg,
                expectedDemandKg: result.expectedDemandKg,
                confidence: result.confidence,
                riskLevel: result.risk.level,
                regionLevel: result.regionLevel,
                regionName: result.regionName,
            });
            this.eventBus.publish(event);
            this.logger.debug(`Event published: demand.predicted | farmerCropId=${result.farmerCropId}`);
        }
        catch (err) {
            this.logger.warn(`Failed to publish demand.predicted event: ${err.message}`);
        }
    }
    publishUpdated(result, previousDemandKg) {
        try {
            const event = this.eventBus.createEvent('demand.updated', DemandEventPublisher_1.SOURCE, {
                farmerCropId: result.farmerCropId,
                cropName: result.cropName,
                previousDemandKg,
                currentDemandKg: result.currentDemandKg,
                expectedDemandKg: result.expectedDemandKg,
                confidence: result.confidence,
            });
            this.eventBus.publish(event);
            this.logger.debug(`Event published: demand.updated | farmerCropId=${result.farmerCropId}`);
        }
        catch (err) {
            this.logger.warn(`Failed to publish demand.updated event: ${err.message}`);
        }
    }
    publishWarning(result) {
        try {
            const event = this.eventBus.createEvent('demand.warning', DemandEventPublisher_1.SOURCE, {
                farmerCropId: result.farmerCropId,
                cropName: result.cropName,
                riskLevel: result.risk.level,
                riskScore: result.risk.score,
                riskReasons: result.risk.reasons,
                currentDemandKg: result.currentDemandKg,
            });
            this.eventBus.publish(event);
            this.logger.debug(`Event published: demand.warning | farmerCropId=${result.farmerCropId} risk=${result.risk.level}`);
        }
        catch (err) {
            this.logger.warn(`Failed to publish demand.warning event: ${err.message}`);
        }
    }
    publishCompleted(result, actualDemandKg) {
        try {
            const event = this.eventBus.createEvent('demand.completed', DemandEventPublisher_1.SOURCE, {
                farmerCropId: result.farmerCropId,
                cropName: result.cropName,
                finalDemandKg: actualDemandKg,
                expectedDemandKg: result.expectedDemandKg,
                confidence: result.confidence,
            });
            this.eventBus.publish(event);
            this.logger.debug(`Event published: demand.completed | farmerCropId=${result.farmerCropId}`);
        }
        catch (err) {
            this.logger.warn(`Failed to publish demand.completed event: ${err.message}`);
        }
    }
};
exports.DemandEventPublisher = DemandEventPublisher;
exports.DemandEventPublisher = DemandEventPublisher = DemandEventPublisher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_bus_service_1.EventBusService])
], DemandEventPublisher);
//# sourceMappingURL=demand-event.publisher.js.map