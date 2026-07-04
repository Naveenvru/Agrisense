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
        const baseTransactions = Math.max(1, context.recentTransactionCount);
        const buyerFactor = 0.9 + (0, yield_rule_utils_1.clamp)(context.recentBuyerCount, 1, 20) / 100;
        const seasonalFactor = 0.8 + (0, yield_rule_utils_1.clamp)(context.seasonalDemandIndex, 0, 1.5) * 0.3;
        const momentumFactor = 0.85 + (0, yield_rule_utils_1.clamp)(context.marketMomentumIndex, 0, 1.5) * 0.25;
        const supplyPressureFactor = 1 - (0, yield_rule_utils_1.clamp)(context.supplyPressureIndex, 0, 1) * 0.2;
        const priceFactor = context.priceTrend === 'rising' ? 1.08 : context.priceTrend === 'falling' ? 0.92 : 1;
        const currentPriceFactor = context.currentPrice && context.currentPrice > 0 ? 0.98 + Math.min(0.08, context.currentPrice / 100000) : 1;
        const expectedDemandKg = Math.max(0, Math.round(baseTransactions * 100 * buyerFactor * seasonalFactor * momentumFactor * supplyPressureFactor * priceFactor * currentPriceFactor));
        const risk = this.riskAnalyzer.analyze(context, expectedDemandKg);
        const confidence = this.confidenceCalculator.calculate(context, expectedDemandKg);
        const recommendations = this.recommendationEngine.recommend(context, risk);
        const demandDensityKgPerTransaction = (0, yield_rule_utils_1.round)(expectedDemandKg / Math.max(1, baseTransactions), 2);
        const trend = context.priceTrend === 'rising' ? 'rising' : context.priceTrend === 'falling' ? 'falling' : 'stable';
        const confidenceBand = confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';
        explanations.push(`Base demand is inferred from ${baseTransactions} recent transactions and ${context.recentBuyerCount} active buyers`, `Adjusted by season (${(0, yield_rule_utils_1.formatPercent)((seasonalFactor - 1) * 100)}), momentum (${(0, yield_rule_utils_1.formatPercent)((momentumFactor - 1) * 100)}), supply pressure (${(0, yield_rule_utils_1.formatPercent)((supplyPressureFactor - 1) * 100)}), and price trend (${(0, yield_rule_utils_1.formatPercent)((priceFactor - 1) * 100)})`, risk.explanation, recommendations.map((item) => item.explanation).join(' '));
        return {
            cropName: context.cropName,
            cropCategory: context.cropCategory,
            regionLevel: context.regionLevel,
            regionName: context.regionName,
            expectedDemandKg,
            demandDensityKgPerTransaction,
            confidence,
            confidenceBand,
            trend,
            risk,
            explanation: `Expected demand for ${context.cropName} is ${expectedDemandKg} kg in ${context.regionName}.`,
            explanations,
            recommendations,
            assessedAt: new Date(),
            version: 1,
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