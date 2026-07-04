import type { IHarvestLifecycleEngine } from '../interfaces/harvest-lifecycle.interface';
import type { LifecycleContext } from '../interfaces/harvest-intelligence.types';
export declare class CropLifecycleEngine implements IHarvestLifecycleEngine {
    compute(sowingDate: Date, durationDays: number, expectedHarvestDate: Date | null): LifecycleContext;
    private resolveStage;
}
