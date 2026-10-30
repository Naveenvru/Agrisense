export type CropStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruit Development' | 'Harvest Ready' | 'Completed';
export type HealthStatus = 'Healthy' | 'Medium Risk' | 'Needs Attention' | 'Critical' | 'Unknown';

export interface CropSummary {
  id: string;
  name?: string;
  variety?: string;
  plantingDate?: string | null;
  expectedHarvestDate?: string | null;
  currentStage?: CropStage;
  estimatedYield?: number | null;
  yieldUnit?: string;
  healthStatus: HealthStatus;
  area?: number | null;
  parcelId?: string;
}
