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
var MarketRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const market_raw_schema_1 = require("../../mongodb/market/market-raw.schema");
const market_price_schema_1 = require("../../mongodb/market/market-price.schema");
const market_arrival_schema_1 = require("../../mongodb/market/market-arrival.schema");
const market_trend_schema_1 = require("../../mongodb/market/market-trend.schema");
const market_cache_schema_1 = require("../../mongodb/market/market-cache.schema");
let MarketRepository = MarketRepository_1 = class MarketRepository {
    rawModel;
    priceModel;
    arrivalModel;
    trendModel;
    cacheModel;
    logger = new common_1.Logger(MarketRepository_1.name);
    constructor(rawModel, priceModel, arrivalModel, trendModel, cacheModel) {
        this.rawModel = rawModel;
        this.priceModel = priceModel;
        this.arrivalModel = arrivalModel;
        this.trendModel = trendModel;
        this.cacheModel = cacheModel;
    }
    async saveRaw(data) {
        const doc = new this.rawModel(data);
        const saved = await doc.save();
        this.logger.debug(`Saved raw record | commodity=${data.commodity} market=${data.market}`);
        return saved;
    }
    async saveRawBatch(records) {
        const docs = await this.rawModel.insertMany(records);
        this.logger.log(`Saved ${docs.length} raw records to market_raw`);
        return docs;
    }
    async findRaw(commodity, market, startDate, endDate, limit = 100) {
        const filter = {};
        if (commodity)
            filter.commodity = new RegExp(commodity, 'i');
        if (market)
            filter.market = new RegExp(market, 'i');
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = startDate;
            if (endDate)
                filter.date.$lte = endDate;
        }
        return this.rawModel
            .find(filter)
            .sort({ date: 1 })
            .limit(limit)
            .exec();
    }
    async savePrice(data) {
        const doc = new this.priceModel(data);
        const saved = await doc.save();
        this.logger.debug(`Saved price | commodity=${data.commodity} market=${data.market} date=${data.date.toISOString().slice(0, 10)}`);
        return saved;
    }
    async savePriceBatch(records) {
        if (!records.length)
            return;
        await this.priceModel.bulkWrite(records.map((record) => ({
            updateOne: {
                filter: {
                    source: record.source,
                    state: record.state,
                    market: record.market,
                    commodity: record.commodity,
                    variety: record.variety ?? null,
                    grade: record.grade ?? null,
                    date: record.date,
                },
                update: { $set: record },
                upsert: true,
            },
        })));
        this.logger.log(`Upserted ${records.length} price records to market_prices_v2`);
    }
    async countPrices() {
        return this.priceModel.countDocuments().exec();
    }
    async findPrices(commodity, market, startDate, endDate, limit = 100, district, state) {
        const filter = {};
        if (commodity && commodity.trim()) {
            filter.commodity = new RegExp(this.escapeRegex(commodity.trim()), 'i');
        }
        if (market && market.trim()) {
            filter.market = new RegExp(this.escapeRegex(market.trim()), 'i');
        }
        if (district && district.trim()) {
            const cleanDistrict = district.trim().replace(/\s+(urban|rural)$/i, '').trim();
            filter.district = new RegExp(this.escapeRegex(cleanDistrict), 'i');
        }
        if (state && state.trim()) {
            filter.state = new RegExp(this.escapeRegex(state.trim()), 'i');
        }
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = startDate;
            if (endDate)
                filter.date.$lte = endDate;
        }
        let results = await this.priceModel
            .find(filter)
            .sort({ date: -1 })
            .limit(limit)
            .exec();
        if (!results.length && (startDate || endDate)) {
            const relaxedFilter = { ...filter };
            delete relaxedFilter.date;
            results = await this.priceModel
                .find(relaxedFilter)
                .sort({ date: -1 })
                .limit(limit)
                .exec();
        }
        return results;
    }
    escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    async findLatestPrice(commodity, market) {
        return this.priceModel
            .findOne({ commodity: new RegExp(commodity, 'i'), market: new RegExp(market, 'i') })
            .sort({ date: -1 })
            .exec();
    }
    async saveArrival(data) {
        const doc = new this.arrivalModel(data);
        return doc.save();
    }
    async saveArrivalBatch(records) {
        if (!records.length)
            return;
        await this.arrivalModel.bulkWrite(records.map((record) => ({
            updateOne: {
                filter: {
                    source: record.source,
                    state: record.state,
                    market: record.market,
                    commodity: record.commodity,
                    variety: record.variety ?? null,
                    date: record.date,
                },
                update: { $set: record },
                upsert: true,
            },
        })));
        this.logger.log(`Upserted ${records.length} arrival records to market_arrivals`);
    }
    async findArrivals(commodity, market, startDate, endDate, limit = 100) {
        const filter = {};
        if (commodity)
            filter.commodity = new RegExp(commodity, 'i');
        if (market)
            filter.market = new RegExp(market, 'i');
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = startDate;
            if (endDate)
                filter.date.$lte = endDate;
        }
        return this.arrivalModel
            .find(filter)
            .sort({ date: 1 })
            .limit(limit)
            .exec();
    }
    async saveTrend(data) {
        const doc = new this.trendModel(data);
        return doc.save();
    }
    async findTrends(commodity, market, period, limit = 50) {
        const filter = {};
        if (commodity)
            filter.commodity = new RegExp(commodity, 'i');
        if (market)
            filter.market = new RegExp(market, 'i');
        if (period)
            filter.period = period;
        return this.trendModel
            .find(filter)
            .sort({ startDate: -1 })
            .limit(limit)
            .exec();
    }
    async saveCache(data) {
        const doc = await this.cacheModel.findOneAndUpdate({ key: data.key }, data, { upsert: true, new: true });
        return doc;
    }
    async getCache(key) {
        return this.cacheModel
            .findOne({ key, expiresAt: { $gt: new Date() } })
            .exec();
    }
    async deleteCache(key) {
        await this.cacheModel.deleteOne({ key }).exec();
    }
    getPriceModel() {
        return this.priceModel;
    }
    getArrivalModel() {
        return this.arrivalModel;
    }
};
exports.MarketRepository = MarketRepository;
exports.MarketRepository = MarketRepository = MarketRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(market_raw_schema_1.MarketRaw.name)),
    __param(1, (0, mongoose_1.InjectModel)(market_price_schema_1.MarketPriceV2.name)),
    __param(2, (0, mongoose_1.InjectModel)(market_arrival_schema_1.MarketArrival.name)),
    __param(3, (0, mongoose_1.InjectModel)(market_trend_schema_1.MarketTrend.name)),
    __param(4, (0, mongoose_1.InjectModel)(market_cache_schema_1.MarketCache.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MarketRepository);
//# sourceMappingURL=market.repository.js.map