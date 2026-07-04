import { Injectable } from '@nestjs/common';
import type { IHarvestEquipmentRecommender } from '../interfaces/harvest-equipment.interface';
import type { EquipmentRecommendation } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestEquipmentRecommenderEngine implements IHarvestEquipmentRecommender {
  recommendEquipment(
    cropName: string,
    areaAcres: number | null,
    qualityGrade: string,
  ): EquipmentRecommendation {
    const acres = areaAcres ?? 1;
    const recommended: string[] = [];
    let explanation = '';

    const cropLower = cropName.toLowerCase();
    const isGrain = ['rice', 'wheat', 'maize', 'corn', 'jowar', 'bajra'].some(c => cropLower.includes(c));

    if (acres >= 5 && isGrain) {
      recommended.push('Combine Harvester', 'Grain Bags (50 kg)', 'Tarpaulin Sheets');
      explanation = `Large grain crop (${acres} acres) — combine harvester recommended for efficiency`;
    } else if (acres >= 2) {
      recommended.push('Mini Harvester', 'Storage Bags', 'Tarpaulin Sheets');
      explanation = `Medium area (${acres} acres) — mini harvester and storage bags recommended`;
    } else {
      recommended.push('Manual Harvesting Tools', 'Storage Bags', 'Drying Sheets', 'Crates');
      explanation = `Small area (${acres} acres) — manual harvest with crates and drying sheets`;
    }

    if (qualityGrade === 'A') {
      recommended.push('Moisture Meter');
      explanation += '; add moisture meter to preserve Grade A quality';
    }

    return { recommended, explanation };
  }
}
