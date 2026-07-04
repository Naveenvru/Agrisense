"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldLossEstimatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let YieldLossEstimatorEngine = class YieldLossEstimatorEngine {
    estimate(context, yieldBeforeLossKg, riskScore) {
        const reasons = [];
        let lossPercent = 0;
        if (context.weather.hasFloodRisk) {
            lossPercent += 12;
            reasons.push('Flood risk may damage roots or delay harvest operations');
        }
        if (context.weather.hasHeatStress) {
            lossPercent += 8;
            reasons.push('Heat stress reduces pollination and grain filling');
        }
        if (context.weather.hasRainForecast) {
            lossPercent += 5;
            reasons.push('Rain forecast may interrupt field operations');
        }
        if (context.activities.hasLateIrrigation) {
            lossPercent += 8;
            reasons.push('Late irrigation can cause water stress');
        }
        if (context.activities.hasLateFertilizer) {
            lossPercent += 6;
            reasons.push('Late fertilizer application can limit nutrient uptake');
        }
        if (context.soilFertilityScore < 50) {
            lossPercent += 7;
            reasons.push('Poor soil fertility can reduce nutrient availability');
        }
        const weatherCondition = (0, yield_rule_utils_1.lower)(context.weather.weatherCondition);
        if (weatherCondition.includes('storm') || weatherCondition.includes('hail')) {
            lossPercent += 10;
            reasons.push('Severe weather can cause direct crop damage');
        }
        if (riskScore >= 70) {
            lossPercent += 6;
            reasons.push('Critical risk profile increases overall loss expectation');
        }
        else if (riskScore >= 45) {
            lossPercent += 3;
            reasons.push('Elevated risk profile increases potential loss');
        }
        const expectedLossPercent = (0, yield_rule_utils_1.clamp)(Math.round(lossPercent), 0, 65);
        const expectedLossQuantityKg = Math.max(0, Math.round(yieldBeforeLossKg * (expectedLossPercent / 100)));
        const explanation = reasons.length
            ? `Expected yield loss is ${(0, yield_rule_utils_1.formatPercent)(expectedLossPercent)} because ${reasons.join('; ').toLowerCase()}.`
            : 'Expected yield loss is low because current crop conditions are stable.';
        return {
            expectedLossPercent,
            expectedLossQuantityKg,
            reasons,
            explanation,
        };
    }
};
exports.YieldLossEstimatorEngine = YieldLossEstimatorEngine;
exports.YieldLossEstimatorEngine = YieldLossEstimatorEngine = __decorate([
    (0, common_1.Injectable)()
], YieldLossEstimatorEngine);
//# sourceMappingURL=yield-loss-estimator.engine.js.map