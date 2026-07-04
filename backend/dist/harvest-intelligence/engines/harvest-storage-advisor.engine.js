"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestStorageAdvisorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestStorageAdvisorEngine = class HarvestStorageAdvisorEngine {
    recommendStorage(qualityGrade, lifecycle, weather) {
        if (lifecycle.lifecycleStage === 'overdue' || qualityGrade === 'C') {
            return {
                recommendation: 'immediate-sale',
                explanation: 'Grade C quality or over-mature crop — sell immediately to minimise losses',
            };
        }
        if (weather.hasFloodRisk || (weather.forecastRainProbability ?? 0) > 70) {
            return {
                recommendation: 'temporary-storage',
                explanation: 'Flood/rain risk detected — move to covered temporary storage until weather clears',
            };
        }
        if (qualityGrade === 'A') {
            return {
                recommendation: 'cold-storage',
                explanation: 'Grade A quality crop — cold storage preserves premium quality for better market timing',
            };
        }
        return {
            recommendation: 'warehouse',
            explanation: 'Grade B quality — warehouse storage suitable; sell within 30 days',
        };
    }
};
exports.HarvestStorageAdvisorEngine = HarvestStorageAdvisorEngine;
exports.HarvestStorageAdvisorEngine = HarvestStorageAdvisorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestStorageAdvisorEngine);
//# sourceMappingURL=harvest-storage-advisor.engine.js.map