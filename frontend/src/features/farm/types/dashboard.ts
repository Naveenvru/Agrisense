export interface FarmDashboardSummaryStats {
  totalFarms: number;
  totalLandArea: number; // in hectares
  areaUnit?: 'ha' | 'ac';
  totalActiveParcels: number;
  activeCrops: number;
  harvestsThisMonth: number | null;
  healthyFarmsPercentage: number | null;
}
