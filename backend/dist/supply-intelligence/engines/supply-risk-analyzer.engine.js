"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyRiskAnalyzerEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let SupplyRiskAnalyzerEngine = class SupplyRiskAnalyzerEngine {
    analyze(context, expectedSupplyKg, availableSupplyKg) {
        const reasons = [];
        const mitigations = [];
        let score = 0;
        const supplyDropPercent = expectedSupplyKg > 0
            ? Math.max(0, ((expectedSupplyKg - availableSupplyKg) / expectedSupplyKg) * 100)
            : 0;
        if (supplyDropPercent >= 35) {
            score += 28;
            reasons.push('Projected available supply is materially below expected supply');
            mitigations.push('Review harvest logistics and post-harvest handling to reduce leakage');
        }
        else if (supplyDropPercent >= 20) {
            score += 16;
            reasons.push('Projected supply reduction is moderate');
        }
        if (context.weather.hasFloodRisk || (0, yield_rule_utils_1.safeNumber)(context.weather.currentRainfall, 0) >= 45) {
            score += 20;
            reasons.push('Flood or heavy rainfall may delay harvest movement');
            mitigations.push('Improve drainage and prepare protected transport routes');
        }
        if (context.weather.hasHeatStress || (context.weather.currentTemperature ?? 0) >= 38) {
            score += 10;
            reasons.push('Heat stress can accelerate quality loss and shrink marketable supply');
            mitigations.push('Accelerate harvesting and shade harvested stock immediately');
        }
        if (context.harvestReadinessScore < 45 || (0, yield_rule_utils_1.lower)(context.harvestStage).includes('delayed')) {
            score += 18;
            reasons.push('Harvest readiness is low or delayed');
            mitigations.push('Close any remaining harvest gaps and track field maturity daily');
        }
        if (context.yieldRiskLevel === 'high' || context.yieldRiskLevel === 'critical') {
            score += 16;
            reasons.push('Yield reduction risk is elevated');
            mitigations.push('Protect standing crop with closer irrigation and disease monitoring');
        }
        if (context.harvestRiskLevel === 'high' || context.harvestRiskLevel === 'critical') {
            score += 14;
            reasons.push('Harvest risk is already elevated');
            mitigations.push('Prepare equipment and labour to avoid further delay');
        }
        if (context.yieldExplanations.some((item) => /disease|pest/i.test(item))) {
            score += 12;
            reasons.push('Disease or pest pressure may reduce marketable volume');
            mitigations.push('Scout for disease and pests and apply control measures early');
        }
        if (context.regionalEventNotes.length > 0) {
            score += 8;
            reasons.push('Regional event conditions may affect movement or aggregation');
            mitigations.push('Monitor local logistics and market access conditions');
        }
        const level = score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
        const explanation = reasons.length
            ? `Supply risk is ${level} (${(0, yield_rule_utils_1.formatPercent)((0, yield_rule_utils_1.clamp)(score, 0, 100))}) because ${reasons.join(', ').toLowerCase()}.`
            : 'Supply risk is low because harvest readiness, weather, and yield outlook are stable.';
        return {
            level,
            score: (0, yield_rule_utils_1.clamp)(score, 0, 100),
            reasons,
            mitigationRecommendations: mitigations.length ? [...new Set(mitigations)] : ['Maintain current harvest and logistics plan'],
            explanation,
        };
    }
};
exports.SupplyRiskAnalyzerEngine = SupplyRiskAnalyzerEngine;
exports.SupplyRiskAnalyzerEngine = SupplyRiskAnalyzerEngine = __decorate([
    (0, common_1.Injectable)()
], SupplyRiskAnalyzerEngine);
//# sourceMappingURL=supply-risk-analyzer.engine.js.map