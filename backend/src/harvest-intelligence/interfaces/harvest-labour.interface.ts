import type { LabourEstimate } from './harvest-intelligence.types';

export interface IHarvestLabourEstimator {
  estimateLabour(
    areaAcres: number | null,
    cropName: string,
    optimalHarvestDate: Date,
  ): LabourEstimate;
}
export const HARVEST_LABOUR_ESTIMATOR = 'IHarvestLabourEstimator';
