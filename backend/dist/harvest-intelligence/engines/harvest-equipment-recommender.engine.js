"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestEquipmentRecommenderEngine = void 0;
const common_1 = require("@nestjs/common");
let HarvestEquipmentRecommenderEngine = class HarvestEquipmentRecommenderEngine {
    recommendEquipment(cropName, areaAcres, qualityGrade) {
        const acres = areaAcres ?? 1;
        const recommended = [];
        let explanation = '';
        const cropLower = cropName.toLowerCase();
        const isGrain = ['rice', 'wheat', 'maize', 'corn', 'jowar', 'bajra'].some(c => cropLower.includes(c));
        if (acres >= 5 && isGrain) {
            recommended.push('Combine Harvester', 'Grain Bags (50 kg)', 'Tarpaulin Sheets');
            explanation = `Large grain crop (${acres} acres) — combine harvester recommended for efficiency`;
        }
        else if (acres >= 2) {
            recommended.push('Mini Harvester', 'Storage Bags', 'Tarpaulin Sheets');
            explanation = `Medium area (${acres} acres) — mini harvester and storage bags recommended`;
        }
        else {
            recommended.push('Manual Harvesting Tools', 'Storage Bags', 'Drying Sheets', 'Crates');
            explanation = `Small area (${acres} acres) — manual harvest with crates and drying sheets`;
        }
        if (qualityGrade === 'A') {
            recommended.push('Moisture Meter');
            explanation += '; add moisture meter to preserve Grade A quality';
        }
        return { recommended, explanation };
    }
};
exports.HarvestEquipmentRecommenderEngine = HarvestEquipmentRecommenderEngine;
exports.HarvestEquipmentRecommenderEngine = HarvestEquipmentRecommenderEngine = __decorate([
    (0, common_1.Injectable)()
], HarvestEquipmentRecommenderEngine);
//# sourceMappingURL=harvest-equipment-recommender.engine.js.map