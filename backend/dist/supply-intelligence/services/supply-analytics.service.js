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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const supply_mongo_service_1 = require("../../mongodb/supply/supply-mongo.service");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let SupplyAnalyticsService = class SupplyAnalyticsService {
    supplyMongoService;
    constructor(supplyMongoService) {
        this.supplyMongoService = supplyMongoService;
    }
    async refreshGlobalAnalytics() {
        const predictions = await this.supplyMongoService.findAllPredictions();
        const snapshot = this.buildSnapshot(predictions, 'global', undefined, undefined);
        await this.supplyMongoService.upsertAnalytics('global', 'monthly', snapshot.periodStart, snapshot);
        return snapshot;
    }
    async refreshRegionalAnalytics() {
        const predictions = await this.supplyMongoService.findAllPredictions();
        const groups = new Map();
        for (const item of predictions) {
            const key = `${item.regionLevel ?? 'district'}|${item.regionName ?? 'unknown'}`;
            if (!groups.has(key))
                groups.set(key, []);
            groups.get(key).push(item);
        }
        const periodStart = new Date();
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);
        for (const [key, items] of groups.entries()) {
            const [regionLevel, regionName] = key.split('|');
            const snapshot = this.buildSnapshot(items, 'regional', regionLevel, regionName);
            await this.supplyMongoService.upsertAnalytics('regional', 'monthly', periodStart, snapshot);
        }
    }
    async getAnalytics(regionLevel, regionName, periodType, limit = 12) {
        return this.supplyMongoService.findAnalytics(regionLevel, regionName, periodType, limit);
    }
    buildSnapshot(predictions, scope, regionLevel, regionName, cropName) {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const cropWiseSupply = {};
        const regionWiseSupply = {};
        const weeklySupply = {};
        const monthlySupply = {};
        const seasonalSupply = {};
        const trendMap = new Map();
        const cropSamples = [];
        const regionGroups = new Map();
        for (const item of predictions) {
            const crop = item.cropName ?? 'Unknown';
            const supplyKg = item.availableSupplyKg ?? 0;
            cropWiseSupply[crop] = (cropWiseSupply[crop] ?? 0) + supplyKg;
            cropSamples.push({ cropName: crop, supplyKg });
            const regionKey = `${item.regionLevel ?? 'district'}:${item.regionName ?? 'unknown'}`;
            regionWiseSupply[regionKey] = (regionWiseSupply[regionKey] ?? 0) + supplyKg;
            const monthKey = new Date(item.assessedAt ?? now).toISOString().slice(0, 7);
            monthlySupply[monthKey] = (monthlySupply[monthKey] ?? 0) + supplyKg;
            trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + supplyKg);
            const weekKey = `w${Math.ceil(new Date(item.assessedAt ?? now).getDate() / 7)}`;
            weeklySupply[weekKey] = (weeklySupply[weekKey] ?? 0) + supplyKg;
            const seasonKey = String(item.cropCategory ?? 'unspecified');
            seasonalSupply[seasonKey] = (seasonalSupply[seasonKey] ?? 0) + supplyKg;
            const existing = regionGroups.get(regionKey) ?? { total: 0, count: 0, confidence: 0, regionLevel: item.regionLevel ?? 'district', regionName: item.regionName ?? 'unknown' };
            existing.total += supplyKg;
            existing.count += 1;
            existing.confidence += item.confidence ?? 0;
            regionGroups.set(regionKey, existing);
        }
        const topProducingRegions = Array.from(regionGroups.values())
            .map((entry) => ({
            regionLevel: entry.regionLevel,
            regionName: entry.regionName,
            supplyKg: (0, yield_rule_utils_1.round)(entry.total, 0),
            confidence: entry.count ? (0, yield_rule_utils_1.round)(entry.confidence / entry.count, 0) : 0,
        }))
            .sort((a, b) => b.supplyKg - a.supplyKg)
            .slice(0, 5);
        const cropTotals = new Map();
        for (const sample of cropSamples) {
            cropTotals.set(sample.cropName, (cropTotals.get(sample.cropName) ?? 0) + sample.supplyKg);
        }
        const totalSupplyKg = predictions.reduce((sum, item) => sum + (item.availableSupplyKg ?? 0), 0);
        const cropDistribution = Array.from(cropTotals.entries())
            .map(([name, supplyKg]) => ({ cropName: name, supplyKg: (0, yield_rule_utils_1.round)(supplyKg, 0), sharePercent: totalSupplyKg > 0 ? (0, yield_rule_utils_1.round)((supplyKg / totalSupplyKg) * 100, 2) : 0 }))
            .sort((a, b) => b.supplyKg - a.supplyKg)
            .slice(0, 10);
        const supplyTrend = Array.from(trendMap.entries())
            .map(([period, supplyKg]) => ({ period, supplyKg: (0, yield_rule_utils_1.round)(supplyKg, 0) }))
            .sort((a, b) => a.period.localeCompare(b.period));
        const averageSupplyKg = predictions.length ? (0, yield_rule_utils_1.round)((0, yield_rule_utils_1.average)(predictions.map((item) => item.availableSupplyKg ?? 0)), 0) : 0;
        return {
            scope,
            regionLevel,
            regionName,
            cropName,
            periodType: 'monthly',
            periodStart,
            periodEnd,
            cropWiseSupply,
            regionWiseSupply,
            weeklySupply,
            monthlySupply,
            seasonalSupply,
            averageSupplyKg,
            supplyTrend,
            topProducingRegions,
            cropDistribution,
            generatedAt: now,
        };
    }
};
exports.SupplyAnalyticsService = SupplyAnalyticsService;
exports.SupplyAnalyticsService = SupplyAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supply_mongo_service_1.SupplyMongoService])
], SupplyAnalyticsService);
//# sourceMappingURL=supply-analytics.service.js.map