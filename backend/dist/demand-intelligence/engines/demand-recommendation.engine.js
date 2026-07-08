"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandRecommendationEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let DemandRecommendationEngine = class DemandRecommendationEngine {
    recommend(context, risk, demandGapPercent) {
        const recommendations = [];
        if (risk.level === 'high' || risk.level === 'critical') {
            recommendations.push({
                action: 'Activate emergency procurement from alternative regions',
                expectedImpact: 'Reduces supply shortfall and stabilises demand fulfilment',
                confidence: 88,
                priority: 1,
                explanation: 'High demand risk requires immediate sourcing diversification to avoid market disruption.',
            });
        }
        if (context.marketTrendDirection === 'rising' && context.isMspCrop) {
            recommendations.push({
                action: 'Engage government MSP procurement channels immediately',
                expectedImpact: 'Provides price floor and assured volume for farmers',
                confidence: 85,
                priority: 1,
                explanation: 'Rising prices on an MSP crop signal an opportunity for government procurement to stabilise markets.',
            });
        }
        if (demandGapPercent >= 20) {
            recommendations.push({
                action: 'Pre-book supply contracts before harvest window',
                expectedImpact: `Locks in up to ${(0, yield_rule_utils_1.formatPercent)(demandGapPercent)} demand gap volume ahead of peak`,
                confidence: 82,
                priority: 1,
                explanation: 'Significant demand gap justifies forward contracting to guarantee supply at predictable prices.',
            });
        }
        if (context.isExportCrop && context.marketTrendDirection !== 'falling') {
            recommendations.push({
                action: 'Strengthen export logistics and cold chain capacity',
                expectedImpact: 'Captures export demand premium and reduces domestic price pressure',
                confidence: 80,
                priority: 2,
                explanation: 'Export demand adds a premium channel that benefits both farmers and supply chain operators.',
            });
        }
        const festivalMonth = [1, 4, 10, 11].includes(context.currentMonth);
        if (festivalMonth && context.availableSupplyKg < context.expectedSupplyKg * 0.85) {
            recommendations.push({
                action: 'Build inventory buffer before festival peak demand',
                expectedImpact: 'Prevents demand spikes from causing price volatility during peak season',
                confidence: 78,
                priority: 2,
                explanation: 'Festival-driven demand peaks in this month require advance stock positioning.',
            });
        }
        if (context.harvestReadinessScore < 55) {
            recommendations.push({
                action: 'Coordinate harvest readiness with aggregation logistics',
                expectedImpact: 'Aligns supply arrival with demand window to reduce mismatch',
                confidence: 75,
                priority: 2,
                explanation: 'Low harvest readiness risks delayed market arrival that extends demand unfulfilment.',
            });
        }
        if (context.weather.hasFloodRisk || context.weather.hasHeatStress) {
            recommendations.push({
                action: 'Activate weather-resilient transport and storage plans',
                expectedImpact: 'Preserves supply movement continuity during adverse weather',
                confidence: 73,
                priority: 2,
                explanation: 'Weather disruptions can delay harvest movement and widen demand-supply gaps unexpectedly.',
            });
        }
        if (!recommendations.length) {
            recommendations.push({
                action: 'Maintain current demand planning and procurement schedule',
                expectedImpact: 'Keeps demand fulfilment on track with stable supply',
                confidence: 65,
                priority: 3,
                explanation: 'No major corrective action required — market conditions are stable.',
            });
        }
        return recommendations.sort((a, b) => a.priority - b.priority || b.confidence - a.confidence);
    }
};
exports.DemandRecommendationEngine = DemandRecommendationEngine;
exports.DemandRecommendationEngine = DemandRecommendationEngine = __decorate([
    (0, common_1.Injectable)()
], DemandRecommendationEngine);
//# sourceMappingURL=demand-recommendation.engine.js.map