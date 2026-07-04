"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestAssessmentEngine = void 0;
const common_1 = require("@nestjs/common");
const harvest_risk_analyzer_engine_1 = require("./harvest-risk-analyzer.engine");
const harvest_score_calculator_engine_1 = require("./harvest-score-calculator.engine");
const harvest_confidence_calculator_engine_1 = require("./harvest-confidence-calculator.engine");
const harvest_delay_detector_engine_1 = require("./harvest-delay-detector.engine");
const harvest_window_engine_1 = require("./harvest-window.engine");
let HarvestAssessmentEngine = class HarvestAssessmentEngine {
    riskAnalyzer;
    scoreCalculator;
    confidenceCalculator;
    delayDetector;
    windowCalculator;
    constructor(riskAnalyzer, scoreCalculator, confidenceCalculator, delayDetector, windowCalculator) {
        this.riskAnalyzer = riskAnalyzer;
        this.scoreCalculator = scoreCalculator;
        this.confidenceCalculator = confidenceCalculator;
        this.delayDetector = delayDetector;
        this.windowCalculator = windowCalculator;
    }
    evaluate(lifecycle, weather, activities, cropTemperatureMin, cropTemperatureMax) {
        const explanations = [];
        const readinessScore = this.computeReadinessScore(lifecycle, explanations);
        const readinessStatus = this.resolveReadinessStatus(lifecycle, readinessScore);
        const risk = this.riskAnalyzer.analyzeRisk(weather, activities);
        explanations.push(risk.explanation);
        const harvestWindow = this.windowCalculator.calculateWindow(lifecycle, weather);
        explanations.push(harvestWindow.explanation);
        const harvestDelay = this.delayDetector.detectDelay(lifecycle, weather, activities);
        if (harvestDelay.explanation)
            explanations.push(harvestDelay.explanation);
        const scoreResult = this.scoreCalculator.calculateScore(readinessScore, risk.riskPoints, activities.completionRate, weather, lifecycle, cropTemperatureMin, cropTemperatureMax);
        explanations.push(scoreResult.explanation);
        const confResult = this.confidenceCalculator.calculateConfidence(lifecycle, weather, activities);
        explanations.push(confResult.explanation);
        return {
            readinessScore,
            readinessStatus,
            harvestScore: scoreResult.score,
            confidenceScore: confResult.confidence,
            riskLevel: risk.riskLevel,
            riskFactors: risk.riskFactors,
            mitigationRecommendations: risk.mitigations,
            harvestWindow,
            harvestDelay,
            explanations,
        };
    }
    computeReadinessScore(lifecycle, explanations) {
        const { growthPercentage, lifecycleStage, daysRemaining } = lifecycle;
        let score = 0;
        switch (lifecycleStage) {
            case 'pre-sowing':
                score = 0;
                break;
            case 'seedling':
                score = Math.round(growthPercentage * 0.3);
                break;
            case 'vegetative':
                score = Math.round(growthPercentage * 0.6);
                break;
            case 'reproductive':
                score = Math.round(growthPercentage * 0.8);
                break;
            case 'ripening':
                score = Math.round(growthPercentage * 0.95);
                break;
            case 'ready':
                score = 95 + Math.min(5, daysRemaining === 0 ? 5 : 0);
                break;
            case 'overdue':
                score = Math.max(60, 100 - (growthPercentage - 100));
                break;
            case 'harvested':
                score = 100;
                break;
            default: score = 0;
        }
        score = Math.min(100, Math.max(0, score));
        explanations.push(`Crop is at ${growthPercentage}% growth (stage: ${lifecycleStage}) — readiness: ${score}%`);
        if (daysRemaining > 0) {
            explanations.push(`${daysRemaining} days remaining until expected harvest`);
        }
        else if (lifecycleStage !== 'harvested') {
            explanations.push('Crop has passed expected harvest date — harvest urgently');
        }
        return score;
    }
    resolveReadinessStatus(lifecycle, score) {
        if (lifecycle.lifecycleStage === 'harvested')
            return 'harvested';
        if (score >= 90)
            return 'ready';
        if (score >= 70)
            return 'almost-ready';
        if (score >= 30)
            return 'developing';
        return 'not-ready';
    }
};
exports.HarvestAssessmentEngine = HarvestAssessmentEngine;
exports.HarvestAssessmentEngine = HarvestAssessmentEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [harvest_risk_analyzer_engine_1.HarvestRiskAnalyzerEngine,
        harvest_score_calculator_engine_1.HarvestScoreCalculatorEngine,
        harvest_confidence_calculator_engine_1.HarvestConfidenceCalculatorEngine,
        harvest_delay_detector_engine_1.HarvestDelayDetectorEngine,
        harvest_window_engine_1.HarvestWindowCalculatorEngine])
], HarvestAssessmentEngine);
//# sourceMappingURL=harvest-assessment.engine.js.map