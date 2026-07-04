"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestScoreCalculatorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestScoreCalculatorEngine = class HarvestScoreCalculatorEngine {
    calculateScore(readinessScore, riskPoints, completionRate, weather, lifecycle, tempMin, tempMax) {
        let score = readinessScore * 0.4;
        score += Math.max(0, (100 - riskPoints)) * 0.25;
        score += completionRate * 0.20;
        let weatherScore = 70;
        if (weather.hasFloodRisk)
            weatherScore -= 30;
        if (weather.hasHeatStress)
            weatherScore -= 15;
        if (weather.hasColdStress)
            weatherScore -= 10;
        score += Math.max(0, weatherScore) * 0.15;
        const finalScore = Math.min(100, Math.max(0, Math.round(score)));
        const explanation = `Harvest score ${finalScore}/100: readiness(40%) + risk(25%) + activities(20%) + weather(15%)`;
        return { score: finalScore, explanation };
    }
};
exports.HarvestScoreCalculatorEngine = HarvestScoreCalculatorEngine;
exports.HarvestScoreCalculatorEngine = HarvestScoreCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestScoreCalculatorEngine);
//# sourceMappingURL=harvest-score-calculator.engine.js.map