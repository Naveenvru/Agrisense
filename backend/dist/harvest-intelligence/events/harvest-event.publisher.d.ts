import { EventBusService } from '../../common/events/event-bus.service';
export declare class HarvestEventPublisher {
    private readonly eventBus;
    private readonly logger;
    constructor(eventBus: EventBusService);
    publishPredicted(payload: {
        farmerCropId: string;
        farmerProfileId: string;
        cropName: string;
        readinessScore: number;
        harvestScore: number;
        confidenceScore: number;
        optimalHarvestDate?: Date;
    }): Promise<void>;
    publishUpdated(payload: {
        farmerCropId: string;
        farmerProfileId: string;
        previousReadiness: number;
        newReadiness: number;
        reason: string;
    }): Promise<void>;
    publishDelayed(payload: {
        farmerCropId: string;
        farmerProfileId: string;
        cropName: string;
        delayDays: number;
        delayReasons: string[];
    }): Promise<void>;
    publishCompleted(payload: {
        farmerCropId: string;
        farmerProfileId: string;
        cropName: string;
        actualYieldKg?: number;
    }): Promise<void>;
    publishReadinessAlert(payload: {
        farmerCropId: string;
        farmerProfileId: string;
        cropName: string;
        readinessStatus: string;
        readinessScore: number;
        recommendation: string;
    }): Promise<void>;
}
