import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../common/events/event-bus.service';

@Injectable()
export class YieldEventPublisher {
  constructor(private readonly eventBus: EventBusService) {}

  async publishPredicted(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('yield.predicted', 'YieldIntelligenceService', payload));
  }

  async publishUpdated(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('yield.updated', 'YieldIntelligenceService', payload));
  }

  async publishReduced(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('yield.reduced', 'YieldIntelligenceService', payload));
  }

  async publishWarning(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('yield.warning', 'YieldIntelligenceService', payload));
  }

  async publishCompleted(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('yield.completed', 'YieldIntelligenceService', payload));
  }
}
