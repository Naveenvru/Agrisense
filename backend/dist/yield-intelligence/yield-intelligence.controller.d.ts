import { YieldIntelligenceService } from './yield-intelligence.service';
import { RegionalQueryDto, AnalyticsQueryDto, HistoryQueryDto } from './dto/yield-query.dto';
export declare class YieldIntelligenceController {
    private readonly service;
    constructor(service: YieldIntelligenceService);
    getSummary(req: any): Promise<{
        data: any[];
        count: number;
    }>;
    getRisk(id: string, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: string;
            riskLevel: import("../harvest-intelligence/interfaces/harvest-intelligence.types").RiskLevel;
            riskScore: number;
            reasons: string[];
            mitigationRecommendations: string[];
            explanations: string[];
        };
    }>;
    getConfidence(id: string, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: string;
            confidence: number;
            confidenceBand: import("./interfaces/yield-intelligence.types").YieldConfidenceBand;
            explanation: string;
            reasons: string[];
        };
    }>;
    getLoss(id: string, req: any): Promise<{
        data: {
            farmerCropId: string;
            cropName: string;
            expectedLossPercent: number;
            expectedLossQuantityKg: number;
            explanation: string;
            reasons: string[];
        };
    }>;
    getRegional(query: RegionalQueryDto): Promise<{
        data: import("./interfaces/yield-intelligence.types").YieldRegionalSummary;
    }>;
    getAnalytics(query: AnalyticsQueryDto): Promise<{
        data: any[];
        count: number;
    }>;
    getHistory(id: string, query: HistoryQueryDto, req: any): Promise<{
        data: import("../mongodb/yield/yield-history.schema").YieldHistoryDocument[];
        count: number;
    }>;
    recalculate(id: string, req: any): Promise<{
        message: string;
        data: import("./interfaces/yield-intelligence.types").YieldPredictionResult;
    }>;
    recalculateAll(): Promise<{
        assessed: number;
        failed: number;
        message: string;
    }>;
    getAssessment(id: string, req: any): Promise<{
        data: import("./interfaces/yield-intelligence.types").YieldPredictionResult;
    }>;
}
