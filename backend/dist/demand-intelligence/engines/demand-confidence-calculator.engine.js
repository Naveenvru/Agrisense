"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandConfidenceCalculatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let DemandConfidenceCalculatorEngine = class DemandConfidenceCalculatorEngine {
    calculate(context, expectedDemandKg, currentDemandKg) {
        let confidence = 52;
        const hasPriceData = context.marketModalPrice > 0;
        const hasArrivalData = context.recentArrivalQty > 0;
        confidence += hasPriceData ? 10 : -12;
        confidence += hasArrivalData ? 6 : -8;
        if (context.marketTrendDirection === 'stable')
            confidence += 6;
        if (context.marketTrendDirection === 'rising')
            confidence += 2;
        if (context.marketTrendDirection === 'falling')
            confidence -= 4;
        confidence += context.yieldConfidence >= 75 ? 8 : context.yieldConfidence < 50 ? -10 : 0;
        confidence += context.harvestReadinessScore >= 70 ? 8 : context.harvestReadinessScore < 40 ? -8 : 0;
        const supplyRatio = expectedDemandKg > 0 && context.availableSupplyKg > 0
            ? context.availableSupplyKg / expectedDemandKg
            : 0;
        confidence += supplyRatio >= 0.9 ? 6 : supplyRatio < 0.5 ? -8 : 0;
        if (context.historicalDemandKg.length >= 3) {
            const avgHistorical = (0, yield_rule_utils_1.average)(context.historicalDemandKg);
            const variance = avgHistorical > 0
                ? Math.abs(expectedDemandKg - avgHistorical) / avgHistorical
                : 0;
            confidence += variance < 0.15 ? 8 : variance < 0.30 ? 2 : -6;
        }
        if (context.isMspCrop)
            confidence += 5;
        if (context.isExportCrop)
            confidence += 4;
        if (context.weather.hasFloodRisk || context.weather.hasHeatStress)
            confidence -= 6;
        if (context.regionalEventNotes.length > 0)
            confidence -= 5;
        if (context.yieldRiskLevel === 'critical')
            confidence -= 10;
        return (0, yield_rule_utils_1.clamp)(Math.round(confidence), 0, 100);
    }
};
exports.DemandConfidenceCalculatorEngine = DemandConfidenceCalculatorEngine;
exports.DemandConfidenceCalculatorEngine = DemandConfidenceCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], DemandConfidenceCalculatorEngine);
//# sourceMappingURL=demand-confidence-calculator.engine.js.map