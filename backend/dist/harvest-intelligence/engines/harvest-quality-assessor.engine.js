"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestQualityAssessorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestQualityAssessorEngine = class HarvestQualityAssessorEngine {
    assessQuality(weather, activities, cropVariety, lifecycle) {
        const factors = [];
        let qualityScore = 80;
        if (weather.hasHeatStress) {
            qualityScore -= 20;
            factors.push('Heat stress reduces grain quality');
        }
        if (weather.hasColdStress) {
            qualityScore -= 15;
            factors.push('Cold stress affects crop development');
        }
        if ((weather.forecastRainProbability ?? 0) > 70) {
            qualityScore -= 10;
            factors.push('High rainfall risk may cause fungal issues');
        }
        if (activities.hasMissedActivities) {
            qualityScore -= 10;
            factors.push('Missed farm activities reduce quality');
        }
        if (activities.completionRate > 80) {
            qualityScore += 10;
            factors.push('Excellent farm activity completion');
        }
        if (lifecycle.lifecycleStage === 'overdue') {
            qualityScore -= 15;
            factors.push('Over-maturity detected — quality degrading');
        }
        if (cropVariety)
            factors.push(`Crop variety: ${cropVariety}`);
        const grade = qualityScore >= 75 ? 'A' : qualityScore >= 55 ? 'B' : 'C';
        const explanation = `Quality grade ${grade}: ${factors.join('; ')}`;
        return { grade: grade, explanation, factors };
    }
};
exports.HarvestQualityAssessorEngine = HarvestQualityAssessorEngine;
exports.HarvestQualityAssessorEngine = HarvestQualityAssessorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestQualityAssessorEngine);
//# sourceMappingURL=harvest-quality-assessor.engine.js.map