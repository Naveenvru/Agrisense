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
exports.YieldAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const yield_mongo_service_1 = require("../../mongodb/yield/yield-mongo.service");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let YieldAnalyticsService = class YieldAnalyticsService {
    yieldMongoService;
    constructor(yieldMongoService) {
        this.yieldMongoService = yieldMongoService;
    }
    async refreshGlobalAnalytics() {
        const predictions = await this.yieldMongoService.findAllPredictions();
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const cropWiseYield = {};
        const regionWiseYield = {};
        const monthlyYield = {};
        const seasonWiseYield = {};
        const trendMap = new Map();
        const avgSamples = [];
        for (const item of predictions) {
            const crop = item.cropName ?? 'Unknown';
            cropWiseYield[crop] = (cropWiseYield[crop] ?? 0) + (item.expectedYieldKg ?? 0);
            const regionKey = item.farmerProfileId ? `profile:${item.farmerProfileId}` : 'unknown';
            regionWiseYield[regionKey] = (regionWiseYield[regionKey] ?? 0) + (item.expectedYieldKg ?? 0);
            const monthKey = new Date(item.assessedAt ?? now).toISOString().slice(0, 7);
            monthlyYield[monthKey] = (monthlyYield[monthKey] ?? 0) + (item.expectedYieldKg ?? 0);
            trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + (item.expectedYieldKg ?? 0));
            const seasonKey = item.lifecycle?.season ?? item.cropCategory ?? 'unspecified';
            seasonWiseYield[String(seasonKey)] = (seasonWiseYield[String(seasonKey)] ?? 0) + (item.expectedYieldKg ?? 0);
            avgSamples.push({ cropName: crop, yieldKg: item.expectedYieldKg ?? 0, confidence: item.confidence ?? 0 });
        }
        const groupedTop = new Map();
        for (const sample of avgSamples) {
            const entry = groupedTop.get(sample.cropName) ?? { total: 0, count: 0, confidence: 0 };
            entry.total += sample.yieldKg;
            entry.count += 1;
            entry.confidence += sample.confidence;
            groupedTop.set(sample.cropName, entry);
        }
        const topPerformingCrops = Array.from(groupedTop.entries())
            .map(([cropName, entry]) => ({
            cropName,
            averageYieldKg: entry.count ? (0, yield_rule_utils_1.round)(entry.total / entry.count, 0) : 0,
            confidence: entry.count ? (0, yield_rule_utils_1.round)(entry.confidence / entry.count, 0) : 0,
        }))
            .sort((a, b) => b.averageYieldKg - a.averageYieldKg)
            .slice(0, 5);
        const yieldTrend = Array.from(trendMap.entries())
            .map(([period, yieldKg]) => ({ period, yieldKg: (0, yield_rule_utils_1.round)(yieldKg, 0) }))
            .sort((a, b) => a.period.localeCompare(b.period));
        const averageYieldKg = predictions.length
            ? (0, yield_rule_utils_1.round)((0, yield_rule_utils_1.average)(predictions.map((item) => item.expectedYieldKg ?? 0)), 0)
            : 0;
        const snapshot = {
            scope: 'global',
            periodType: 'monthly',
            periodStart,
            periodEnd,
            cropWiseYield,
            regionWiseYield,
            monthlyYield,
            seasonWiseYield,
            averageYieldKg,
            yieldTrend,
            topPerformingCrops,
            generatedAt: now,
        };
        await this.yieldMongoService.upsertAnalytics('global', 'monthly', periodStart, snapshot);
        return snapshot;
    }
    async getAnalytics(regionLevel, regionName, periodType, limit = 12) {
        return this.yieldMongoService.findAnalytics(regionLevel, regionName, periodType, limit);
    }
};
exports.YieldAnalyticsService = YieldAnalyticsService;
exports.YieldAnalyticsService = YieldAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [yield_mongo_service_1.YieldMongoService])
], YieldAnalyticsService);
//# sourceMappingURL=yield-analytics.service.js.map