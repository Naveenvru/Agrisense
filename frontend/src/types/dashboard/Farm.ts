export interface FarmData {
  id: string;
  name: string;
  crop: string;
  area: number;
  growthStage: string;
  healthScore: number; // 0-100
  status: 'Healthy' | 'Attention Required' | 'Critical';
  harvestCountdownDays: number;
}
