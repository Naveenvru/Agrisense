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
    calculate(context, expectedDemandKg) {
        let confidence = 55;
        confidence += context.recentTransactionCount >= 10 ? 12 : context.recentTransactionCount < 4 ? -10 : 0;
        confidence += context.recentBuyerCount >= 5 ? 8 : context.recentBuyerCount < 2 ? -8 : 0;
        confidence += context.marketMomentumIndex >= 0.75 ? 10 : context.marketMomentumIndex < 0.4 ? -10 : 0;
        confidence += context.buyerActivityIndex >= 0.75 ? 8 : context.buyerActivityIndex < 0.4 ? -8 : 0;
        confidence += context.supplyPressureIndex <= 0.4 ? 6 : context.supplyPressureIndex >= 0.7 ? -8 : 0;
        confidence += context.seasonalDemandIndex >= 0.9 ? 8 : context.seasonalDemandIndex < 0.7 ? -8 : 0;
        confidence += context.priceTrend === 'rising' ? 6 : context.priceTrend === 'falling' ? -6 : 0;
        const transactionStability = (0, yield_rule_utils_1.clamp)(100 - Math.abs(context.recentTransactionCount - context.recentBuyerCount) * 4, 0, 100);
        confidence += (transactionStability - 50) * 0.08;
        return (0, yield_rule_utils_1.clamp)(Math.round(confidence), 0, 100);
    }
};
exports.DemandConfidenceCalculatorEngine = DemandConfidenceCalculatorEngine;
exports.DemandConfidenceCalculatorEngine = DemandConfidenceCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], DemandConfidenceCalculatorEngine);
//# sourceMappingURL=demand-confidence-calculator.engine.js.map