export interface FarmDashboardSummaryStats {
  totalFarms: number;
  totalLandArea: number; // in hectares
  totalActiveParcels: number;
  activeCrops: number;
  harvestsThisMonth: number | null;
  healthyFarmsPercentage: number | null;
}
