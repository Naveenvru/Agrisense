import type { IHarvestLabourEstimator } from '../interfaces/harvest-labour.interface';
import type { LabourEstimate } from '../interfaces/harvest-intelligence.types';
export declare class HarvestLabourEstimatorEngine implements IHarvestLabourEstimator {
    estimateLabour(areaAcres: number | null, cropName: string, optimalHarvestDate: Date): LabourEstimate;
}
