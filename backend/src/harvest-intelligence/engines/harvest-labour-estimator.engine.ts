import { Injectable } from '@nestjs/common';
import type { IHarvestLabourEstimator } from '../interfaces/harvest-labour.interface';
import type { LabourEstimate } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestLabourEstimatorEngine implements IHarvestLabourEstimator {
  estimateLabour(
    areaAcres: number | null,
    cropName: string,
    optimalHarvestDate: Date,
  ): LabourEstimate {
    const acres = areaAcres ?? 1;
    const workersRequired = Math.max(1, Math.ceil(acres * 3));
    const harvestDurationDays = Math.max(1, Math.ceil(acres / 3));
    const estimatedLabourHours = workersRequired * harvestDurationDays * 8;

    const suggestedStartDate = new Date(optimalHarvestDate);
    suggestedStartDate.setDate(suggestedStartDate.getDate() - 1);

    const explanation = `For ${acres} acres of ${cropName}: ${workersRequired} workers over ${harvestDurationDays} day(s), ~${estimatedLabourHours} total labour hours`;
    return { workersRequired, harvestDurationDays, suggestedStartDate, estimatedLabourHours, explanation };
  }
}
