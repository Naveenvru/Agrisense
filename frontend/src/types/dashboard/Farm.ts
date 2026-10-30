export interface FarmData {
  id: string;
  name: string;
  crop: string;
  area: number;
  growthStage?: string;
  healthScore?: number | null; // only populated when a recorded assessment exists
  status: 'Healthy' | 'Attention Required' | 'Critical' | 'Registered';
  harvestCountdownDays?: number | null;
  location?: string;
}
