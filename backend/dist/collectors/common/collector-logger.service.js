"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectorLogger = void 0;
const common_1 = require("@nestjs/common");
let CollectorLogger = class CollectorLogger {
    logger = new common_1.Logger('CollectorLayer');
    logCollection(telemetry) {
        const base = `[${telemetry.provider}] ${telemetry.operation}`;
        const timing = `${telemetry.durationMs}ms`;
        const retries = telemetry.retryCount > 0 ? ` | retries=${telemetry.retryCount}` : '';
        if (telemetry.status === 'success') {
            this.logger.log(`${base} ✓ SUCCESS (${timing})${retries}`);
        }
        else if (telemetry.status === 'failed') {
            this.logger.error(`${base} ✗ FAILED (${timing})${retries} | error=${telemetry.errorMessage}`);
        }
        else {
            this.logger.warn(`${base} ⚠ ${telemetry.status.toUpperCase()} (${timing})${retries}`);
        }
    }
    logStart(provider, operation) {
        this.logger.debug(`[${provider}] → Starting collection: ${operation}`);
    }
    logStore(provider, operation, destination) {
        this.logger.debug(`[${provider}] ↓ Storing raw result | operation=${operation} destination=${destination}`);
    }
};
exports.CollectorLogger = CollectorLogger;
exports.CollectorLogger = CollectorLogger = __decorate([
    (0, common_1.Injectable)()
], CollectorLogger);
//# sourceMappingURL=collector-logger.service.js.map