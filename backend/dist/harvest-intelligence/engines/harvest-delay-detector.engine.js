"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestDelayDetectorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestDelayDetectorEngine = class HarvestDelayDetectorEngine {
    detectDelay(lifecycle, weather, activities) {
        const reasons = [];
        const actions = [];
        let delayDays = 0;
        if (weather.hasFloodRisk) {
            delayDays += 7;
            reasons.push('Flood conditions detected');
            actions.push('Delay harvest until flood recedes');
        }
        if ((weather.forecastRainProbability ?? 0) > 80) {
            delayDays += 3;
            reasons.push('Heavy rainfall probability > 80%');
            actions.push('Monitor forecast — harvest in dry window');
        }
        if (weather.hasHeatStress) {
            delayDays += 2;
            reasons.push('Heat stress may affect grain maturity');
            actions.push('Irrigate and monitor crop stress signs');
        }
        if (activities.hasLateIrrigation) {
            delayDays += 3;
            reasons.push('Late irrigation detected — crop stress extended');
            actions.push('Complete irrigation schedule immediately');
        }
        if (activities.hasLateFertilizer) {
            delayDays += 2;
            reasons.push('Late fertilizer application — delayed maturity');
            actions.push('Complete fertilizer schedule');
        }
        if (lifecycle.lifecycleStage === 'overdue') {
            reasons.push('Crop has passed optimal harvest window');
            actions.push('Harvest immediately to prevent further loss');
        }
        let explanation = '';
        if (delayDays > 0) {
            explanation = `Harvest delayed by ${delayDays} days due to: ${reasons.join(', ')}`;
        }
        return { hasDelay: delayDays > 0, delayDays, delayReasons: reasons, suggestedActions: actions, explanation };
    }
};
exports.HarvestDelayDetectorEngine = HarvestDelayDetectorEngine;
exports.HarvestDelayDetectorEngine = HarvestDelayDetectorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestDelayDetectorEngine);
//# sourceMappingURL=harvest-delay-detector.engine.js.map