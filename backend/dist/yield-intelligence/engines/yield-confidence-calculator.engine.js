"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldConfidenceCalculatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let YieldConfidenceCalculatorEngine = class YieldConfidenceCalculatorEngine {
    calculate(context, yieldPerAcreKg) {
        const reasons = [];
        const history = context.weatherHistory;
        const temperatures = history.map((entry) => entry.temperature).filter((value) => typeof value === 'number');
        const rainfalls = history.map((entry) => entry.rainfall).filter((value) => typeof value === 'number');
        const temperatureStability = temperatures.length > 1
            ? Math.max(0, 100 - (0, yield_rule_utils_1.average)(temperatures.map((value) => Math.abs(value - (0, yield_rule_utils_1.average)(temperatures)))) * 4)
            : 82;
        const rainfallStability = rainfalls.length > 1
            ? Math.max(0, 100 - (0, yield_rule_utils_1.average)(rainfalls.map((value) => Math.abs(value - (0, yield_rule_utils_1.average)(rainfalls)))) * 2)
            : 80;
        let confidence = 58;
        confidence += (temperatureStability - 50) * 0.18;
        confidence += (rainfallStability - 50) * 0.12;
        if (context.riskLevelEquivalent?.toLowerCase?.() === 'low')
            confidence += 8;
        if (context.activities.completionRate >= 80)
            confidence += 10;
        if (context.activities.completionRate >= 95)
            confidence += 4;
        if (context.soilFertilityScore >= 70)
            confidence += 8;
        if (context.soilFertilityScore < 40)
            confidence -= 10;
        if (context.historicalYieldSamples.length > 0) {
            const historicalAvg = (0, yield_rule_utils_1.average)(context.historicalYieldSamples);
            const delta = Math.abs(yieldPerAcreKg - historicalAvg) / Math.max(historicalAvg, 1);
            confidence += delta < 0.15 ? 8 : delta < 0.35 ? 3 : -7;
            reasons.push(`Historical yield comparison indicates ${(delta < 0.15 ? 'strong' : delta < 0.35 ? 'moderate' : 'weak')} consistency`);
        }
        const growthConsistency = context.lifecycle.durationDays > 0
            ? (0, yield_rule_utils_1.clamp)(100 - Math.abs(context.lifecycle.growthPercentage - ((context.lifecycle.daysElapsed / context.lifecycle.durationDays) * 100)), 0, 100)
            : 70;
        confidence += (growthConsistency - 50) * 0.12;
        const band = confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';
        const score = (0, yield_rule_utils_1.clamp)(Math.round(confidence), 0, 100);
        if (context.activities.completionRate < 60) {
            reasons.push('Task completion is below target');
        }
        if (context.weather.hasFloodRisk || context.weather.hasHeatStress) {
            reasons.push('Weather variability is reducing confidence');
        }
        if (context.soilFertilityScore >= 70) {
            reasons.push('Soil fertility supports stable output');
        }
        const explanation = reasons.length
            ? `Yield confidence is ${(0, yield_rule_utils_1.formatPercent)(score)} because ${reasons.join('; ').toLowerCase()}.`
            : `Yield confidence is ${(0, yield_rule_utils_1.formatPercent)(score)} based on stable weather, healthy soil, and consistent crop progress.`;
        return { confidence: score, band, reasons, explanation };
    }
};
exports.YieldConfidenceCalculatorEngine = YieldConfidenceCalculatorEngine;
exports.YieldConfidenceCalculatorEngine = YieldConfidenceCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], YieldConfidenceCalculatorEngine);
//# sourceMappingURL=yield-confidence-calculator.engine.js.map