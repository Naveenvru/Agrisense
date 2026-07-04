import { EventBusService } from '../../common/events/event-bus.service';
export declare class DemandEventPublisher {
    private readonly eventBus;
    constructor(eventBus: EventBusService);
    publishPredicted(payload: Record<string, any>): Promise<void>;
    publishUpdated(payload: Record<string, any>): Promise<void>;
    publishWarning(payload: Record<string, any>): Promise<void>;
    publishCompleted(payload: Record<string, any>): Promise<void>;
}
