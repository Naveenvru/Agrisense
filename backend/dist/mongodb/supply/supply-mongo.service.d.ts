import { Model } from 'mongoose';
import { SupplyAnalyticsDocument } from './supply-analytics.schema';
import { SupplyHistoryDocument } from './supply-history.schema';
import { SupplyIntelligenceDocument } from './supply-intelligence.schema';
export declare class SupplyMongoService {
    private readonly intelligenceModel;
    private readonly historyModel;
    private readonly analyticsModel;
    private readonly logger;
    constructor(intelligenceModel: Model<SupplyIntelligenceDocument>, historyModel: Model<SupplyHistoryDocument>, analyticsModel: Model<SupplyAnalyticsDocument>);
    upsertAssessment(farmerCropId: string, data: Partial<SupplyIntelligenceDocument>): Promise<void>;
    findByFarmerCropId(farmerCropId: string): Promise<SupplyIntelligenceDocument | null>;
    findByFarmerProfileId(farmerProfileId: string): Promise<SupplyIntelligenceDocument[]>;
    findAllPredictions(): Promise<SupplyIntelligenceDocument[]>;
    appendHistory(entry: Partial<SupplyHistoryDocument>): Promise<void>;
    findHistory(farmerCropId: string, limit?: number): Promise<SupplyHistoryDocument[]>;
    upsertAnalytics(scope: string, periodType: string, periodStart: Date, data: Partial<SupplyAnalyticsDocument>): Promise<void>;
    findAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<SupplyAnalyticsDocument[]>;
}
