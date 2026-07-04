"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyConfidenceCalculatorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
let SupplyConfidenceCalculatorEngine = class SupplyConfidenceCalculatorEngine {
    calculate(context, expectedSupplyKg, availableSupplyKg) {
        const history = context.weatherHistory;
        const temperatures = history.map((entry) => entry.temperature).filter((value) => typeof value === 'number');
        const rainfall = history.map((entry) => entry.rainfall).filter((value) => typeof value === 'number');
        const tempStability = temperatures.length > 1
            ? Math.max(0, 100 - (0, yield_rule_utils_1.average)(temperatures.map((value) => Math.abs(value - (0, yield_rule_utils_1.average)(temperatures)))) * 4)
            : 80;
        const rainStability = rainfall.length > 1
            ? Math.max(0, 100 - (0, yield_rule_utils_1.average)(rainfall.map((value) => Math.abs(value - (0, yield_rule_utils_1.average)(rainfall)))) * 2)
            : 78;
        let confidence = 54;
        confidence += (tempStability - 50) * 0.15;
        confidence += (rainStability - 50) * 0.12;
        confidence += context.harvestReadinessScore >= 70 ? 10 : context.harvestReadinessScore < 40 ? -8 : 0;
        confidence += context.yieldConfidence >= 75 ? 8 : context.yieldConfidence < 50 ? -10 : 0;
        confidence += context.activities.completionRate >= 80 ? 8 : context.activities.completionRate < 55 ? -10 : 0;
        confidence += context.harvestRiskLevel === 'low' ? 5 : context.harvestRiskLevel === 'critical' ? -10 : 0;
        confidence += context.yieldRiskLevel === 'low' ? 5 : context.yieldRiskLevel === 'critical' ? -12 : 0;
        const supplyVariance = expectedSupplyKg > 0
            ? Math.abs(expectedSupplyKg - availableSupplyKg) / expectedSupplyKg
            : 0;
        confidence += supplyVariance < 0.1 ? 8 : supplyVariance < 0.25 ? 2 : -10;
        if (context.regionalEventNotes.length > 0)
            confidence -= 6;
        return (0, yield_rule_utils_1.clamp)(Math.round(confidence), 0, 100);
    }
};
exports.SupplyConfidenceCalculatorEngine = SupplyConfidenceCalculatorEngine;
exports.SupplyConfidenceCalculatorEngine = SupplyConfidenceCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], SupplyConfidenceCalculatorEngine);
//# sourceMappingURL=supply-confidence-calculator.engine.js.map