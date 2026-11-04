"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MarketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
    cachedFallbackPrices = [];
    constructor(collector, normalization, quality, repository, aggregation, farmerProfiles, dataSource) {
        this.collector = collector;
        this.normalization = normalization;
        this.quality = quality;
        this.repository = repository;
        this.aggregation = aggregation;
        this.farmerProfiles = farmerProfiles;
        this.dataSource = dataSource;
    }
    async onApplicationBootstrap() {
        this.initFallbackDataset();
        await this.seedAuthenticMarketDataIfEmpty();
    }
    initFallbackDataset() {
        try {
            const candidates = [
                path.resolve(process.cwd(), 'ai-service/data/raw/prices/karnataka_mandi_live.json'),
                path.resolve(process.cwd(), '../ai-service/data/raw/prices/karnataka_mandi_live.json'),
            ];
            let livePath = candidates.find((p) => fs.existsSync(p));
            const histCandidates = [
                path.resolve(process.cwd(), 'ai-service/data/raw/prices/karnataka_mandi_history.json'),
                path.resolve(process.cwd(), '../ai-service/data/raw/prices/karnataka_mandi_history.json'),
            ];
            let histPath = histCandidates.find((p) => fs.existsSync(p));
            const records = [];
            if (livePath && fs.existsSync(livePath)) {
                const liveData = JSON.parse(fs.readFileSync(livePath, 'utf8'));
                const rawLive = (liveData.records || []);
                for (const item of rawLive) {
                    const p = this.mapRawToPrice(item);
                    if (p)
                        records.push(p);
                }
            }
            if (histPath && fs.existsSync(histPath)) {
                const histData = JSON.parse(fs.readFileSync(histPath, 'utf8'));
                for (const list of Object.values(histData)) {
                    for (const item of list) {
                        const p = this.mapRawToPrice(item);
                        if (p)
                            records.push(p);
                    }
                }
            }
            this.cachedFallbackPrices = records;
            this.logger.log(`Initialized in-memory APMC market dataset: ${this.cachedFallbackPrices.length} records available`);
        }
        catch (err) {
            this.logger.warn(`Could not load fallback market dataset: ${err.message}`);
        }
    }
    mapRawToPrice(item) {
        if (!item.commodity || !item.market || item.modal_price === undefined)
            return null;
        let date = new Date();
        if (item.arrival_date) {
            const parts = String(item.arrival_date).split('/');
            if (parts.length === 3) {
                date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            else {
                date = new Date(item.arrival_date);
            }
        }
        return {
            source: 'Karnataka State Agricultural Marketing Board / AGMARKNET (GODL-India)',
            state: item.state || 'Karnataka',
            district: item.district || 'Bengaluru',
            market: item.market,
            commodity: item.commodity,
            variety: item.variety || 'Standard',
            grade: item.grade || 'Local',
            date: isNaN(date.getTime()) ? new Date() : date,
            minPrice: Number(item.min_price || item.modal_price),
            maxPrice: Number(item.max_price || item.modal_price),
            modalPrice: Number(item.modal_price),
            unit: 'Quintal',
            normalizedAt: new Date(),
            qualityScore: 100,
        };
    }
    async seedAuthenticMarketDataIfEmpty() {
        try {
            const count = await this.repository.countPrices();
            if (count === 0 && this.cachedFallbackPrices.length > 0) {
                this.logger.log(`MongoDB market_prices_v2 is empty. Seeding ${this.cachedFallbackPrices.length} authentic APMC records...`);
                await this.repository.savePriceBatch(this.cachedFallbackPrices);
                this.logger.log(`Successfully seeded ${this.cachedFallbackPrices.length} APMC price records into MongoDB.`);
            }
        }
        catch (err) {
            this.logger.warn(`MongoDB check/seeding skipped: ${err.message}`);
        }
    }
    findFallbackPrices(commodity, market, startDate, endDate, limit = 100, district, state) {
        if (!this.cachedFallbackPrices.length) {
            this.initFallbackDataset();
        }
        const normDistrict = district ? district.trim().toLowerCase().replace(/\s+(urban|rural)$/i, '') : null;
        const normCommodity = commodity ? commodity.trim().toLowerCase() : null;
        const normMarket = market ? market.trim().toLowerCase() : null;
        const normState = state ? state.trim().toLowerCase() : null;
        let filtered = this.cachedFallbackPrices.filter((r) => {
            if (normCommodity && !r.commodity.toLowerCase().includes(normCommodity))
                return false;
            if (normMarket && !r.market.toLowerCase().includes(normMarket))
                return false;
            if (normDistrict && !r.district.toLowerCase().includes(normDistrict))
                return false;
            if (normState && !r.state.toLowerCase().includes(normState))
                return false;
            return true;
        });
        if (startDate || endDate) {
            const dateFiltered = filtered.filter((r) => {
                const t = r.date.getTime();
                if (startDate && t < startDate.getTime())
                    return false;
                if (endDate && t > endDate.getTime())
                    return false;
                return true;
            });
            if (dateFiltered.length > 0) {
                filtered = dateFiltered;
            }
        }
        filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
        return filtered.slice(0, limit);
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
        let records = [];
        try {
            records = await this.repository.findPrices(commodity, market, startDate, endDate, limit, district, state);
        }
        catch (err) {
            this.logger.warn(`Failed to query repository findPrices: ${err.message}`);
        }
        if (!records || records.length === 0) {
            records = this.findFallbackPrices(commodity, market, startDate, endDate, limit, district, state);
        }
        return records;
    }
    async getPricesForUser(userId, query) {
        let { district, state } = query;
        if ((!district || !state) && !query.market) {
            try {
                const farmRows = await this.dataSource.query(`SELECT lp.additional_metadata->>'district' AS district, lp.additional_metadata->>'state' AS state FROM farmer_land_parcels lp JOIN farmer_profiles fp ON fp.id = lp.farmer_profile_id WHERE fp.user_id = $1 ORDER BY lp.created_at DESC LIMIT 1`, [userId]);
                district = district || (farmRows[0]?.district?.toLowerCase() === 'default' ? undefined : farmRows[0]?.district) || undefined;
                state = state || (farmRows[0]?.state?.toLowerCase() === 'default' ? undefined : farmRows[0]?.state) || undefined;
            }
            catch (err) {
                this.logger.warn(`Could not lookup farmer land parcel: ${err.message}`);
            }
        }
        if ((!district || !state) && !query.market) {
            try {
                const profile = await this.farmerProfiles.findByUserId(userId);
                const profileDistrict = profile.district && profile.district.toLowerCase() !== 'default' ? profile.district : undefined;
                const profileState = profile.state && profile.state.toLowerCase() !== 'default' ? profile.state : undefined;
                district = district || profileDistrict || 'Bengaluru';
                state = state || profileState || 'Karnataka';
            }
            catch {
                district = district || 'Bengaluru';
                state = state || 'Karnataka';
            }
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