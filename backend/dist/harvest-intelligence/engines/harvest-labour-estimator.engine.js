"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestLabourEstimatorEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestLabourEstimatorEngine = class HarvestLabourEstimatorEngine {
    estimateLabour(areaAcres, cropName, optimalHarvestDate) {
        const acres = areaAcres ?? 1;
        const workersRequired = Math.max(1, Math.ceil(acres * 3));
        const harvestDurationDays = Math.max(1, Math.ceil(acres / 3));
        const estimatedLabourHours = workersRequired * harvestDurationDays * 8;
        const suggestedStartDate = new Date(optimalHarvestDate);
        suggestedStartDate.setDate(suggestedStartDate.getDate() - 1);
        const explanation = `For ${acres} acres of ${cropName}: ${workersRequired} workers over ${harvestDurationDays} day(s), ~${estimatedLabourHours} total labour hours`;
        return { workersRequired, harvestDurationDays, suggestedStartDate, estimatedLabourHours, explanation };
    }
};
exports.HarvestLabourEstimatorEngine = HarvestLabourEstimatorEngine;
exports.HarvestLabourEstimatorEngine = HarvestLabourEstimatorEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestLabourEstimatorEngine);
//# sourceMappingURL=harvest-labour-estimator.engine.js.map