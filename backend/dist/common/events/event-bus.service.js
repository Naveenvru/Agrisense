"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EventBusService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let EventBusService = EventBusService_1 = class EventBusService {
    logger = new common_1.Logger(EventBusService_1.name);
    handlers = new Map();
    totalPublished = 0;
    totalHandled = 0;
    totalFailed = 0;
    async publish(event) {
        this.totalPublished++;
        const subscribers = this.handlers.get(event.type);
        if (!subscribers || subscribers.size === 0) {
            this.logger.debug(`Event published with no subscribers | type=${event.type} id=${event.id}`);
            return;
        }
        this.logger.debug(`Publishing event | type=${event.type} id=${event.id} subscribers=${subscribers.size}`);
        for (const handler of subscribers) {
            try {
                await handler(event);
                this.totalHandled++;
            }
            catch (error) {
                this.totalFailed++;
                this.logger.error(`Event handler failed | type=${event.type} id=${event.id} error=${error?.message}`);
            }
        }
    }
    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }
        this.handlers.get(eventType).add(handler);
        this.logger.log(`Subscribed to event | type=${eventType} | total subscribers for type=${this.handlers.get(eventType).size}`);
    }
    unsubscribe(eventType, handler) {
        const subscribers = this.handlers.get(eventType);
        if (subscribers) {
            subscribers.delete(handler);
            this.logger.log(`Unsubscribed from event | type=${eventType}`);
        }
    }
    status() {
        return {
            totalPublished: this.totalPublished,
            totalHandled: this.totalHandled,
            totalFailed: this.totalFailed,
            subscriberCount: Array.from(this.handlers.values()).reduce((sum, set) => sum + set.size, 0),
            registeredEventTypes: Array.from(this.handlers.keys()),
        };
    }
    createEvent(type, source, payload, correlationId) {
        return {
            type,
            id: (0, crypto_1.randomUUID)(),
            source,
            occurredAt: new Date(),
            payload,
            correlationId,
            version: 1,
        };
    }
};
exports.EventBusService = EventBusService;
exports.EventBusService = EventBusService = EventBusService_1 = __decorate([
    (0, common_1.Injectable)()
], EventBusService);
//# sourceMappingURL=event-bus.service.js.map