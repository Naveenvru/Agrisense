"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandRiskAnalyzerEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let DemandRiskAnalyzerEngine = class DemandRiskAnalyzerEngine {
    analyze(context, expectedDemandKg) {
        const reasons = [];
        const mitigations = [];
        let score = 0;
        if (context.priceTrend === 'falling') {
            score += 20;
            reasons.push('Price trend is falling, which weakens buyer urgency');
            mitigations.push('Track discount pressure and widen distribution channels');
        }
        if (context.supplyPressureIndex > 0.65) {
            score += 22;
            reasons.push('High supply pressure can suppress demand interest');
            mitigations.push('Coordinate releases to avoid oversupply in the market');
        }
        if (context.recentTransactionCount < 5) {
            score += 15;
            reasons.push('Recent transaction volume is low');
            mitigations.push('Promote the crop in active market channels and buyer groups');
        }
        if (context.recentBuyerCount < 3) {
            score += 12;
            reasons.push('Buyer participation is limited');
            mitigations.push('Engage new wholesale and retail buyers');
        }
        if (context.marketMomentumIndex < 0.4) {
            score += 14;
            reasons.push('Market momentum is weak');
            mitigations.push('Use market intelligence to time promotions better');
        }
        if (context.weatherSignals.some((signal) => /flood|storm|heat/i.test(signal))) {
            score += 8;
            reasons.push('Weather disruptions may affect buyer activity and logistics');
            mitigations.push('Monitor weather-driven demand swings and logistics constraints');
        }
        if (context.regionalEventNotes.length > 0) {
            score += 8;
            reasons.push('Regional events may affect market participation');
            mitigations.push('Watch regional movement and market access conditions');
        }
        const expectedSignal = expectedDemandKg > 0 ? expectedDemandKg : (0, yield_rule_utils_1.safeNumber)(context.currentPrice, 0);
        if (expectedSignal > 0 && context.seasonalDemandIndex < 0.8) {
            score += 6;
            reasons.push('Seasonal demand is below peak levels');
        }
        const level = score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
        const explanation = reasons.length
            ? `Demand risk is ${level} (${(0, yield_rule_utils_1.formatPercent)((0, yield_rule_utils_1.clamp)(score, 0, 100))}) because ${reasons.join(', ').toLowerCase()}.`
            : 'Demand risk is low because market momentum and buyer activity are stable.';
        return {
            level,
            score: (0, yield_rule_utils_1.clamp)(score, 0, 100),
            reasons,
            mitigationRecommendations: mitigations.length ? [...new Set(mitigations)] : ['Maintain current demand outreach plan'],
            explanation,
        };
    }
};
exports.DemandRiskAnalyzerEngine = DemandRiskAnalyzerEngine;
exports.DemandRiskAnalyzerEngine = DemandRiskAnalyzerEngine = __decorate([
    (0, common_1.Injectable)()
], DemandRiskAnalyzerEngine);
//# sourceMappingURL=demand-risk-analyzer.engine.js.map