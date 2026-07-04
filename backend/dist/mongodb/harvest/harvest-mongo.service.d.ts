import { Model } from 'mongoose';
import { HarvestIntelligenceDocument } from './harvest-intelligence.schema';
import { HarvestHistoryDocument } from './harvest-history.schema';
import { HarvestAnalyticsDocument } from './harvest-analytics.schema';
export declare class HarvestMongoService {
    private readonly intelligenceModel;
    private readonly historyModel;
    private readonly analyticsModel;
    private readonly logger;
    constructor(intelligenceModel: Model<HarvestIntelligenceDocument>, historyModel: Model<HarvestHistoryDocument>, analyticsModel: Model<HarvestAnalyticsDocument>);
    upsertAssessment(farmerCropId: string, data: Partial<HarvestIntelligenceDocument>): Promise<void>;
    findByFarmerCropId(farmerCropId: string): Promise<HarvestIntelligenceDocument | null>;
    findByFarmerProfileId(farmerProfileId: string): Promise<HarvestIntelligenceDocument[]>;
    appendHistory(entry: Partial<HarvestHistoryDocument>): Promise<void>;
    findHistory(farmerCropId: string, limit?: number): Promise<HarvestHistoryDocument[]>;
    upsertAnalytics(regionLevel: string, regionName: string, periodType: string, periodStart: Date, data: Partial<HarvestAnalyticsDocument>): Promise<void>;
    findAnalytics(regionLevel: string, regionName?: string, periodType?: string, limit?: number): Promise<HarvestAnalyticsDocument[]>;
    findAllActiveAssessments(): Promise<HarvestIntelligenceDocument[]>;
}
