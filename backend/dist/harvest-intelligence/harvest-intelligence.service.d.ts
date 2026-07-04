import { DataSource } from 'typeorm';
import { HarvestMongoService } from '../mongodb/harvest/harvest-mongo.service';
import { CropLifecycleEngine } from './engines/crop-lifecycle.engine';
import { HarvestAssessmentEngine } from './engines/harvest-assessment.engine';
import { HarvestEstimatorEngine } from './engines/harvest-estimator.engine';
import { HarvestEventPublisher } from './events/harvest-event.publisher';
import { RegionalHarvestService } from './regional/regional-harvest.service';
export declare class HarvestIntelligenceService {
    private readonly dataSource;
    private readonly mongoService;
    private readonly lifecycleEngine;
    private readonly assessmentEngine;
    private readonly estimatorEngine;
    private readonly eventPublisher;
    private readonly regionalService;
    private readonly logger;
    constructor(dataSource: DataSource, mongoService: HarvestMongoService, lifecycleEngine: CropLifecycleEngine, assessmentEngine: HarvestAssessmentEngine, estimatorEngine: HarvestEstimatorEngine, eventPublisher: HarvestEventPublisher, regionalService: RegionalHarvestService);
    assess(farmerCropId: string, userId: string): Promise<any>;
    getAssessment(farmerCropId: string, userId: string): Promise<any>;
    getMyAssessments(userId: string): Promise<any[]>;
    getReadiness(farmerCropId: string, userId: string): Promise<{
        farmerCropId: string;
        cropName: any;
        readinessScore: any;
        readinessStatus: any;
        daysRemaining: any;
        lifecycleStage: any;
        explanations: any;
        assessedAt: any;
    }>;
    getWindow(farmerCropId: string, userId: string): Promise<{
        farmerCropId: string;
        cropName: any;
        earliestHarvestDate: any;
        optimalHarvestDate: any;
        latestSafeHarvestDate: any;
        delayDays: any;
        delayReasons: any;
        explanations: any;
    }>;
    getRisk(farmerCropId: string, userId: string): Promise<{
        farmerCropId: string;
        cropName: any;
        riskLevel: any;
        riskFactors: any;
        mitigationRecommendations: any;
        confidenceScore: any;
    }>;
    getHistory(farmerCropId: string, userId: string, limit?: number): Promise<import("../mongodb/harvest/harvest-history.schema").HarvestHistoryDocument[]>;
    getEstimate(farmerCropId: string, userId: string): Promise<{
        farmerCropId: string;
        cropName: any;
        expectedYieldKg: any;
        yieldConfidence: any;
        qualityGrade: any;
        qualityExplanation: any;
        workersRequired: any;
        harvestDurationDays: any;
        estimatedLabourHours: any;
        equipmentRecommendations: any;
        storageRecommendation: any;
        storageExplanation: any;
    }>;
    getAnalytics(regionLevel: string, regionName?: string, periodType?: string, limit?: number): Promise<import("../mongodb/harvest/harvest-analytics.schema").HarvestAnalyticsDocument[]>;
    getRegional(level: string, name: string): Promise<{
        regionLevel: "district" | "state" | "village" | "taluk";
        regionName: string;
        totalFarmers: number;
        totalCrops: number;
        summary: string;
        crops: never[];
        totalAssessed?: undefined;
        avgReadinessScore?: undefined;
        totalExpectedYieldKg?: undefined;
        readyCrops?: undefined;
        delayedCrops?: undefined;
        cropBreakdown?: undefined;
        generatedAt?: undefined;
    } | {
        regionLevel: "district" | "state" | "village" | "taluk";
        regionName: string;
        totalFarmers: number;
        totalCrops: number;
        totalAssessed: number;
        avgReadinessScore: number;
        totalExpectedYieldKg: number;
        readyCrops: number;
        delayedCrops: number;
        cropBreakdown: Record<string, {
            count: number;
            totalYieldKg: number;
            avgReadiness: number;
        }>;
        generatedAt: Date;
        summary?: undefined;
        crops?: undefined;
    }>;
    runBulkAssessment(): Promise<{
        assessed: number;
        failed: number;
    }>;
    private loadCropData;
    private buildWeatherContext;
    private defaultWeatherContext;
    private buildActivityContext;
    private resolveProfileId;
}
