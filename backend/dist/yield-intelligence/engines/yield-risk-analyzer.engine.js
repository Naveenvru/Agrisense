"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldRiskAnalyzerEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let YieldRiskAnalyzerEngine = class YieldRiskAnalyzerEngine {
    analyze(context) {
        const reasons = [];
        const mitigations = [];
        let score = 0;
        const weatherRain = context.weather.currentRainfall ?? 0;
        const weatherTemp = context.weather.currentTemperature ?? 26;
        const weatherCondition = (0, yield_rule_utils_1.lower)(context.weather.weatherCondition);
        if (context.weather.hasFloodRisk || weatherRain > 45 || weatherCondition.includes('rain')) {
            score += 30;
            reasons.push('Flood or heavy rainfall risk detected');
            mitigations.push('Improve drainage and avoid field entry during heavy rainfall');
        }
        if (context.weather.hasHeatStress || weatherTemp >= 38) {
            score += 18;
            reasons.push('Heat stress can reduce grain filling and fruit set');
            mitigations.push('Increase irrigation frequency and apply mulch where possible');
        }
        if (context.weather.hasColdStress || weatherTemp <= 12) {
            score += 12;
            reasons.push('Cold stress can slow crop development');
            mitigations.push('Delay sensitive sprays and protect seedlings from cold wind');
        }
        if (context.activities.hasLateIrrigation) {
            score += 18;
            reasons.push('Late irrigation activity detected');
            mitigations.push('Restore irrigation schedule immediately');
        }
        if (context.activities.hasLateFertilizer) {
            score += 12;
            reasons.push('Late fertilizer application detected');
            mitigations.push('Apply balanced fertilizer as soon as field conditions allow');
        }
        if (context.activities.hasMissedActivities) {
            score += 10;
            reasons.push('Some farm activities are overdue');
            mitigations.push('Complete missed activities to prevent yield loss');
        }
        if (context.soilFertilityScore < 45) {
            score += 14;
            reasons.push('Soil fertility is below optimal range');
            mitigations.push('Apply organic manure or nutrient corrections based on soil test');
        }
        if ((context.irrigationType ?? '').toLowerCase().includes('rainfed')) {
            score += 12;
            reasons.push('Rainfed irrigation increases dependency on weather');
            mitigations.push('Use supplemental irrigation during dry spells');
        }
        if (context.readinessScore < 35) {
            score += 8;
            reasons.push('Crop is still early in the growth cycle');
            mitigations.push('Monitor growth consistency and avoid stress events');
        }
        const level = score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
        const explanation = reasons.length
            ? `Yield risk is ${level} (${(0, yield_rule_utils_1.formatPercent)((0, yield_rule_utils_1.clamp)(score, 0, 100))}) because ${reasons.join(', ').toLowerCase()}.`
            : 'Yield risk is low because weather, soil, and farm activities are currently stable.';
        return {
            level,
            score: (0, yield_rule_utils_1.clamp)(score, 0, 100),
            reasons,
            mitigationRecommendations: mitigations.length ? [...new Set(mitigations)] : ['Maintain current crop management practices'],
            explanation,
        };
    }
};
exports.YieldRiskAnalyzerEngine = YieldRiskAnalyzerEngine;
exports.YieldRiskAnalyzerEngine = YieldRiskAnalyzerEngine = __decorate([
    (0, common_1.Injectable)()
], YieldRiskAnalyzerEngine);
//# sourceMappingURL=yield-risk-analyzer.engine.js.map