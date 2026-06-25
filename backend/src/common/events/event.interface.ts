import { IDomainEvent, DomainEventType, EventHandler } from './event.types';

/**
 * IEventBus
 *
 * Contract for the domain event bus.
 * Business modules publish events; analytics, AI, and notification
 * modules subscribe without knowing who published.
 *
 * Future architecture
 * ────────────────────
 *
 * WeatherCollector
 *       │ publishes 'weather.collected'
 *       ▼
 *   IEventBus
 *       │ delivers to all subscribers
 *       ├─► AnalyticsService
 *       ├─► NotificationService
 *       ├─► MetadataCatalogService
 *       └─► KnowledgeGeneratorService
 */
export interface IEventBus {
  /**
   * Publish a domain event to all registered subscribers.
   */
  publish<T>(event: IDomainEvent<T>): Promise<void>;

  /**
   * Subscribe a handler to a specific event type.
   *
   * @param eventType  The event to listen for
   * @param handler    Async function called on each published event
   */
  subscribe<T>(
    eventType: DomainEventType,
    handler: EventHandler<T>,
  ): void;

  /**
   * Remove a previously registered handler.
   */
  unsubscribe(eventType: DomainEventType, handler: EventHandler): void;
}
