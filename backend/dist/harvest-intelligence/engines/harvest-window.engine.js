"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestWindowCalculatorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestWindowCalculatorEngine = class HarvestWindowCalculatorEngine {
    calculateWindow(lifecycle, weather) {
        const harvestDate = lifecycle.expectedHarvestDate ?? new Date();
        const earliest = new Date(harvestDate);
        earliest.setDate(earliest.getDate() - 5);
        const latest = new Date(harvestDate);
        latest.setDate(latest.getDate() + 10);
        let windowDays = 15;
        const explanation = ['Harvest window: earliest 5 days before expected date'];
        if (weather.hasFloodRisk || (weather.forecastRainProbability ?? 0) > 70) {
            earliest.setDate(harvestDate.getDate() - 2);
            latest.setDate(harvestDate.getDate() + 3);
            windowDays = 5;
            explanation.push('Window tightened due to flood/rain risk — harvest promptly');
        }
        return {
            earliestHarvestDate: earliest,
            optimalHarvestDate: harvestDate,
            latestSafeHarvestDate: latest,
            windowDays,
            explanation: explanation.join('; '),
        };
    }
};
exports.HarvestWindowCalculatorEngine = HarvestWindowCalculatorEngine;
exports.HarvestWindowCalculatorEngine = HarvestWindowCalculatorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestWindowCalculatorEngine);
//# sourceMappingURL=harvest-window.engine.js.map