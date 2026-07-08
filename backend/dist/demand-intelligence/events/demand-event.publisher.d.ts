import { EventBusService } from '../../common/events/event-bus.service';
import type { DemandPredictionResult } from '../interfaces/demand-intelligence.types';
export declare class DemandEventPublisher {
    private readonly eventBus;
    private readonly logger;
    private static readonly SOURCE;
    constructor(eventBus: EventBusService);
    publishPredicted(result: DemandPredictionResult): void;
    publishUpdated(result: DemandPredictionResult, previousDemandKg: number): void;
    publishWarning(result: DemandPredictionResult): void;
    publishCompleted(result: DemandPredictionResult, actualDemandKg: number): void;
}
