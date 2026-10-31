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
var MarketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const market_collector_1 = require("../collectors/market/market.collector");
const market_normalization_service_1 = require("./normalization/market-normalization.service");
const market_quality_service_1 = require("./quality/market-quality.service");
const market_repository_1 = require("./repository/market.repository");
const market_aggregation_service_1 = require("./aggregation/market-aggregation.service");
const collector_constants_1 = require("../collectors/common/collector.constants");
const farmer_profiles_service_1 = require("../farmer-profiles/farmer-profiles.service");
const typeorm_1 = require("typeorm");
let MarketService = MarketService_1 = class MarketService {
    collector;
    normalization;
    quality;
    repository;
    aggregation;
    farmerProfiles;
    dataSource;
    logger = new common_1.Logger(MarketService_1.name);
    constructor(collector, normalization, quality, repository, aggregation, farmerProfiles, dataSource) {
        this.collector = collector;
        this.normalization = normalization;
        this.quality = quality;
        this.repository = repository;
        this.aggregation = aggregation;
        this.farmerProfiles = farmerProfiles;
        this.dataSource = dataSource;
    }
    async collect(params = {}) {
        this.logger.log(`Collection started | params=${JSON.stringify(params)}`);
        const collectionResult = await this.collector.collect({
            domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.MARKET,
            operation: collector_constants_1.COLLECTOR_CONSTANTS.OPERATIONS.MARKET_PRICES,
            payload: {
                commodity: params.commodity,
                market: params.market,
                state: params.state,
                district: params.district,
                date: params.date?.toISOString(),
                limit: params.limit ?? 200,
            },
            requestedAt: new Date(),
        });
        this.logger.log(`Collection completed | status=${collectionResult.status} duration=${collectionResult.durationMs}ms`);
        const rawRecords = collectionResult.rawData ?? [];
        await this.collector.store(collectionResult);
        const dataLakeStored = collectionResult.status === collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS;
        this.logger.log(`Raw dataset stored in Data Lake | count=${rawRecords.length}`);
        if (!rawRecords.length) {
            return {
                collectionResult: { status: collectionResult.status, recordsCollected: 0, durationMs: collectionResult.durationMs },
                qualityResult: { totalInput: 0, totalValid: 0, totalRejected: 0, totalDuplicates: 0 },
                stored: { prices: 0, arrivals: 0 },
                dataLake: { stored: false },
            };
        }
        const qualityResult = this.quality.validate(rawRecords);
        this.logger.log(`Records normalized: ${qualityResult.totalValid} | Invalid records rejected: ${qualityResult.totalRejected}`);
        const { prices, arrivals } = this.normalization.normalizeBatch(qualityResult.valid);
        let storedPrices = 0;
        let storedArrivals = 0;
        if (prices.length) {
            await this.repository.savePriceBatch(prices);
            storedPrices = prices.length;
        }
        if (arrivals.length) {
            await this.repository.saveArrivalBatch(arrivals);
            storedArrivals = arrivals.length;
        }
        if (rawRecords.length) {
            await this.repository.saveRawBatch(rawRecords);
        }
        return {
            collectionResult: {
                status: collectionResult.status,
                recordsCollected: rawRecords.length,
                durationMs: collectionResult.durationMs,
            },
            qualityResult: {
                totalInput: qualityResult.totalInput,
                totalValid: qualityResult.totalValid,
                totalRejected: qualityResult.totalRejected,
                totalDuplicates: qualityResult.totalDuplicates,
            },
            stored: { prices: storedPrices, arrivals: storedArrivals },
            dataLake: { stored: dataLakeStored },
        };
    }
    async getPrices(commodity, market, startDate, endDate, limit = 100, district, state) {
        return this.repository.findPrices(commodity, market, startDate, endDate, limit, district, state);
    }
    async getPricesForUser(userId, query) {
        let { district, state } = query;
        if ((!district || !state) && !query.market) {
            const farmRows = await this.dataSource.query(`SELECT lp.additional_metadata->>'district' AS district, lp.additional_metadata->>'state' AS state FROM farmer_land_parcels lp JOIN farmer_profiles fp ON fp.id = lp.farmer_profile_id WHERE fp.user_id = $1 ORDER BY lp.created_at DESC LIMIT 1`, [userId]);
            district = district || (farmRows[0]?.district?.toLowerCase() === 'default' ? undefined : farmRows[0]?.district) || undefined;
            state = state || (farmRows[0]?.state?.toLowerCase() === 'default' ? undefined : farmRows[0]?.state) || undefined;
        }
        if ((!district || !state) && !query.market) {
            const profile = await this.farmerProfiles.findByUserId(userId);
            const profileDistrict = profile.district && profile.district.toLowerCase() !== 'default' ? profile.district : undefined;
            const profileState = profile.state && profile.state.toLowerCase() !== 'default' ? profile.state : undefined;
            district = district || profileDistrict || 'Bengaluru Urban';
            state = state || profileState || 'Karnataka';
        }
        return this.getPrices(query.commodity, query.market, query.startDate, query.endDate, query.limit, district, state);
    }
    async getLatestPrice(commodity, market) {
        return this.repository.findLatestPrice(commodity, market);
    }
    async getArrivals(commodity, market, startDate, endDate, limit = 100) {
        return this.repository.findArrivals(commodity, market, startDate, endDate, limit);
    }
    async getTrends(commodity, market, period, limit = 50) {
        return this.repository.findTrends(commodity, market, period, limit);
    }
    async getPriceStats(commodity, market, startDate, endDate) {
        return this.aggregation.priceStats(commodity, market, startDate, endDate);
    }
    async getArrivalTotals(commodity, market, startDate, endDate) {
        return this.aggregation.arrivalTotals(commodity, market, startDate, endDate);
    }
    healthCheck() {
        this.logger.log('MarketService health check called');
        return { status: 'operational', module: 'market-intelligence' };
    }
};
exports.MarketService = MarketService;
exports.MarketService = MarketService = MarketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [market_collector_1.MarketCollector,
        market_normalization_service_1.MarketNormalizationService,
        market_quality_service_1.MarketQualityService,
        market_repository_1.MarketRepository,
        market_aggregation_service_1.MarketAggregationService,
        farmer_profiles_service_1.FarmerProfilesService,
        typeorm_1.DataSource])
], MarketService);
//# sourceMappingURL=market.service.js.map