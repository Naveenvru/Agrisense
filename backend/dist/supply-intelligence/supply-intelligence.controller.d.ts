import { SupplyIntelligenceService } from './supply-intelligence.service';
import { AnalyticsQueryDto, RegionalQueryDto, SupplyActionQueryDto } from './dto/supply-query.dto';
export declare class SupplyIntelligenceController {
    private readonly service;
    constructor(service: SupplyIntelligenceService);
    getSummary(req: any): Promise<{
        data: any[];
        count: number;
    }>;
    getRisk(query: SupplyActionQueryDto, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: string;
            riskLevel: any;
            riskScore: any;
            reasons: any;
            mitigationRecommendations: any;
            explanations: string[];
            totalAssessments?: undefined;
        } | {
            riskLevel: any;
            riskScore: any;
            reasons: any;
            mitigationRecommendations: any;
            explanations: any;
            totalAssessments: number;
            farmerCropId?: undefined;
            cropName?: undefined;
        };
    }>;
    getTimeline(query: SupplyActionQueryDto, req: any): Promise<{
        data: any[];
    }>;
    getRegional(query: RegionalQueryDto): Promise<{
        data: import("./interfaces/supply-intelligence.types").SupplyRegionalSummary;
    }>;
    getAnalytics(query: AnalyticsQueryDto): Promise<{
        data: any[];
        count: number;
    }>;
    getAssessment(id: string, req: any): Promise<{
        data: import("./interfaces/supply-intelligence.types").SupplyPredictionResult;
    }>;
    recalculate(query: SupplyActionQueryDto, req: any): Promise<{
        message: string;
        data: import("./interfaces/supply-intelligence.types").SupplyPredictionResult;
    } | {
        assessed: number;
        failed: number;
        message: string;
        data?: undefined;
    }>;
    recalculateAll(): Promise<{
        assessed: number;
        failed: number;
        message: string;
    }>;
}
