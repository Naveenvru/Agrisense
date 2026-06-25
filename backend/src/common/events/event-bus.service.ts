import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IEventBus } from './event.interface';
import { IDomainEvent, DomainEventType, EventHandler, EventBusStatus } from './event.types';

/**
 * EventBusService
 *
 * In-process, synchronous domain event bus for the AgriSense backend.
 *
 * Phase 8.7: Infrastructure only — no publishers, no subscribers yet.
 *
 * Phase 8.8+ (usage example):
 *
 *   // Publisher (WeatherCollector):
 *   await eventBus.publish({
 *     type: 'weather.collected',
 *     id: uuidv4(),
 *     source: 'WeatherCollector',
 *     occurredAt: new Date(),
 *     payload: { locationId, temperature, humidity },
 *     version: 1,
 *   });
 *
 *   // Subscriber (AnalyticsService):
 *   eventBus.subscribe('weather.collected', async (event) => {
 *     await analyticsService.processWeatherEvent(event.payload);
 *   });
 *
 * Future: Replace with Redis pub/sub or BullMQ for distributed processing.
 */
@Injectable()
export class EventBusService implements IEventBus {
  private readonly logger = new Logger(EventBusService.name);

  private readonly handlers = new Map<DomainEventType, Set<EventHandler>>();

  // Telemetry counters
  private totalPublished = 0;
  private totalHandled = 0;
  private totalFailed = 0;

  // ---------------------------------------------------------------------------
  // IEventBus implementation
  // ---------------------------------------------------------------------------

  async publish<T>(event: IDomainEvent<T>): Promise<void> {
    this.totalPublished++;
    const subscribers = this.handlers.get(event.type);

    if (!subscribers || subscribers.size === 0) {
      this.logger.debug(`Event published with no subscribers | type=${event.type} id=${event.id}`);
      return;
    }

    this.logger.debug(
      `Publishing event | type=${event.type} id=${event.id} subscribers=${subscribers.size}`,
    );

    for (const handler of subscribers) {
      try {
        await handler(event as IDomainEvent<unknown>);
        this.totalHandled++;
      } catch (error: any) {
        this.totalFailed++;
        this.logger.error(
          `Event handler failed | type=${event.type} id=${event.id} error=${error?.message}`,
        );
        // Event bus failures are logged but do NOT throw —
        // one failing subscriber must not block others.
      }
    }
  }

  subscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler as EventHandler);
    this.logger.log(
      `Subscribed to event | type=${eventType} | total subscribers for type=${this.handlers.get(eventType)!.size}`,
    );
  }

  unsubscribe(eventType: DomainEventType, handler: EventHandler): void {
    const subscribers = this.handlers.get(eventType);
    if (subscribers) {
      subscribers.delete(handler);
      this.logger.log(`Unsubscribed from event | type=${eventType}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  status(): EventBusStatus {
    return {
      totalPublished: this.totalPublished,
      totalHandled: this.totalHandled,
      totalFailed: this.totalFailed,
      subscriberCount: Array.from(this.handlers.values()).reduce(
        (sum, set) => sum + set.size,
        0,
      ),
      registeredEventTypes: Array.from(this.handlers.keys()),
    };
  }

  /**
   * Factory helper: create a new IDomainEvent with auto-generated id.
   */
  createEvent<T>(
    type: DomainEventType,
    source: string,
    payload: T,
    correlationId?: string,
  ): IDomainEvent<T> {
    return {
      type,
      id: randomUUID(),
      source,
      occurredAt: new Date(),
      payload,
      correlationId,
      version: 1,
    };
  }
}
