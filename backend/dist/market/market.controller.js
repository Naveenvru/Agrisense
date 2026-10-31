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
var MarketController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const market_service_1 = require("./market.service");
const collect_market_dto_1 = require("./dto/collect-market.dto");
const query_market_dto_1 = require("./dto/query-market.dto");
let MarketController = MarketController_1 = class MarketController {
    marketService;
    logger = new common_1.Logger(MarketController_1.name);
    constructor(marketService) {
        this.marketService = marketService;
    }
    health() {
        return this.marketService.healthCheck();
    }
    async collect(dto) {
        this.logger.log(`POST /market/collect | ${JSON.stringify(dto)}`);
        return this.marketService.collect({
            commodity: dto.commodity,
            market: dto.market,
            state: dto.state,
            district: dto.district,
            date: dto.date ? new Date(dto.date) : undefined,
            limit: dto.limit,
        });
    }
    async getPrices(query, req) {
        return this.marketService.getPricesForUser(req.user.id, {
            commodity: query.commodity,
            market: query.market,
            district: query.district,
            state: query.state,
            startDate: query.startDate ? new Date(query.startDate) : undefined,
            endDate: query.endDate ? new Date(query.endDate) : undefined,
            limit: query.limit,
        });
    }
    async getLatestPrice(commodity, market) {
        return this.marketService.getLatestPrice(commodity, market);
    }
    async getArrivals(query) {
        return this.marketService.getArrivals(query.commodity, query.market, query.startDate ? new Date(query.startDate) : undefined, query.endDate ? new Date(query.endDate) : undefined, query.limit);
    }
    async getTrends(query) {
        return this.marketService.getTrends(query.commodity, query.market, query.period, query.limit);
    }
    async getPriceStats(query) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return this.marketService.getPriceStats(query.commodity ?? '', query.market ?? '', query.startDate ? new Date(query.startDate) : thirtyDaysAgo, query.endDate ? new Date(query.endDate) : now);
    }
    async getArrivalTotals(query) {
        return this.marketService.getArrivalTotals(query.commodity ?? '', query.market ?? '', query.startDate ? new Date(query.startDate) : undefined, query.endDate ? new Date(query.endDate) : undefined);
    }
};
exports.MarketController = MarketController;
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Market Intelligence module health',
        description: 'Returns the operational status of the Market Intelligence module.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module operational.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('collect'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Trigger market data collection',
        description: 'Runs the full market intelligence pipeline: ' +
            'collect raw data → store in Data Lake (storage/raw/market/) → ' +
            'validate quality → normalize → persist to MongoDB. ' +
            'Set MARKET_DATA_SOURCE=mandi-api to use the configured external provider. Provider failures are returned as collection failures; development mock collection requires MARKET_DATA_SOURCE=mock.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Collection pipeline completed.',
        schema: {
            example: {
                collectionResult: { status: 'success', recordsCollected: 8, durationMs: 12 },
                qualityResult: { totalInput: 8, totalValid: 8, totalRejected: 0, totalDuplicates: 0 },
                stored: { prices: 8, arrivals: 8 },
                dataLake: { stored: true },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized — missing or invalid JWT.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [collect_market_dto_1.CollectMarketDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "collect", null);
__decorate([
    (0, common_1.Get)('prices'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Query normalized market prices',
        description: 'Returns normalized market price records from MongoDB (market_prices_v2). ' +
            'Results are sorted chronologically by date descending.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Market prices returned.',
        schema: {
            example: [
                {
                    commodity: 'Rice',
                    market: 'Bengaluru APMC',
                    district: 'Bengaluru Urban',
                    state: 'Karnataka',
                    date: '2026-06-26T00:00:00.000Z',
                    minPrice: 2200,
                    maxPrice: 2600,
                    modalPrice: 2400,
                    unit: 'Quintal',
                    source: 'agmarknet',
                    qualityScore: 100,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_market_dto_1.QueryMarketDto, Object]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getPrices", null);
__decorate([
    (0, common_1.Get)('prices/latest'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get the latest price for a commodity and market',
        description: 'Returns the single most recent price record for the given commodity and market.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'commodity', required: true, example: 'Rice' }),
    (0, swagger_1.ApiQuery)({ name: 'market', required: true, example: 'Bengaluru APMC' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest price returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)('commodity')),
    __param(1, (0, common_1.Query)('market')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getLatestPrice", null);
__decorate([
    (0, common_1.Get)('arrivals'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Query market arrival quantities',
        description: 'Returns daily commodity arrival quantities for the specified filters. ' +
            'Results are sorted chronologically.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Arrival data returned.',
        schema: {
            example: [
                {
                    commodity: 'Onion',
                    market: 'Nashik APMC',
                    date: '2026-06-26T00:00:00.000Z',
                    arrivalQty: 6200,
                    unit: 'Quintal',
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_market_dto_1.QueryMarketDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getArrivals", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Query market price trends',
        description: 'Returns aggregated price trend records for the specified commodity, market, and period.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trend data returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_market_dto_1.QueryTrendsDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('aggregations/price-stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get price statistics (avg / min / max) via MongoDB aggregation',
        description: 'Runs a MongoDB $group aggregation pipeline to compute average, minimum, and maximum ' +
            'prices for a commodity+market over a date range. No forecasting.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Price statistics returned.',
        schema: {
            example: {
                commodity: 'Rice',
                market: 'Bengaluru APMC',
                startDate: '2026-06-01T00:00:00.000Z',
                endDate: '2026-06-26T00:00:00.000Z',
                avgPrice: 2410.5,
                minPrice: 2200,
                maxPrice: 2600,
                recordCount: 12,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_market_dto_1.PriceStatsDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getPriceStats", null);
__decorate([
    (0, common_1.Get)('aggregations/arrivals'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get total arrivals grouped by date via MongoDB aggregation',
        description: 'Runs a MongoDB $group aggregation pipeline to compute total arrival quantities ' +
            'per date for a commodity+market pair. No forecasting.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Arrival totals returned.',
        schema: {
            example: [
                { commodity: 'Onion', market: 'Nashik APMC', date: '2026-06-26T00:00:00.000Z', totalArrival: 6200, unit: 'Quintal' },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_market_dto_1.PriceStatsDto]),
    __metadata("design:returntype", Promise)
], MarketController.prototype, "getArrivalTotals", null);
exports.MarketController = MarketController = MarketController_1 = __decorate([
    (0, swagger_1.ApiTags)('Market Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('market'),
    __metadata("design:paramtypes", [market_service_1.MarketService])
], MarketController);
//# sourceMappingURL=market.controller.js.map