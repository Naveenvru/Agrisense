import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../common/events/event-bus.service';

@Injectable()
export class SupplyEventPublisher {
  constructor(private readonly eventBus: EventBusService) {}

  async publishPredicted(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('supply.predicted', 'SupplyIntelligenceService', payload));
  }

  async publishUpdated(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('supply.updated', 'SupplyIntelligenceService', payload));
  }

  async publishWarning(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('supply.warning', 'SupplyIntelligenceService', payload));
  }

  async publishCompleted(payload: Record<string, any>): Promise<void> {
    await this.eventBus.publish(this.eventBus.createEvent('supply.completed', 'SupplyIntelligenceService', payload));
  }
}