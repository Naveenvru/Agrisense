"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestConfidenceCalculatorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestConfidenceCalculatorEngine = class HarvestConfidenceCalculatorEngine {
    calculateConfidence(lifecycle, weather, activities) {
        let confidence = 80;
        if (lifecycle.growthPercentage > 80)
            confidence += 10;
        else if (lifecycle.growthPercentage < 20)
            confidence -= 20;
        if (!weather.hasFloodRisk && !weather.hasHeatStress && !weather.hasColdStress)
            confidence += 5;
        else
            confidence -= 15;
        if (activities.completionRate > 80)
            confidence += 5;
        else if (activities.completionRate < 40)
            confidence -= 10;
        const finalConf = Math.min(95, Math.max(20, Math.round(confidence)));
        const explanation = `Assessment confidence: ${finalConf}% (based on growth data, weather stability, and farm activity records)`;
        return { confidence: finalConf, explanation };
    }
};
exports.HarvestConfidenceCalculatorEngine = HarvestConfidenceCalculatorEngine;
exports.HarvestConfidenceCalculatorEngine = HarvestConfidenceCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestConfidenceCalculatorEngine);
//# sourceMappingURL=harvest-confidence-calculator.engine.js.map