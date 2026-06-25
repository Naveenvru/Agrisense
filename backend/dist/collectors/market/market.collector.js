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
var MarketCollector_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketCollector = void 0;
const common_1 = require("@nestjs/common");
const collector_logger_service_1 = require("../common/collector-logger.service");
const collector_constants_1 = require("../common/collector.constants");
const integration_constants_1 = require("../../integrations/common/integration.constants");
let MarketCollector = MarketCollector_1 = class MarketCollector {
    collectorLogger;
    logger = new common_1.Logger(MarketCollector_1.name);
    totalCollections = 0;
    successCount = 0;
    failureCount = 0;
    constructor(collectorLogger) {
        this.collectorLogger = collectorLogger;
    }
    async collect(_params) {
        this.logger.warn('MarketCollector.collect() — not yet implemented (Phase 9).');
        this.totalCollections++;
        this.failureCount++;
        return {
            domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.MARKET,
            operation: collector_constants_1.COLLECTOR_CONSTANTS.OPERATIONS.MARKET_PRICES,
            provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
            rawData: null,
            status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SKIPPED,
            collectedAt: new Date(),
            durationMs: 0,
            retryCount: 0,
            errorMessage: 'MarketCollector not yet implemented (Phase 9).',
        };
    }
    async store(result) {
        this.collectorLogger.logStore(result.provider, result.operation, 'data-lake/raw/market (Phase 8.7)');
    }
    status() {
        return {
            domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.MARKET,
            operational: false,
            totalCollections: this.totalCollections,
            successCount: this.successCount,
            failureCount: this.failureCount,
        };
    }
};
exports.MarketCollector = MarketCollector;
exports.MarketCollector = MarketCollector = MarketCollector_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [collector_logger_service_1.CollectorLogger])
], MarketCollector);
//# sourceMappingURL=market.collector.js.map