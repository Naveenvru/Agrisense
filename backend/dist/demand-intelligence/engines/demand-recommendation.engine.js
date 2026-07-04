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
let DemandRecommendationEngine = class DemandRecommendationEngine {
    recommend(context, risk) {
        const recommendations = [];
        if (risk.level === 'high' || risk.level === 'critical') {
            recommendations.push({
                action: 'Increase buyer outreach',
                expectedImpact: 'Improves transaction volume and market reach',
                confidence: 84,
                priority: 1,
                explanation: 'Demand risk is elevated, so stronger buyer engagement is warranted.',
            });
        }
        if (context.priceTrend === 'falling') {
            recommendations.push({
                action: 'Offer targeted promotions or bundles',
                expectedImpact: 'Stimulates buyer interest during weak price momentum',
                confidence: 78,
                priority: 2,
                explanation: 'Falling prices often need an active demand push.',
            });
        }
        if (context.supplyPressureIndex > 0.65) {
            recommendations.push({
                action: 'Coordinate staged market releases',
                expectedImpact: 'Prevents oversupply from weakening demand signals',
                confidence: 80,
                priority: 1,
                explanation: 'High supply pressure should be managed to keep demand healthy.',
            });
        }
        if (context.recentBuyerCount < 3) {
            recommendations.push({
                action: 'Expand to new wholesale buyers',
                expectedImpact: 'Broadens the buyer base and stabilises demand',
                confidence: 76,
                priority: 2,
                explanation: 'Low buyer participation needs broader market access.',
            });
        }
        if (!recommendations.length) {
            recommendations.push({
                action: 'Maintain current market engagement plan',
                expectedImpact: 'Preserves current demand trajectory',
                confidence: 65,
                priority: 3,
                explanation: 'No urgent intervention is needed right now.',
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