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
const mock_market_data_source_1 = require("./mock-market-data.source");
const datalake_service_1 = require("../../storage/datalake/datalake.service");
const storage_constants_1 = require("../../storage/common/storage.constants");
let MarketCollector = MarketCollector_1 = class MarketCollector {
    dataSource;
    collectorLogger;
    dataLakeService;
    logger = new common_1.Logger(MarketCollector_1.name);
    totalCollections = 0;
    successCount = 0;
    failureCount = 0;
    lastSuccessAt;
    lastFailureAt;
    constructor(dataSource, collectorLogger, dataLakeService) {
        this.dataSource = dataSource;
        this.collectorLogger = collectorLogger;
        this.dataLakeService = dataLakeService;
    }
    async collect(params) {
        const startTime = Date.now();
        const requestedAt = new Date();
        const operation = params.operation ?? collector_constants_1.COLLECTOR_CONSTANTS.OPERATIONS.MARKET_PRICES;
        this.collectorLogger.logStart(integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET, operation);
        this.logger.log(`Collection started | operation=${operation}`);
        this.totalCollections++;
        try {
            const fetchParams = {
                commodity: params.payload['commodity'],
                market: params.payload['market'],
                state: params.payload['state'],
                district: params.payload['district'],
                date: params.payload['date'] ? new Date(params.payload['date']) : new Date(),
                limit: params.payload['limit'] ?? 50,
            };
            const rawRecords = await this.dataSource.fetchPrices(fetchParams);
            const durationMs = Date.now() - startTime;
            this.successCount++;
            this.lastSuccessAt = new Date();
            const result = {
                domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.MARKET,
                operation,
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
                rawData: rawRecords,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS,
                collectedAt: requestedAt,
                durationMs,
                retryCount: 0,
            };
            this.collectorLogger.logCollection({
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
                operation,
                requestedAt,
                respondedAt: new Date(),
                durationMs,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS,
                retryCount: 0,
            });
            this.logger.log(`Collection completed | records=${rawRecords.length} duration=${durationMs}ms`);
            return result;
        }
        catch (error) {
            const durationMs = Date.now() - startTime;
            this.failureCount++;
            this.lastFailureAt = new Date();
            const result = {
                domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.MARKET,
                operation,
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
                rawData: null,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.FAILED,
                collectedAt: requestedAt,
                durationMs,
                retryCount: 0,
                errorMessage: error?.message,
            };
            this.collectorLogger.logCollection({
                provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
                operation,
                requestedAt,
                respondedAt: new Date(),
                durationMs,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.FAILED,
                retryCount: 0,
                errorMessage: error?.message,
            });
            this.logger.error(`Collection failed | ${error?.message}`);
            return result;
        }
    }
    async store(result) {
        this.collectorLogger.logStore(result.provider, result.operation, 'storage/raw/market/');
        if (result.status !== collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS) {
            this.logger.warn(`Skipping store — collection status=${result.status}`);
            return;
        }
        const storageResult = await this.dataLakeService.writeRaw(storage_constants_1.STORAGE_CONSTANTS.DOMAINS.MARKET, result);
        if (storageResult.success) {
            this.logger.log(`Raw dataset stored | file=${storageResult.location?.filename} size=${storageResult.metadata?.size ?? 0}B`);
        }
        else {
            this.logger.error(`Raw dataset store failed | ${storageResult.errorMessage}`);
        }
    }
    status() {
        return {
            domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.MARKET,
            operational: true,
            lastSuccessAt: this.lastSuccessAt,
            lastFailureAt: this.lastFailureAt,
            totalCollections: this.totalCollections,
            successCount: this.successCount,
            failureCount: this.failureCount,
        };
    }
};
exports.MarketCollector = MarketCollector;
exports.MarketCollector = MarketCollector = MarketCollector_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_market_data_source_1.MockMarketDataSource,
        collector_logger_service_1.CollectorLogger,
        datalake_service_1.DataLakeService])
], MarketCollector);
//# sourceMappingURL=market.collector.js.map