import { IDomainEvent, DomainEventType, EventHandler } from './event.types';
export interface IEventBus {
    publish<T>(event: IDomainEvent<T>): Promise<void>;
    subscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): void;
    unsubscribe(eventType: DomainEventType, handler: EventHandler): void;
}
