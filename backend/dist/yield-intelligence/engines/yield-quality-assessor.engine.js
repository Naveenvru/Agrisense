"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldQualityAssessorEngine = void 0;
const common_1 = require("@nestjs/common");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let YieldQualityAssessorEngine = class YieldQualityAssessorEngine {
    assess(context, yieldPerAcreKg, confidence) {
        const factors = [];
        let score = 65;
        if (confidence >= 85) {
            score += 12;
            factors.push('High prediction confidence supports better quality outlook');
        }
        else if (confidence < 55) {
            score -= 10;
            factors.push('Low prediction confidence lowers quality certainty');
        }
        if (!context.weather.hasHeatStress && !context.weather.hasFloodRisk) {
            score += 8;
            factors.push('Weather is currently stable');
        }
        else {
            score -= 10;
            factors.push('Weather stress is affecting crop quality');
        }
        if (context.soilFertilityScore >= 75) {
            score += 10;
            factors.push('Soil fertility is strong');
        }
        else if (context.soilFertilityScore < 45) {
            score -= 12;
            factors.push('Soil fertility is weak');
        }
        const variety = String(context.cropVariety ?? '').toLowerCase();
        if ((0, yield_rule_utils_1.containsAny)(variety, ['hybrid', 'premium', 'certified'])) {
            score += 6;
            factors.push('Improved crop variety detected');
        }
        else if ((0, yield_rule_utils_1.containsAny)(variety, ['local', 'traditional'])) {
            score -= 4;
            factors.push('Local variety may have lower uniformity');
        }
        if (context.readinessScore >= 80) {
            score += 8;
            factors.push('Crop harvest readiness is high');
        }
        else if (context.readinessScore < 35) {
            score -= 8;
            factors.push('Crop is still far from maturity');
        }
        if ((context.irrigationType ?? '').toLowerCase().includes('drip')) {
            score += 5;
            factors.push('Drip irrigation supports quality stability');
        }
        const grade = score >= 82 ? 'A' : score >= 62 ? 'B' : 'C';
        const explanation = `Yield quality is graded ${grade} because ${factors.join('; ').toLowerCase()}.`;
        return {
            grade,
            score: (0, yield_rule_utils_1.clamp)(Math.round(score), 0, 100),
            factors,
            explanation,
        };
    }
};
exports.YieldQualityAssessorEngine = YieldQualityAssessorEngine;
exports.YieldQualityAssessorEngine = YieldQualityAssessorEngine = __decorate([
    (0, common_1.Injectable)()
], YieldQualityAssessorEngine);
//# sourceMappingURL=yield-quality-assessor.engine.js.map