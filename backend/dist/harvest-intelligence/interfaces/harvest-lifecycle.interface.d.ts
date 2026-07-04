import type { LifecycleContext } from './harvest-intelligence.types';
export interface IHarvestLifecycleEngine {
    compute(sowingDate: Date, durationDays: number, expectedHarvestDate: Date | null): LifecycleContext;
}
export declare const HARVEST_LIFECYCLE_ENGINE = "IHarvestLifecycleEngine";
