import { IEventBus } from './event.interface';
import { IDomainEvent, DomainEventType, EventHandler, EventBusStatus } from './event.types';
export declare class EventBusService implements IEventBus {
    private readonly logger;
    private readonly handlers;
    private totalPublished;
    private totalHandled;
    private totalFailed;
    publish<T>(event: IDomainEvent<T>): Promise<void>;
    subscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): void;
    unsubscribe(eventType: DomainEventType, handler: EventHandler): void;
    status(): EventBusStatus;
    createEvent<T>(type: DomainEventType, source: string, payload: T, correlationId?: string): IDomainEvent<T>;
}
