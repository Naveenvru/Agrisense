export type DomainEventType = 'weather.collected' | 'weather.forecast.collected' | 'weather.alert.triggered' | 'market.prices.collected' | 'market.price.spike.detected' | 'government.advisory.collected' | 'farmer.profile.created' | 'farmer.crop.sown' | 'farmer.crop.harvested' | 'harvest.predicted' | 'harvest.updated' | 'harvest.delayed' | 'harvest.completed' | 'harvest.readiness.alert' | 'system.data.cleanup.completed' | 'system.archive.completed';
export interface IDomainEvent<T = unknown> {
    type: DomainEventType;
    id: string;
    source: string;
    occurredAt: Date;
    payload: T;
    correlationId?: string;
    version: number;
}
export type EventHandler<T = unknown> = (event: IDomainEvent<T>) => Promise<void> | void;
export interface EventBusStatus {
    totalPublished: number;
    totalHandled: number;
    totalFailed: number;
    subscriberCount: number;
    registeredEventTypes: string[];
}
