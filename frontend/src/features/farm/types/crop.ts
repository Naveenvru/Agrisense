export type CropStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruit Development' | 'Harvest Ready' | 'Completed';
export type HealthStatus = 'Healthy' | 'Medium Risk' | 'Needs Attention' | 'Critical';

export interface CropSummary {
  id: string;
  name: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  currentStage: CropStage;
  estimatedYield: number;
  yieldUnit: string;
  healthStatus: HealthStatus;
  area: number;
}
