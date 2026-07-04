/**
 * Domain Event Types
 *
 * TypeScript types for the AgriSense domain event bus.
 * Every event in the system is described by an IDomainEvent.
 */

/** All domain event types in the AgriSense system */
export type DomainEventType =
  // Weather
  | 'weather.collected'
  | 'weather.forecast.collected'
  | 'weather.alert.triggered'
  // Market
  | 'market.prices.collected'
  | 'market.price.spike.detected'
  // Government
  | 'government.advisory.collected'
  // Farmer
  | 'farmer.profile.created'
  | 'farmer.crop.sown'
  | 'farmer.crop.harvested'
  // Harvest Intelligence (Phase 11)
  | 'harvest.predicted'
  | 'harvest.updated'
  | 'harvest.delayed'
  | 'harvest.completed'
  | 'harvest.readiness.alert'
  // System
  | 'system.data.cleanup.completed'
  | 'system.archive.completed';

/** Base shape for every domain event */
export interface IDomainEvent<T = unknown> {
  /** Event type identifier */
  type: DomainEventType;
  /** Unique event ID (UUID) */
  id: string;
  /** Originating service/module */
  source: string;
  /** UTC timestamp of the event */
  occurredAt: Date;
  /** Domain-specific event payload */
  payload: T;
  /** Optional correlation ID for tracing across multiple events */
  correlationId?: string;
  /** Schema version for future migration */
  version: number;
}

/** Subscription handler signature */
export type EventHandler<T = unknown> = (event: IDomainEvent<T>) => Promise<void> | void;

/** Summary of event bus state */
export interface EventBusStatus {
  totalPublished: number;
  totalHandled: number;
  totalFailed: number;
  subscriberCount: number;
  registeredEventTypes: string[];
}
