import { Model } from 'mongoose';
import { YieldAnalyticsDocument } from './yield-analytics.schema';
import { YieldHistoryDocument } from './yield-history.schema';
import { YieldIntelligenceDocument } from './yield-intelligence.schema';
export declare class YieldMongoService {
    private readonly intelligenceModel;
    private readonly historyModel;
    private readonly analyticsModel;
    private readonly logger;
    constructor(intelligenceModel: Model<YieldIntelligenceDocument>, historyModel: Model<YieldHistoryDocument>, analyticsModel: Model<YieldAnalyticsDocument>);
    upsertAssessment(farmerCropId: string, data: Partial<YieldIntelligenceDocument>): Promise<void>;
    findByFarmerCropId(farmerCropId: string): Promise<YieldIntelligenceDocument | null>;
    findByFarmerProfileId(farmerProfileId: string): Promise<YieldIntelligenceDocument[]>;
    findAllPredictions(): Promise<YieldIntelligenceDocument[]>;
    appendHistory(entry: Partial<YieldHistoryDocument>): Promise<void>;
    findHistory(farmerCropId: string, limit?: number): Promise<YieldHistoryDocument[]>;
    upsertAnalytics(scope: string, periodType: string, periodStart: Date, data: Partial<YieldAnalyticsDocument>): Promise<void>;
    findAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<YieldAnalyticsDocument[]>;
}
