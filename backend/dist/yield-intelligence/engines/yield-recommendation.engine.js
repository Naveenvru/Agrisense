"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldRecommendationEngineImpl = void 0;
const common_1 = require("@nestjs/common");
let YieldRecommendationEngineImpl = class YieldRecommendationEngineImpl {
    recommend(context, risk, loss, confidence) {
        const recommendations = [];
        if (context.weather.hasHeatStress || (context.weather.currentTemperature ?? 26) >= 38) {
            recommendations.push({
                action: 'Increase irrigation frequency',
                expectedImpact: 'Reduces heat stress and supports grain filling',
                confidence: 84,
                priority: 1,
                explanation: 'Heat stress is active, so additional moisture will protect yield potential.',
            });
        }
        if (context.soilFertilityScore < 55 || loss.reasons.some((reason) => reason.toLowerCase().includes('fertility'))) {
            recommendations.push({
                action: 'Apply fertilizer or nutrient correction',
                expectedImpact: 'Improves plant nutrition and crop uniformity',
                confidence: 78,
                priority: 1,
                explanation: 'Soil fertility indicators suggest nutrient supplementation is needed.',
            });
        }
        if (risk.level === 'high' || risk.level === 'critical') {
            recommendations.push({
                action: 'Monitor disease and pest pressure closely',
                expectedImpact: 'Detects problems early and limits downstream loss',
                confidence: 81,
                priority: 2,
                explanation: 'High risk conditions justify daily scouting and faster response times.',
            });
        }
        if (context.activities.hasLateIrrigation || context.activities.hasMissedActivities) {
            recommendations.push({
                action: 'Complete delayed farm activities immediately',
                expectedImpact: 'Improves growth consistency and stabilises yield',
                confidence: 88,
                priority: 1,
                explanation: 'Late activities are one of the fastest paths to avoidable yield loss.',
            });
        }
        if (context.lifecycle.daysRemaining <= 10 && confidence.confidence >= 70) {
            recommendations.push({
                action: 'Prepare for harvest',
                expectedImpact: 'Reduces post-maturity loss and improves produce quality',
                confidence: 82,
                priority: 2,
                explanation: 'The crop is nearing harvest readiness and operational preparation is prudent.',
            });
        }
        if (loss.expectedLossPercent >= 20) {
            recommendations.push({
                action: 'Review flood and drainage controls',
                expectedImpact: 'Protects crop area from waterlogging and runoff damage',
                confidence: 76,
                priority: 1,
                explanation: 'Current loss projection indicates water-related stress could become expensive.',
            });
        }
        if (!recommendations.length) {
            recommendations.push({
                action: 'Maintain current crop management plan',
                expectedImpact: 'Preserves the current yield trajectory',
                confidence: 65,
                priority: 3,
                explanation: 'No corrective action is required right now because crop conditions are stable.',
            });
        }
        return recommendations.sort((a, b) => a.priority - b.priority || b.confidence - a.confidence);
    }
};
exports.YieldRecommendationEngineImpl = YieldRecommendationEngineImpl;
exports.YieldRecommendationEngineImpl = YieldRecommendationEngineImpl = __decorate([
    (0, common_1.Injectable)()
], YieldRecommendationEngineImpl);
//# sourceMappingURL=yield-recommendation.engine.js.map