import type { EquipmentRecommendation } from './harvest-intelligence.types';

export interface IHarvestEquipmentRecommender {
  recommendEquipment(
    cropName: string,
    areaAcres: number | null,
    qualityGrade: string,
  ): EquipmentRecommendation;
}
export const HARVEST_EQUIPMENT_RECOMMENDER = 'IHarvestEquipmentRecommender';
