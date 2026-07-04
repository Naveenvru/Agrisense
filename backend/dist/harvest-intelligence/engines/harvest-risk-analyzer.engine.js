"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestRiskAnalyzerEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestRiskAnalyzerEngine = class HarvestRiskAnalyzerEngine {
    analyzeRisk(weather, activities) {
        const riskFactors = [];
        const mitigations = [];
        let riskPoints = 0;
        if (weather.hasFloodRisk) {
            riskPoints += 30;
            riskFactors.push('Flood risk detected from forecast data');
            mitigations.push('Monitor water levels and prepare drainage channels');
        }
        if (weather.hasHeatStress) {
            riskPoints += 20;
            riskFactors.push('High temperature stress — above crop optimal range');
            mitigations.push('Increase irrigation frequency to cool soil');
        }
        if (weather.hasColdStress) {
            riskPoints += 15;
            riskFactors.push('Cold stress detected — below crop minimum temperature');
            mitigations.push('Apply mulching to retain soil warmth');
        }
        if (weather.forecastRainProbability && weather.forecastRainProbability > 70) {
            riskPoints += 15;
            riskFactors.push(`High rain probability (${weather.forecastRainProbability}%) in forecast`);
            mitigations.push('Plan harvest before rain window; prepare covered storage');
        }
        if (activities.hasMissedActivities) {
            riskPoints += 10;
            riskFactors.push(`${activities.overduePendingEvents} farm activities are overdue`);
            mitigations.push('Complete pending irrigation and fertilizer applications immediately');
        }
        if (activities.completionRate < 60) {
            riskPoints += 10;
            riskFactors.push(`Low farm activity completion rate: ${activities.completionRate.toFixed(0)}%`);
            mitigations.push('Increase farm activity adherence to improve crop health');
        }
        const riskLevel = this.resolveRiskLevel(riskPoints);
        if (riskFactors.length === 0) {
            riskFactors.push('No significant risk factors detected');
        }
        if (mitigations.length === 0) {
            mitigations.push('Continue current farm management practices');
        }
        const explanation = `Risk level: ${riskLevel} (${riskPoints} risk points accumulated)`;
        return { riskLevel, riskPoints, riskFactors, mitigations, explanation };
    }
    resolveRiskLevel(riskPoints) {
        if (riskPoints >= 60)
            return 'critical';
        if (riskPoints >= 35)
            return 'high';
        if (riskPoints >= 15)
            return 'medium';
        return 'low';
    }
};
exports.HarvestRiskAnalyzerEngine = HarvestRiskAnalyzerEngine;
exports.HarvestRiskAnalyzerEngine = HarvestRiskAnalyzerEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestRiskAnalyzerEngine);
//# sourceMappingURL=harvest-risk-analyzer.engine.js.map