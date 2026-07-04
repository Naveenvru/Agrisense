import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../../common/events/event-bus.service';

/**
 * HarvestEventPublisher
 *
 * Publishes harvest domain events using the existing EventBusService.
 * Wraps the raw publish call to enforce type safety on harvest-specific payloads.
 *
 * Do NOT instantiate EventBusService directly in HarvestIntelligenceService —
 * always publish through this class to maintain single-responsibility.
 */
@Injectable()
export class HarvestEventPublisher {
  private readonly logger = new Logger(HarvestEventPublisher.name);

  constructor(private readonly eventBus: EventBusService) {}

  async publishPredicted(payload: {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    readinessScore: number;
    harvestScore: number;
    confidenceScore: number;
    optimalHarvestDate?: Date;
  }): Promise<void> {
    const event = this.eventBus.createEvent('harvest.predicted', 'HarvestIntelligenceService', payload);
    await this.eventBus.publish(event);
    this.logger.debug(`Event published: harvest.predicted | farmerCropId=${payload.farmerCropId}`);
  }

  async publishUpdated(payload: {
    farmerCropId: string;
    farmerProfileId: string;
    previousReadiness: number;
    newReadiness: number;
    reason: string;
  }): Promise<void> {
    const event = this.eventBus.createEvent('harvest.updated', 'HarvestIntelligenceService', payload);
    await this.eventBus.publish(event);
    this.logger.debug(`Event published: harvest.updated | farmerCropId=${payload.farmerCropId}`);
  }

  async publishDelayed(payload: {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    delayDays: number;
    delayReasons: string[];
  }): Promise<void> {
    const event = this.eventBus.createEvent('harvest.delayed', 'HarvestIntelligenceService', payload);
    await this.eventBus.publish(event);
    this.logger.log(`Event published: harvest.delayed | farmerCropId=${payload.farmerCropId} | delayDays=${payload.delayDays}`);
  }

  async publishCompleted(payload: {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    actualYieldKg?: number;
  }): Promise<void> {
    const event = this.eventBus.createEvent('harvest.completed', 'HarvestIntelligenceService', payload);
    await this.eventBus.publish(event);
    this.logger.log(`Event published: harvest.completed | farmerCropId=${payload.farmerCropId}`);
  }

  async publishReadinessAlert(payload: {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    readinessStatus: string;
    readinessScore: number;
    recommendation: string;
  }): Promise<void> {
    const event = this.eventBus.createEvent('harvest.readiness.alert', 'HarvestIntelligenceService', payload);
    await this.eventBus.publish(event);
    this.logger.log(`Event published: harvest.readiness.alert | farmerCropId=${payload.farmerCropId}`);
  }
}
