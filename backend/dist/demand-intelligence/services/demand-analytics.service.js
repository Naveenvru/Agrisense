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
exports.DemandAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const demand_mongo_service_1 = require("../../mongodb/demand/demand-mongo.service");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let DemandAnalyticsService = class DemandAnalyticsService {
    demandMongoService;
    constructor(demandMongoService) {
        this.demandMongoService = demandMongoService;
    }
    async refreshGlobalAnalytics() {
        const predictions = await this.demandMongoService.findAllPredictions();
        const snapshot = this.buildSnapshot(predictions, 'global', undefined, undefined);
        await this.demandMongoService.upsertAnalytics('global', 'monthly', snapshot.periodStart, snapshot);
        return snapshot;
    }
    async refreshRegionalAnalytics() {
        const predictions = await this.demandMongoService.findAllPredictions();
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
            await this.demandMongoService.upsertAnalytics('regional', 'monthly', periodStart, snapshot);
        }
    }
    async getAnalytics(regionLevel, regionName, periodType, limit = 12) {
        return this.demandMongoService.findAnalytics(regionLevel, regionName, periodType, limit);
    }
    buildSnapshot(predictions, scope, regionLevel, regionName, cropName) {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const cropWiseDemand = {};
        const regionWiseDemand = {};
        const weeklyDemand = {};
        const monthlyDemand = {};
        const seasonalDemand = {};
        const trendMap = new Map();
        const cropSamples = [];
        const regionGroups = new Map();
        for (const item of predictions) {
            const crop = item.cropName ?? 'Unknown';
            const demandKg = item.currentDemandKg ?? 0;
            cropWiseDemand[crop] = (cropWiseDemand[crop] ?? 0) + demandKg;
            cropSamples.push({ cropName: crop, demandKg });
            const regionKey = `${item.regionLevel ?? 'district'}:${item.regionName ?? 'unknown'}`;
            regionWiseDemand[regionKey] = (regionWiseDemand[regionKey] ?? 0) + demandKg;
            const monthKey = new Date(item.assessedAt ?? now).toISOString().slice(0, 7);
            monthlyDemand[monthKey] = (monthlyDemand[monthKey] ?? 0) + demandKg;
            trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + demandKg);
            const weekKey = `w${Math.ceil(new Date(item.assessedAt ?? now).getDate() / 7)}`;
            weeklyDemand[weekKey] = (weeklyDemand[weekKey] ?? 0) + demandKg;
            const seasonKey = String(item.cropCategory ?? 'unspecified');
            seasonalDemand[seasonKey] = (seasonalDemand[seasonKey] ?? 0) + demandKg;
            const existing = regionGroups.get(regionKey) ?? { total: 0, count: 0, confidence: 0, regionLevel: item.regionLevel ?? 'district', regionName: item.regionName ?? 'unknown' };
            existing.total += demandKg;
            existing.count += 1;
            existing.confidence += item.confidence ?? 0;
            regionGroups.set(regionKey, existing);
        }
        const topDemandRegions = Array.from(regionGroups.values())
            .map((entry) => ({
            regionLevel: entry.regionLevel,
            regionName: entry.regionName,
            demandKg: (0, yield_rule_utils_1.round)(entry.total, 0),
            confidence: entry.count ? (0, yield_rule_utils_1.round)(entry.confidence / entry.count, 0) : 0,
        }))
            .sort((a, b) => b.demandKg - a.demandKg)
            .slice(0, 5);
        const cropTotals = new Map();
        for (const sample of cropSamples) {
            cropTotals.set(sample.cropName, (cropTotals.get(sample.cropName) ?? 0) + sample.demandKg);
        }
        const totalDemandKg = predictions.reduce((sum, item) => sum + (item.currentDemandKg ?? 0), 0);
        const cropDistribution = Array.from(cropTotals.entries())
            .map(([name, demandKg]) => ({ cropName: name, demandKg: (0, yield_rule_utils_1.round)(demandKg, 0), sharePercent: totalDemandKg > 0 ? (0, yield_rule_utils_1.round)((demandKg / totalDemandKg) * 100, 2) : 0 }))
            .sort((a, b) => b.demandKg - a.demandKg)
            .slice(0, 10);
        const demandTrend = Array.from(trendMap.entries())
            .map(([period, demandKg]) => ({ period, demandKg: (0, yield_rule_utils_1.round)(demandKg, 0) }))
            .sort((a, b) => a.period.localeCompare(b.period));
        const averageDemandKg = predictions.length
            ? (0, yield_rule_utils_1.round)((0, yield_rule_utils_1.average)(predictions.map((item) => item.currentDemandKg ?? 0)), 0)
            : 0;
        return {
            scope,
            regionLevel,
            regionName,
            cropName,
            periodType: 'monthly',
            periodStart,
            periodEnd,
            cropWiseDemand,
            regionWiseDemand,
            weeklyDemand,
            monthlyDemand,
            seasonalDemand,
            averageDemandKg,
            demandTrend,
            topDemandRegions,
            cropDistribution,
            generatedAt: now,
        };
    }
};
exports.DemandAnalyticsService = DemandAnalyticsService;
exports.DemandAnalyticsService = DemandAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [demand_mongo_service_1.DemandMongoService])
], DemandAnalyticsService);
//# sourceMappingURL=demand-analytics.service.js.map