import { DemandIntelligenceService } from './demand-intelligence.service';
import { RegionalDemandQueryDto, DemandAnalyticsQueryDto, DemandActionQueryDto } from './dto/demand-query.dto';
export declare class DemandIntelligenceController {
    private readonly demandService;
    private readonly logger;
    constructor(demandService: DemandIntelligenceService);
    getSummary(req: any): Promise<any[]>;
    getRisk(req: any, farmerCropId?: string): Promise<{
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
    }>;
    getTimeline(req: any, farmerCropId?: string): Promise<any>;
    getRegional(query: RegionalDemandQueryDto): Promise<import("./interfaces/demand-intelligence.types").DemandRegionalSummary>;
    getAnalytics(query: DemandAnalyticsQueryDto): Promise<any[]>;
    getAssessment(req: any, cropId: string): Promise<import("./interfaces/demand-intelligence.types").DemandPredictionResult>;
    recalculate(req: any, query: DemandActionQueryDto): Promise<import("./interfaces/demand-intelligence.types").DemandPredictionResult | {
        assessed: number;
        failed: number;
    }>;
    recalculateAll(): Promise<{
        message: string;
        assessed: number;
        failed: number;
    }>;
}
