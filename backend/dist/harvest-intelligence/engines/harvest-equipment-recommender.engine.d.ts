import type { IHarvestEquipmentRecommender } from '../interfaces/harvest-equipment.interface';
import type { EquipmentRecommendation } from '../interfaces/harvest-intelligence.types';
export declare class HarvestEquipmentRecommenderEngine implements IHarvestEquipmentRecommender {
    recommendEquipment(cropName: string, areaAcres: number | null, qualityGrade: string): EquipmentRecommendation;
}
