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
exports.RuleBasedYieldEstimatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_risk_analyzer_engine_1 = require("./yield-risk-analyzer.engine");
const yield_confidence_calculator_engine_1 = require("./yield-confidence-calculator.engine");
const yield_quality_assessor_engine_1 = require("./yield-quality-assessor.engine");
const yield_loss_estimator_engine_1 = require("./yield-loss-estimator.engine");
const yield_recommendation_engine_1 = require("./yield-recommendation.engine");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let RuleBasedYieldEstimatorEngine = class RuleBasedYieldEstimatorEngine {
    riskAnalyzer;
    confidenceCalculator;
    qualityAssessor;
    lossEstimator;
    recommendationEngine;
    constructor(riskAnalyzer, confidenceCalculator, qualityAssessor, lossEstimator, recommendationEngine) {
        this.riskAnalyzer = riskAnalyzer;
        this.confidenceCalculator = confidenceCalculator;
        this.qualityAssessor = qualityAssessor;
        this.lossEstimator = lossEstimator;
        this.recommendationEngine = recommendationEngine;
    }
    estimate(context) {
        const explanations = [];
        const areaAcres = Math.max(0.1, (0, yield_rule_utils_1.safeNumber)(context.areaAcres, 1));
        const cropBaseYieldPerAcre = this.resolveBaseYieldPerAcre(context.cropName, context.cropCategory);
        const soilFactor = this.resolveSoilFactor(context.soilType, context.soilFertilityScore);
        const irrigationFactor = this.resolveIrrigationFactor(context.irrigationType);
        const weatherFactor = this.resolveWeatherFactor(context);
        const lifecycleFactor = this.resolveLifecycleFactor(context.lifecycle.lifecycleStage, context.readinessScore);
        const activityFactor = this.resolveActivityFactor(context.activities.completionRate);
        const varietyFactor = this.resolveVarietyFactor(context.cropVariety);
        const historyFactor = this.resolveHistoryFactor(context.historicalYieldSamples, cropBaseYieldPerAcre);
        const factors = [soilFactor, irrigationFactor, weatherFactor, lifecycleFactor, activityFactor, varietyFactor, historyFactor];
        const estimatedYieldPerAcreBeforeLoss = (0, yield_rule_utils_1.round)(cropBaseYieldPerAcre * factors.reduce((product, factor) => product * factor, 1), 2);
        const expectedProductionKg = Math.max(0, Math.round(estimatedYieldPerAcreBeforeLoss * areaAcres));
        const risk = this.riskAnalyzer.analyze(context);
        const confidenceAnalysis = this.confidenceCalculator.calculate(context, estimatedYieldPerAcreBeforeLoss);
        const quality = this.qualityAssessor.assess(context, estimatedYieldPerAcreBeforeLoss, confidenceAnalysis.confidence);
        const loss = this.lossEstimator.estimate(context, expectedProductionKg, risk.score);
        const expectedYieldKg = Math.max(0, expectedProductionKg - loss.expectedLossQuantityKg);
        const recommendations = this.recommendationEngine.recommend(context, risk, loss, confidenceAnalysis);
        explanations.push(`Base yield benchmark for ${context.cropName} is ${(0, yield_rule_utils_1.round)(cropBaseYieldPerAcre, 0)} kg/acre`, `Adjusted by soil (${(0, yield_rule_utils_1.formatPercent)((soilFactor - 1) * 100)}), irrigation (${(0, yield_rule_utils_1.formatPercent)((irrigationFactor - 1) * 100)}), weather (${(0, yield_rule_utils_1.formatPercent)((weatherFactor - 1) * 100)}), lifecycle (${(0, yield_rule_utils_1.formatPercent)((lifecycleFactor - 1) * 100)}), activity (${(0, yield_rule_utils_1.formatPercent)((activityFactor - 1) * 100)}), variety (${(0, yield_rule_utils_1.formatPercent)((varietyFactor - 1) * 100)}), and history (${(0, yield_rule_utils_1.formatPercent)((historyFactor - 1) * 100)})`, risk.explanation, confidenceAnalysis.explanation, quality.explanation, loss.explanation, recommendations.map((item) => item.explanation).join(' '));
        const summary = expectedYieldKg < expectedProductionKg
            ? `Expected yield reduced from ${expectedProductionKg} kg to ${expectedYieldKg} kg after ${(0, yield_rule_utils_1.formatPercent)(loss.expectedLossPercent)} projected loss.`
            : `Expected yield remains at ${expectedYieldKg} kg with no material loss expected.`;
        return {
            farmerCropId: context.farmerCropId,
            farmerProfileId: context.farmerProfileId,
            cropName: context.cropName,
            cropVariety: context.cropVariety,
            cropCategory: context.cropCategory,
            areaAcres,
            soilType: context.soilType,
            soilFertilityScore: context.soilFertilityScore,
            irrigationType: context.irrigationType,
            lifecycleStage: context.lifecycle.lifecycleStage,
            growthPercentage: context.lifecycle.growthPercentage,
            readinessScore: context.readinessScore,
            currentWeatherSummary: context.weather.weatherCondition ?? 'stable weather',
            expectedYieldKg,
            yieldPerAcreKg: (0, yield_rule_utils_1.round)(estimatedYieldPerAcreBeforeLoss, 2),
            expectedProductionKg,
            confidence: confidenceAnalysis.confidence,
            explanation: summary,
            explanations,
            risk,
            confidenceAnalysis,
            quality,
            loss,
            recommendations,
            historicalYieldKg: context.historicalYieldKg ?? null,
            historicalYieldSamples: context.historicalYieldSamples,
            weather: context.weather,
            weatherHistory: context.weatherHistory,
            activities: context.activities,
            lifecycle: context.lifecycle,
            assessedAt: new Date(),
            version: 1,
        };
    }
    resolveBaseYieldPerAcre(cropName, cropCategory) {
        const name = (0, yield_rule_utils_1.lower)(cropName);
        const category = (0, yield_rule_utils_1.lower)(cropCategory);
        if ((0, yield_rule_utils_1.containsAny)(name, ['paddy', 'rice']))
            return 2600;
        if ((0, yield_rule_utils_1.containsAny)(name, ['tomato']))
            return 14000;
        if ((0, yield_rule_utils_1.containsAny)(name, ['maize', 'corn']))
            return 3200;
        if ((0, yield_rule_utils_1.containsAny)(name, ['wheat']))
            return 1800;
        if ((0, yield_rule_utils_1.containsAny)(name, ['sugarcane']))
            return 32000;
        if ((0, yield_rule_utils_1.containsAny)(name, ['onion']))
            return 11000;
        if ((0, yield_rule_utils_1.containsAny)(category, ['vegetable']))
            return 9000;
        if ((0, yield_rule_utils_1.containsAny)(category, ['grain', 'cereal']))
            return 2400;
        return 2000;
    }
    resolveSoilFactor(soilType, soilFertilityScore = 60) {
        const soil = (0, yield_rule_utils_1.lower)(soilType);
        let factor = 0.9 + ((0, yield_rule_utils_1.clamp)(soilFertilityScore, 0, 100) / 250);
        if ((0, yield_rule_utils_1.containsAny)(soil, ['loam', 'alluvial']))
            factor += 0.08;
        if ((0, yield_rule_utils_1.containsAny)(soil, ['black', 'regur']))
            factor += 0.1;
        if ((0, yield_rule_utils_1.containsAny)(soil, ['red']))
            factor += 0.03;
        if ((0, yield_rule_utils_1.containsAny)(soil, ['sandy']))
            factor -= 0.08;
        if ((0, yield_rule_utils_1.containsAny)(soil, ['clay']))
            factor -= 0.02;
        if ((0, yield_rule_utils_1.containsAny)(soil, ['saline', 'alkaline']))
            factor -= 0.12;
        return (0, yield_rule_utils_1.clamp)(factor, 0.72, 1.18);
    }
    resolveIrrigationFactor(irrigationType) {
        const irrigation = (0, yield_rule_utils_1.lower)(irrigationType);
        if ((0, yield_rule_utils_1.containsAny)(irrigation, ['drip']))
            return 1.08;
        if ((0, yield_rule_utils_1.containsAny)(irrigation, ['sprinkler']))
            return 1.04;
        if ((0, yield_rule_utils_1.containsAny)(irrigation, ['canal', 'tank']))
            return 1.02;
        if ((0, yield_rule_utils_1.containsAny)(irrigation, ['bore', 'well']))
            return 1.03;
        if ((0, yield_rule_utils_1.containsAny)(irrigation, ['rainfed']))
            return 0.9;
        return 1;
    }
    resolveWeatherFactor(context) {
        const currentTemp = (0, yield_rule_utils_1.safeNumber)(context.weather.currentTemperature, 26);
        const currentRain = (0, yield_rule_utils_1.safeNumber)(context.weather.currentRainfall, 0);
        const historyTemps = context.weatherHistory.map((item) => item.temperature).filter((value) => typeof value === 'number');
        const historyRain = context.weatherHistory.map((item) => item.rainfall).filter((value) => typeof value === 'number');
        const avgTemp = historyTemps.length ? (0, yield_rule_utils_1.average)(historyTemps) : currentTemp;
        const avgRain = historyRain.length ? (0, yield_rule_utils_1.average)(historyRain) : currentRain;
        const tempPenalty = Math.min(0.18, Math.abs(currentTemp - avgTemp) / 200);
        const rainPenalty = Math.min(0.12, Math.abs(currentRain - avgRain) / 250);
        let factor = 1 - tempPenalty - rainPenalty;
        if (context.weather.hasHeatStress)
            factor -= 0.08;
        if (context.weather.hasFloodRisk)
            factor -= 0.1;
        if (context.weather.hasColdStress)
            factor -= 0.05;
        if (context.weather.hasRainForecast && !context.weather.hasFloodRisk)
            factor -= 0.02;
        return (0, yield_rule_utils_1.clamp)(factor, 0.72, 1.08);
    }
    resolveLifecycleFactor(lifecycleStage, readinessScore) {
        const stage = (0, yield_rule_utils_1.lower)(lifecycleStage);
        if (stage === 'ready')
            return 0.98;
        if (stage === 'ripening')
            return 1.02;
        if (stage === 'reproductive')
            return 1.04;
        if (stage === 'vegetative')
            return 1;
        if (stage === 'seedling')
            return 0.9;
        if (stage === 'overdue')
            return 0.95;
        return (0, yield_rule_utils_1.clamp)(0.9 + (readinessScore / 500), 0.85, 1.05);
    }
    resolveActivityFactor(completionRate) {
        return (0, yield_rule_utils_1.clamp)(0.78 + ((0, yield_rule_utils_1.clamp)(completionRate, 0, 100) / 100) * 0.28, 0.78, 1.06);
    }
    resolveVarietyFactor(cropVariety) {
        const variety = (0, yield_rule_utils_1.lower)(cropVariety);
        if (!variety)
            return 1;
        if ((0, yield_rule_utils_1.containsAny)(variety, ['hybrid', 'improved', 'certified']))
            return 1.08;
        if ((0, yield_rule_utils_1.containsAny)(variety, ['local', 'traditional']))
            return 0.97;
        if ((0, yield_rule_utils_1.containsAny)(variety, ['premium']))
            return 1.05;
        return 1;
    }
    resolveHistoryFactor(samples, benchmarkPerAcre) {
        if (!samples.length)
            return 1;
        const avgHistorical = (0, yield_rule_utils_1.average)(samples);
        const delta = Math.abs(avgHistorical - benchmarkPerAcre) / Math.max(benchmarkPerAcre, 1);
        if (delta < 0.12)
            return 1.05;
        if (delta < 0.25)
            return 1.02;
        if (delta < 0.4)
            return 0.98;
        return 0.94;
    }
};
exports.RuleBasedYieldEstimatorEngine = RuleBasedYieldEstimatorEngine;
exports.RuleBasedYieldEstimatorEngine = RuleBasedYieldEstimatorEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [yield_risk_analyzer_engine_1.YieldRiskAnalyzerEngine,
        yield_confidence_calculator_engine_1.YieldConfidenceCalculatorEngine,
        yield_quality_assessor_engine_1.YieldQualityAssessorEngine,
        yield_loss_estimator_engine_1.YieldLossEstimatorEngine,
        yield_recommendation_engine_1.YieldRecommendationEngineImpl])
], RuleBasedYieldEstimatorEngine);
//# sourceMappingURL=rule-based-yield-estimator.engine.js.map