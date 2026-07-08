import { HarvestIntelligenceService } from './harvest-intelligence.service';
import { RegionalQueryDto, AnalyticsQueryDto, HistoryQueryDto } from './dto/harvest-query.dto';
export declare class HarvestIntelligenceController {
    private readonly service;
    constructor(service: HarvestIntelligenceService);
    getSummary(req: any): Promise<{
        data: any[];
        count: number;
    }>;
    getAssessment(id: string, req: any): Promise<{
        data: any;
    }>;
    getReadiness(id: string, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: any;
            readinessScore: any;
            readinessStatus: any;
            daysRemaining: any;
            lifecycleStage: any;
            explanations: any;
            assessedAt: any;
        };
    }>;
    getWindow(id: string, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: any;
            earliestHarvestDate: any;
            optimalHarvestDate: any;
            latestSafeHarvestDate: any;
            delayDays: any;
            delayReasons: any;
            explanations: any;
        };
    }>;
    getRisk(id: string, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: any;
            riskLevel: any;
            riskFactors: any;
            mitigationRecommendations: any;
            confidenceScore: any;
        };
    }>;
    getHistory(id: string, query: HistoryQueryDto, req: any): Promise<{
        data: import("../mongodb/harvest/harvest-history.schema").HarvestHistoryDocument[];
        count: number;
    }>;
    getEstimate(id: string, req: any): Promise<{
        data: {
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
        };
    }>;
    getRegional(query: RegionalQueryDto): Promise<{
        data: {
            regionLevel: "village" | "taluk" | "district" | "state";
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
            regionLevel: "village" | "taluk" | "district" | "state";
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
        };
    }>;
    getAnalytics(query: AnalyticsQueryDto): Promise<{
        data: import("../mongodb/harvest/harvest-analytics.schema").HarvestAnalyticsDocument[];
        count: number;
    }>;
    recalculate(id: string, req: any): Promise<{
        message: string;
        data: any;
    }>;
    recalculateAll(): Promise<{
        assessed: number;
        failed: number;
        message: string;
    }>;
}
