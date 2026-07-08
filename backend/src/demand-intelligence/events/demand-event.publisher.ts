import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../../common/events/event-bus.service';
import type { DemandPredictionResult } from '../interfaces/demand-intelligence.types';

@Injectable()
export class DemandEventPublisher {
  private readonly logger = new Logger(DemandEventPublisher.name);
  private static readonly SOURCE = 'demand-intelligence';

  constructor(private readonly eventBus: EventBusService) {}

  publishPredicted(result: DemandPredictionResult): void {
    try {
      const event = this.eventBus.createEvent('demand.predicted', DemandEventPublisher.SOURCE, {
        farmerCropId: result.farmerCropId,
        cropName: result.cropName,
        currentDemandKg: result.currentDemandKg,
        expectedDemandKg: result.expectedDemandKg,
        confidence: result.confidence,
        riskLevel: result.risk.level,
        regionLevel: result.regionLevel,
        regionName: result.regionName,
      });
      this.eventBus.publish(event);
      this.logger.debug(`Event published: demand.predicted | farmerCropId=${result.farmerCropId}`);
    } catch (err) {
      this.logger.warn(`Failed to publish demand.predicted event: ${(err as Error).message}`);
    }
  }

  publishUpdated(result: DemandPredictionResult, previousDemandKg: number): void {
    try {
      const event = this.eventBus.createEvent('demand.updated', DemandEventPublisher.SOURCE, {
        farmerCropId: result.farmerCropId,
        cropName: result.cropName,
        previousDemandKg,
        currentDemandKg: result.currentDemandKg,
        expectedDemandKg: result.expectedDemandKg,
        confidence: result.confidence,
      });
      this.eventBus.publish(event);
      this.logger.debug(`Event published: demand.updated | farmerCropId=${result.farmerCropId}`);
    } catch (err) {
      this.logger.warn(`Failed to publish demand.updated event: ${(err as Error).message}`);
    }
  }

  publishWarning(result: DemandPredictionResult): void {
    try {
      const event = this.eventBus.createEvent('demand.warning', DemandEventPublisher.SOURCE, {
        farmerCropId: result.farmerCropId,
        cropName: result.cropName,
        riskLevel: result.risk.level,
        riskScore: result.risk.score,
        riskReasons: result.risk.reasons,
        currentDemandKg: result.currentDemandKg,
      });
      this.eventBus.publish(event);
      this.logger.debug(`Event published: demand.warning | farmerCropId=${result.farmerCropId} risk=${result.risk.level}`);
    } catch (err) {
      this.logger.warn(`Failed to publish demand.warning event: ${(err as Error).message}`);
    }
  }

  publishCompleted(result: DemandPredictionResult, actualDemandKg: number): void {
    try {
      const event = this.eventBus.createEvent('demand.completed', DemandEventPublisher.SOURCE, {
        farmerCropId: result.farmerCropId,
        cropName: result.cropName,
        finalDemandKg: actualDemandKg,
        expectedDemandKg: result.expectedDemandKg,
        confidence: result.confidence,
      });
      this.eventBus.publish(event);
      this.logger.debug(`Event published: demand.completed | farmerCropId=${result.farmerCropId}`);
    } catch (err) {
      this.logger.warn(`Failed to publish demand.completed event: ${(err as Error).message}`);
    }
  }
}
