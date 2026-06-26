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
var MarketAggregationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketAggregationService = void 0;
const common_1 = require("@nestjs/common");
const market_repository_1 = require("../repository/market.repository");
let MarketAggregationService = MarketAggregationService_1 = class MarketAggregationService {
    repository;
    logger = new common_1.Logger(MarketAggregationService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async priceStats(commodity, market, startDate, endDate) {
        this.logger.debug(`priceStats | commodity=${commodity} market=${market} ${startDate.toISOString().slice(0, 10)}→${endDate.toISOString().slice(0, 10)}`);
        const priceModel = this.repository.getPriceModel();
        const pipeline = [
            {
                $match: {
                    commodity: new RegExp(commodity, 'i'),
                    market: new RegExp(market, 'i'),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    avgPrice: { $avg: '$modalPrice' },
                    minPrice: { $min: '$minPrice' },
                    maxPrice: { $max: '$maxPrice' },
                    recordCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    avgPrice: { $round: ['$avgPrice', 2] },
                    minPrice: 1,
                    maxPrice: 1,
                    recordCount: 1,
                },
            },
        ];
        const results = await priceModel.aggregate(pipeline).exec();
        if (!results.length) {
            this.logger.debug(`priceStats | no records found`);
            return null;
        }
        const r = results[0];
        return {
            commodity,
            market,
            startDate,
            endDate,
            avgPrice: r.avgPrice ?? 0,
            minPrice: r.minPrice ?? 0,
            maxPrice: r.maxPrice ?? 0,
            recordCount: r.recordCount ?? 0,
        };
    }
    async arrivalTotals(commodity, market, startDate, endDate) {
        this.logger.debug(`arrivalTotals | commodity=${commodity} market=${market}`);
        const arrivalModel = this.repository.getArrivalModel();
        const matchStage = {
            commodity: new RegExp(commodity, 'i'),
            market: new RegExp(market, 'i'),
        };
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate)
                matchStage.date.$gte = startDate;
            if (endDate)
                matchStage.date.$lte = endDate;
        }
        const pipeline = [
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: { format: '%Y-%m-%d', date: '$date' },
                        },
                        unit: '$unit',
                    },
                    totalArrival: { $sum: '$arrivalQty' },
                },
            },
            { $sort: { '_id.date': 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id.date',
                    unit: '$_id.unit',
                    totalArrival: 1,
                },
            },
        ];
        const results = await arrivalModel.aggregate(pipeline).exec();
        return results.map((r) => ({
            commodity,
            market,
            date: new Date(r.date),
            totalArrival: r.totalArrival ?? 0,
            unit: r.unit ?? 'Quintal',
        }));
    }
};
exports.MarketAggregationService = MarketAggregationService;
exports.MarketAggregationService = MarketAggregationService = MarketAggregationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [market_repository_1.MarketRepository])
], MarketAggregationService);
//# sourceMappingURL=market-aggregation.service.js.map