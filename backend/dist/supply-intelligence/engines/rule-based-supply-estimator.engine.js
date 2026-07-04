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
exports.RuleBasedSupplyEstimatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
const supply_risk_analyzer_engine_1 = require("./supply-risk-analyzer.engine");
const supply_confidence_calculator_engine_1 = require("./supply-confidence-calculator.engine");
const supply_recommendation_engine_1 = require("./supply-recommendation.engine");
let RuleBasedSupplyEstimatorEngine = class RuleBasedSupplyEstimatorEngine {
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
        const baseSupplyPerAcre = this.resolveBaseSupplyPerAcre(context);
        const harvestFactor = this.resolveHarvestFactor(context);
        const yieldFactor = this.resolveYieldFactor(context);
        const weatherFactor = this.resolveWeatherFactor(context);
        const activityFactor = this.resolveActivityFactor(context.activities.completionRate);
        const regionFactor = this.resolveRegionFactor(context.regionLevel, context.regionName);
        const historicalFactor = this.resolveHistoricalFactor(context.historicalSupplyKg, baseSupplyPerAcre);
        const factors = [harvestFactor, yieldFactor, weatherFactor, activityFactor, regionFactor, historicalFactor];
        const projectedSupplyPerAcre = (0, yield_rule_utils_1.round)(baseSupplyPerAcre * factors.reduce((product, factor) => product * factor, 1), 2);
        const expectedSupplyKg = Math.max(0, Math.round(projectedSupplyPerAcre * areaAcres));
        const preliminaryRisk = this.riskAnalyzer.analyze(context, expectedSupplyKg, Math.round(expectedSupplyKg * 0.9));
        const availableSupplyKg = Math.max(0, Math.round(expectedSupplyKg * this.resolveAvailabilityFactor(context, preliminaryRisk.score)));
        const risk = this.riskAnalyzer.analyze(context, expectedSupplyKg, availableSupplyKg);
        const confidence = this.confidenceCalculator.calculate(context, expectedSupplyKg, availableSupplyKg);
        const supplyDensityKgPerAcre = (0, yield_rule_utils_1.round)(expectedSupplyKg / areaAcres, 2);
        const supplyDropPercent = expectedSupplyKg > 0 ? Math.max(0, ((expectedSupplyKg - availableSupplyKg) / expectedSupplyKg) * 100) : 0;
        const recommendations = this.recommendationEngine.recommend(context, risk, supplyDropPercent);
        const timeline = this.buildTimeline(context, expectedSupplyKg, availableSupplyKg);
        const seasonalAnalysis = this.buildSeasonalAnalysis(context, expectedSupplyKg, availableSupplyKg);
        const confidenceBand = confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';
        explanations.push(`Base supply benchmark for ${context.cropName} is ${(0, yield_rule_utils_1.round)(baseSupplyPerAcre, 0)} kg/acre`, `Adjusted by harvest (${(0, yield_rule_utils_1.formatPercent)((harvestFactor - 1) * 100)}), yield (${(0, yield_rule_utils_1.formatPercent)((yieldFactor - 1) * 100)}), weather (${(0, yield_rule_utils_1.formatPercent)((weatherFactor - 1) * 100)}), activities (${(0, yield_rule_utils_1.formatPercent)((activityFactor - 1) * 100)}), region (${(0, yield_rule_utils_1.formatPercent)((regionFactor - 1) * 100)}), and history (${(0, yield_rule_utils_1.formatPercent)((historicalFactor - 1) * 100)})`, risk.explanation, `Available supply projected at ${availableSupplyKg} kg after operational and weather adjustments.`, seasonalAnalysis.explanation, recommendations.map((item) => item.explanation).join(' '));
        const summary = availableSupplyKg < expectedSupplyKg
            ? `Expected supply reduced from ${expectedSupplyKg} kg to ${availableSupplyKg} kg after ${(0, yield_rule_utils_1.formatPercent)(supplyDropPercent)} projected constraints.`
            : `Expected supply remains at ${availableSupplyKg} kg with stable harvest and logistics conditions.`;
        return {
            farmerCropId: context.farmerCropId,
            farmerProfileId: context.farmerProfileId,
            cropName: context.cropName,
            cropVariety: context.cropVariety,
            cropCategory: context.cropCategory,
            regionLevel: context.regionLevel,
            regionName: context.regionName,
            areaAcres,
            expectedHarvestDate: context.expectedHarvestDate ?? null,
            expectedSupplyKg,
            expectedYieldKg: context.yieldExpectedKg,
            availableSupplyKg,
            supplyDensityKgPerAcre,
            confidence,
            confidenceBand,
            explanation: summary,
            explanations,
            risk,
            seasonalAnalysis,
            timeline,
            recommendations,
            harvestStage: context.harvestStage,
            yieldStage: context.yieldRiskLevel,
            weatherSummary: context.weather.weatherCondition ?? 'stable weather',
            assessedAt: new Date(),
            version: 1,
        };
    }
    resolveBaseSupplyPerAcre(context) {
        const fallback = context.yieldExpectedKg > 0 && context.areaAcres > 0 ? context.yieldExpectedKg / context.areaAcres : 1800;
        const harvestSignal = context.harvestReadinessScore > 0 ? context.harvestReadinessScore / 100 : 1;
        return Math.max(500, fallback * (0.85 + harvestSignal * 0.25));
    }
    resolveHarvestFactor(context) {
        const stage = (0, yield_rule_utils_1.lower)(context.harvestStage);
        let factor = 1;
        if (stage.includes('ready'))
            factor += 0.08;
        if (stage.includes('delayed') || stage.includes('overdue'))
            factor -= 0.18;
        if (context.harvestReadinessScore >= 80)
            factor += 0.05;
        if (context.harvestReadinessScore < 40)
            factor -= 0.12;
        return (0, yield_rule_utils_1.clamp)(factor, 0.7, 1.15);
    }
    resolveYieldFactor(context) {
        let factor = 1;
        if (context.yieldRiskLevel === 'low')
            factor += 0.06;
        if (context.yieldRiskLevel === 'high')
            factor -= 0.14;
        if (context.yieldRiskLevel === 'critical')
            factor -= 0.22;
        if (context.yieldConfidence >= 80)
            factor += 0.05;
        if (context.yieldConfidence < 55)
            factor -= 0.1;
        return (0, yield_rule_utils_1.clamp)(factor, 0.7, 1.12);
    }
    resolveWeatherFactor(context) {
        const temp = (0, yield_rule_utils_1.safeNumber)(context.weather.currentTemperature, 26);
        const rain = (0, yield_rule_utils_1.safeNumber)(context.weather.currentRainfall, 0);
        let factor = 1;
        if (context.weather.hasFloodRisk)
            factor -= 0.12;
        if (context.weather.hasHeatStress)
            factor -= 0.08;
        if (context.weather.hasRainForecast)
            factor -= 0.04;
        if (temp >= 38)
            factor -= 0.05;
        if (rain > 30)
            factor -= 0.06;
        return (0, yield_rule_utils_1.clamp)(factor, 0.72, 1.06);
    }
    resolveActivityFactor(completionRate) {
        return (0, yield_rule_utils_1.clamp)(0.8 + ((0, yield_rule_utils_1.clamp)(completionRate, 0, 100) / 100) * 0.24, 0.8, 1.04);
    }
    resolveRegionFactor(regionLevel, regionName) {
        const name = (0, yield_rule_utils_1.lower)(regionName);
        let factor = regionLevel === 'state' ? 1.02 : regionLevel === 'district' ? 1.01 : 1;
        if (name.includes('highland'))
            factor -= 0.03;
        return (0, yield_rule_utils_1.clamp)(factor, 0.96, 1.05);
    }
    resolveHistoricalFactor(samples, benchmarkPerAcre) {
        if (!samples.length)
            return 1;
        const avgHistorical = samples.reduce((sum, value) => sum + value, 0) / samples.length;
        const delta = Math.abs(avgHistorical - benchmarkPerAcre) / Math.max(benchmarkPerAcre, 1);
        if (delta < 0.12)
            return 1.05;
        if (delta < 0.25)
            return 1.02;
        if (delta < 0.4)
            return 0.98;
        return 0.94;
    }
    resolveAvailabilityFactor(context, riskScore) {
        let factor = 0.92;
        if (context.harvestReadinessScore >= 80)
            factor += 0.06;
        if (context.weather.hasFloodRisk || context.weather.hasHeatStress)
            factor -= 0.08;
        if (context.yieldRiskLevel === 'high' || context.yieldRiskLevel === 'critical')
            factor -= 0.1;
        if (riskScore >= 70)
            factor -= 0.08;
        if (context.regionalEventNotes.length > 0)
            factor -= 0.04;
        return (0, yield_rule_utils_1.clamp)(factor, 0.68, 1.02);
    }
    buildTimeline(context, expectedSupplyKg, availableSupplyKg) {
        const now = new Date();
        const harvestDate = context.expectedHarvestDate ?? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        const peakDate = new Date(harvestDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const declineDate = new Date(peakDate.getTime() + 21 * 24 * 60 * 60 * 1000);
        return [
            { label: 'today', date: now, expectedSupplyKg: Math.round(expectedSupplyKg * 0.15), availableSupplyKg: Math.round(availableSupplyKg * 0.1), explanation: 'Current day supply is limited to already harvested stock.' },
            { label: 'next-week', date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), expectedSupplyKg: Math.round(expectedSupplyKg * 0.3), availableSupplyKg: Math.round(availableSupplyKg * 0.25), explanation: 'Next week supply expands as harvest activity progresses.' },
            { label: 'next-month', date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), expectedSupplyKg: Math.round(expectedSupplyKg * 0.75), availableSupplyKg: Math.round(availableSupplyKg * 0.7), explanation: 'Next month supply reflects the main harvest window.' },
            { label: 'harvest-window', date: harvestDate, expectedSupplyKg, availableSupplyKg, explanation: 'Harvest window carries the main expected supply volume.' },
            { label: 'supply-peak', date: peakDate, expectedSupplyKg: Math.round(expectedSupplyKg * 1.02), availableSupplyKg: Math.round(availableSupplyKg * 1.02), explanation: 'Supply peak occurs shortly after harvest completion and aggregation.' },
            { label: 'supply-decline', date: declineDate, expectedSupplyKg: Math.round(expectedSupplyKg * 0.62), availableSupplyKg: Math.round(availableSupplyKg * 0.6), explanation: 'Supply decline reflects post-peak movement into market channels.' },
        ];
    }
    buildSeasonalAnalysis(context, expectedSupplyKg, availableSupplyKg) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const nextMonth = nextMonthDate.toISOString().slice(0, 7);
        const currentSeason = (0, yield_rule_utils_1.lower)(String(context.cropCategory ?? 'current')) || 'current';
        const nextSeason = currentSeason.includes('grain') ? 'next-cereal' : currentSeason.includes('vegetable') ? 'next-vegetable' : 'next';
        return {
            currentSeasonSupplyKg: availableSupplyKg,
            nextSeasonSupplyKg: Math.round(expectedSupplyKg * 0.65),
            monthlySupply: { [currentMonth]: availableSupplyKg, [nextMonth]: Math.round(expectedSupplyKg * 0.58) },
            weeklySupply: { week1: Math.round(availableSupplyKg * 0.25), week2: Math.round(availableSupplyKg * 0.45), week3: Math.round(availableSupplyKg * 0.7), week4: availableSupplyKg },
            cropWiseSeasonalDistribution: { [context.cropName]: availableSupplyKg, [`${context.cropName}-${nextSeason}`]: Math.round(expectedSupplyKg * 0.35) },
            explanation: `Seasonal supply analysis projects ${availableSupplyKg} kg in the current season and ${Math.round(expectedSupplyKg * 0.65)} kg in the next season for ${context.cropName}.`,
        };
    }
};
exports.RuleBasedSupplyEstimatorEngine = RuleBasedSupplyEstimatorEngine;
exports.RuleBasedSupplyEstimatorEngine = RuleBasedSupplyEstimatorEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supply_risk_analyzer_engine_1.SupplyRiskAnalyzerEngine,
        supply_confidence_calculator_engine_1.SupplyConfidenceCalculatorEngine,
        supply_recommendation_engine_1.SupplyRecommendationEngine])
], RuleBasedSupplyEstimatorEngine);
//# sourceMappingURL=rule-based-supply-estimator.engine.js.map