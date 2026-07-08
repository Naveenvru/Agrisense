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
exports.RuleBasedDemandEstimatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
const demand_risk_analyzer_engine_1 = require("./demand-risk-analyzer.engine");
const demand_confidence_calculator_engine_1 = require("./demand-confidence-calculator.engine");
const demand_recommendation_engine_1 = require("./demand-recommendation.engine");
const FESTIVAL_DEMAND_MULTIPLIERS = {
    1: 1.20,
    4: 1.12,
    8: 1.08,
    10: 1.25,
    11: 1.25,
};
const MSP_CROP_KEYWORDS = [
    'rice', 'paddy', 'wheat', 'jowar', 'bajra', 'maize', 'ragi', 'barley',
    'gram', 'tur', 'moong', 'urad', 'lentil', 'groundnut', 'sunflower',
    'soybean', 'rapeseed', 'mustard', 'cotton', 'jute', 'sugarcane',
];
const EXPORT_CROP_KEYWORDS = [
    'rice', 'basmati', 'onion', 'mango', 'banana', 'grapes', 'pomegranate',
    'cotton', 'castor', 'cumin', 'turmeric', 'chilli', 'pepper', 'guar',
    'sesame', 'groundnut', 'soybean',
];
let RuleBasedDemandEstimatorEngine = class RuleBasedDemandEstimatorEngine {
    riskAnalyzer;
    confidenceCalculator;
    recommendationEngine;
    constructor(riskAnalyzer, confidenceCalculator, recommendationEngine) {
        this.riskAnalyzer = riskAnalyzer;
        this.confidenceCalculator = confidenceCalculator;
        this.recommendationEngine = recommendationEngine;
    }
    estimate(context) {
        const explanations = [];
        const areaAcres = Math.max(0.1, (0, yield_rule_utils_1.safeNumber)(context.areaAcres, 1));
        const baseDemandPerAcre = this.resolveBaseDemandPerAcre(context);
        const priceFactor = this.resolvePriceFactor(context);
        const supplyFactor = this.resolveSupplyFactor(context);
        const seasonFactor = this.resolveSeasonFactor(context);
        const festivalFactor = this.resolveFestivalFactor(context.currentMonth);
        const exportFactor = this.resolveExportFactor(context);
        const procurementFactor = this.resolveProcurementFactor(context);
        const weatherFactor = this.resolveWeatherFactor(context);
        const historicalFactor = this.resolveHistoricalFactor(context.historicalDemandKg, baseDemandPerAcre);
        const factors = [priceFactor, supplyFactor, seasonFactor, festivalFactor, exportFactor, procurementFactor, weatherFactor, historicalFactor];
        const projectedDemandPerAcre = (0, yield_rule_utils_1.round)(baseDemandPerAcre * factors.reduce((product, f) => product * f, 1), 2);
        const expectedDemandKg = Math.max(0, Math.round(projectedDemandPerAcre * areaAcres));
        const currentDemandKg = Math.max(0, Math.min(expectedDemandKg, context.availableSupplyKg > 0 ? context.availableSupplyKg : expectedDemandKg));
        const governmentProcurementKg = context.isMspCrop
            ? Math.round(expectedDemandKg * 0.28)
            : Math.round(expectedDemandKg * 0.05);
        const exportDemandKg = context.isExportCrop
            ? Math.round(expectedDemandKg * 0.22)
            : Math.round(expectedDemandKg * 0.04);
        const festivalDemandKg = Math.round(expectedDemandKg * (festivalFactor - 1) * 0.5);
        const industrialDemandKg = ['grain', 'oilseed', 'pulses', 'sugarcane'].some((cat) => (0, yield_rule_utils_1.lower)(context.cropCategory ?? '').includes(cat))
            ? Math.round(expectedDemandKg * 0.18)
            : Math.round(expectedDemandKg * 0.06);
        const retailDemandKg = Math.max(0, expectedDemandKg - governmentProcurementKg - exportDemandKg - industrialDemandKg);
        const demandDensityKgPerAcre = (0, yield_rule_utils_1.round)(expectedDemandKg / areaAcres, 2);
        const demandGapPercent = expectedDemandKg > 0
            ? Math.max(0, ((expectedDemandKg - currentDemandKg) / expectedDemandKg) * 100)
            : 0;
        const risk = this.riskAnalyzer.analyze(context, expectedDemandKg, currentDemandKg);
        const confidence = this.confidenceCalculator.calculate(context, expectedDemandKg, currentDemandKg);
        const recommendations = this.recommendationEngine.recommend(context, risk, demandGapPercent);
        const timeline = this.buildDemandTimeline(context, expectedDemandKg, currentDemandKg);
        const seasonalAnalysis = this.buildSeasonalAnalysis(context, expectedDemandKg, currentDemandKg, festivalDemandKg);
        const confidenceBand = confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';
        explanations.push(`Base demand benchmark for ${context.cropName} is ${(0, yield_rule_utils_1.round)(baseDemandPerAcre, 0)} kg/acre`, `Adjusted by price (${(0, yield_rule_utils_1.formatPercent)((priceFactor - 1) * 100)}), supply pressure (${(0, yield_rule_utils_1.formatPercent)((supplyFactor - 1) * 100)}), season (${(0, yield_rule_utils_1.formatPercent)((seasonFactor - 1) * 100)}), festival (${(0, yield_rule_utils_1.formatPercent)((festivalFactor - 1) * 100)}), export (${(0, yield_rule_utils_1.formatPercent)((exportFactor - 1) * 100)}), procurement (${(0, yield_rule_utils_1.formatPercent)((procurementFactor - 1) * 100)}), weather (${(0, yield_rule_utils_1.formatPercent)((weatherFactor - 1) * 100)}), history (${(0, yield_rule_utils_1.formatPercent)((historicalFactor - 1) * 100)})`, risk.explanation, `Current market-clearing demand is ${currentDemandKg} kg; total expected demand across all channels is ${expectedDemandKg} kg.`, seasonalAnalysis.explanation, recommendations.map((r) => r.explanation).join(' '));
        const summary = currentDemandKg < expectedDemandKg
            ? `Demand is partially constrained to ${currentDemandKg} kg from ${expectedDemandKg} kg due to ${(0, yield_rule_utils_1.formatPercent)(demandGapPercent)} supply shortfall.`
            : `Demand of ${expectedDemandKg} kg is fully supportable by available supply conditions.`;
        return {
            farmerCropId: context.farmerCropId,
            farmerProfileId: context.farmerProfileId,
            cropName: context.cropName,
            cropVariety: context.cropVariety,
            cropCategory: context.cropCategory,
            regionLevel: context.regionLevel,
            regionName: context.regionName,
            villageName: context.villageName,
            talukName: context.talukName,
            districtName: context.districtName,
            stateName: context.stateName,
            areaAcres,
            expectedHarvestDate: context.expectedHarvestDate ?? null,
            currentDemandKg,
            expectedDemandKg,
            governmentProcurementKg,
            exportDemandKg,
            retailDemandKg,
            industrialDemandKg,
            festivalDemandKg,
            demandDensityKgPerAcre,
            confidence,
            confidenceBand,
            explanation: summary,
            explanations,
            risk,
            seasonalAnalysis,
            timeline,
            recommendations,
            assessedAt: new Date(),
            version: 1,
        };
    }
    resolveBaseDemandPerAcre(context) {
        const yieldPerAcre = context.yieldExpectedKg > 0 && context.areaAcres > 0
            ? context.yieldExpectedKg / context.areaAcres
            : 1800;
        const priceSignal = context.marketModalPrice > 0
            ? Math.min(1.25, 0.85 + (context.marketModalPrice / 5000) * 0.4)
            : 1.0;
        return Math.max(500, yieldPerAcre * priceSignal);
    }
    resolvePriceFactor(context) {
        let factor = 1;
        if (context.marketTrendDirection === 'rising')
            factor += 0.12;
        if (context.marketTrendDirection === 'falling')
            factor -= 0.08;
        if (context.marketModalPrice > 0 && context.marketMaxPrice > 0) {
            const priceElasticity = (context.marketModalPrice / context.marketMaxPrice);
            factor += (priceElasticity - 0.8) * 0.1;
        }
        return (0, yield_rule_utils_1.clamp)(factor, 0.88, 1.18);
    }
    resolveSupplyFactor(context) {
        if (context.availableSupplyKg <= 0 || context.expectedSupplyKg <= 0)
            return 1;
        const supplyRatio = context.availableSupplyKg / context.expectedSupplyKg;
        if (supplyRatio < 0.5)
            return 1.18;
        if (supplyRatio < 0.7)
            return 1.12;
        if (supplyRatio < 0.85)
            return 1.06;
        if (supplyRatio >= 1.1)
            return 0.96;
        return 1;
    }
    resolveSeasonFactor(context) {
        const season = (0, yield_rule_utils_1.lower)(context.cropSeason ?? '');
        if (season.includes('kharif'))
            return 1.10;
        if (season.includes('rabi'))
            return 1.05;
        if (season.includes('zaid'))
            return 1.02;
        const month = context.currentMonth;
        if ([10, 11, 12, 1].includes(month))
            return 1.10;
        if ([3, 4, 5].includes(month))
            return 1.05;
        return 1;
    }
    resolveFestivalFactor(month) {
        return (0, yield_rule_utils_1.clamp)(FESTIVAL_DEMAND_MULTIPLIERS[month] ?? 1, 1, 1.30);
    }
    resolveExportFactor(context) {
        const cropLower = (0, yield_rule_utils_1.lower)(context.cropName);
        const isExport = EXPORT_CROP_KEYWORDS.some((keyword) => cropLower.includes(keyword));
        return isExport ? 1.20 : 1.0;
    }
    resolveProcurementFactor(context) {
        const cropLower = (0, yield_rule_utils_1.lower)(context.cropName);
        const isMsp = MSP_CROP_KEYWORDS.some((keyword) => cropLower.includes(keyword));
        return isMsp ? 1.15 : 1.0;
    }
    resolveWeatherFactor(context) {
        let factor = 1;
        if (context.weather.hasFloodRisk)
            factor += 0.08;
        if (context.weather.hasHeatStress)
            factor += 0.06;
        if (context.weather.hasColdStress)
            factor += 0.04;
        return (0, yield_rule_utils_1.clamp)(factor, 1.0, 1.20);
    }
    resolveHistoricalFactor(samples, benchmarkPerAcre) {
        if (!samples.length)
            return 1;
        const avgHistorical = samples.reduce((sum, v) => sum + v, 0) / samples.length;
        const delta = Math.abs(avgHistorical - benchmarkPerAcre) / Math.max(benchmarkPerAcre, 1);
        if (delta < 0.12)
            return 1.05;
        if (delta < 0.25)
            return 1.02;
        if (delta < 0.40)
            return 0.98;
        return 0.94;
    }
    buildDemandTimeline(context, expectedDemandKg, currentDemandKg) {
        const now = new Date();
        const harvestDate = context.expectedHarvestDate ?? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        const peakDate = new Date(harvestDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const declineDate = new Date(peakDate.getTime() + 21 * 24 * 60 * 60 * 1000);
        return [
            {
                label: 'today',
                date: now,
                expectedDemandKg: Math.round(expectedDemandKg * 0.12),
                currentDemandKg: Math.round(currentDemandKg * 0.10),
                explanation: 'Current demand is limited to existing market stock before fresh harvest arrives.',
            },
            {
                label: 'next-week',
                date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                expectedDemandKg: Math.round(expectedDemandKg * 0.28),
                currentDemandKg: Math.round(currentDemandKg * 0.24),
                explanation: 'Demand builds as harvest activity commences and supply begins to flow.',
            },
            {
                label: 'next-month',
                date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                expectedDemandKg: Math.round(expectedDemandKg * 0.72),
                currentDemandKg: Math.round(currentDemandKg * 0.68),
                explanation: 'Main harvest window drives peak procurement demand.',
            },
            {
                label: 'harvest-window',
                date: harvestDate,
                expectedDemandKg,
                currentDemandKg,
                explanation: 'Harvest window carries the peak demand across all channels.',
            },
            {
                label: 'demand-peak',
                date: peakDate,
                expectedDemandKg: Math.round(expectedDemandKg * 1.05),
                currentDemandKg: Math.round(currentDemandKg * 1.04),
                explanation: 'Demand peaks shortly after full harvest completion and market aggregation.',
            },
            {
                label: 'demand-decline',
                date: declineDate,
                expectedDemandKg: Math.round(expectedDemandKg * 0.60),
                currentDemandKg: Math.round(currentDemandKg * 0.58),
                explanation: 'Demand declines as market channel inventory builds and seasonal pressure eases.',
            },
        ];
    }
    buildSeasonalAnalysis(context, expectedDemandKg, currentDemandKg, festivalDemandKg) {
        const currentMonthStr = new Date().toISOString().slice(0, 7);
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const nextMonthStr = nextMonthDate.toISOString().slice(0, 7);
        const currentSeasonLabel = (0, yield_rule_utils_1.lower)(context.cropSeason ?? 'current');
        const nextSeasonLabel = currentSeasonLabel.includes('kharif') ? 'rabi' : currentSeasonLabel.includes('rabi') ? 'zaid' : 'next';
        return {
            currentSeasonDemandKg: currentDemandKg,
            nextSeasonDemandKg: Math.round(expectedDemandKg * 0.60),
            monthlyDemand: {
                [currentMonthStr]: currentDemandKg,
                [nextMonthStr]: Math.round(expectedDemandKg * 0.55),
            },
            weeklyDemand: {
                week1: Math.round(currentDemandKg * 0.22),
                week2: Math.round(currentDemandKg * 0.44),
                week3: Math.round(currentDemandKg * 0.72),
                week4: currentDemandKg,
            },
            cropWiseSeasonalDistribution: {
                [context.cropName]: currentDemandKg,
                [`${context.cropName}-${nextSeasonLabel}`]: Math.round(expectedDemandKg * 0.32),
            },
            festivalPremiumKg: festivalDemandKg,
            explanation: `Seasonal demand analysis projects ${currentDemandKg} kg in the current season and ${Math.round(expectedDemandKg * 0.60)} kg in the next for ${context.cropName}. Festival premium adds ${festivalDemandKg} kg in current period.`,
        };
    }
};
exports.RuleBasedDemandEstimatorEngine = RuleBasedDemandEstimatorEngine;
exports.RuleBasedDemandEstimatorEngine = RuleBasedDemandEstimatorEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [demand_risk_analyzer_engine_1.DemandRiskAnalyzerEngine,
        demand_confidence_calculator_engine_1.DemandConfidenceCalculatorEngine,
        demand_recommendation_engine_1.DemandRecommendationEngine])
], RuleBasedDemandEstimatorEngine);
//# sourceMappingURL=rule-based-demand-estimator.engine.js.map