import { Model } from 'mongoose';
import { DemandAnalyticsDocument, DemandHistoryDocument, DemandIntelligenceDocument } from './demand-intelligence.schema';
export declare class DemandMongoService {
    private readonly intelligenceModel;
    private readonly historyModel;
    private readonly analyticsModel;
    private readonly logger;
    constructor(intelligenceModel: Model<DemandIntelligenceDocument>, historyModel: Model<DemandHistoryDocument>, analyticsModel: Model<DemandAnalyticsDocument>);
    upsertAssessment(key: {
        cropName: string;
        regionLevel: string;
        regionName: string;
    }, data: Partial<DemandIntelligenceDocument>): Promise<void>;
    findByKey(key: {
        cropName: string;
        regionLevel: string;
        regionName: string;
    }): Promise<DemandIntelligenceDocument | null>;
    findAllPredictions(): Promise<DemandIntelligenceDocument[]>;
    appendHistory(entry: Partial<DemandHistoryDocument>): Promise<void>;
    upsertAnalytics(scope: string, periodType: string, periodStart: Date, data: Partial<DemandAnalyticsDocument>): Promise<void>;
    findAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<DemandAnalyticsDocument[]>;
}
