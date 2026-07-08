import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DemandAnalyticsDocument } from './demand-analytics.schema';
import { DemandHistoryDocument } from './demand-history.schema';
import { DemandIntelligenceDocument } from './demand-intelligence.schema';

@Injectable()
export class DemandMongoService {
  private readonly logger = new Logger(DemandMongoService.name);

  constructor(
    @InjectModel(DemandIntelligenceDocument.name)
    private readonly intelligenceModel: Model<DemandIntelligenceDocument>,
    @InjectModel(DemandHistoryDocument.name)
    private readonly historyModel: Model<DemandHistoryDocument>,
    @InjectModel(DemandAnalyticsDocument.name)
    private readonly analyticsModel: Model<DemandAnalyticsDocument>,
  ) {}

  async upsertAssessment(farmerCropId: string, data: Partial<DemandIntelligenceDocument>): Promise<void> {
    await this.intelligenceModel.updateOne(
      { farmerCropId },
      { $set: { ...data, assessedAt: new Date() } },
      { upsert: true },
    ).exec();
    this.logger.debug(`Demand assessment upserted for farmerCropId=${farmerCropId}`);
  }

  async findByFarmerCropId(farmerCropId: string): Promise<DemandIntelligenceDocument | null> {
    return this.intelligenceModel.findOne({ farmerCropId }).exec();
  }

  async findByFarmerProfileId(farmerProfileId: string): Promise<DemandIntelligenceDocument[]> {
    return this.intelligenceModel.find({ farmerProfileId }).sort({ assessedAt: -1 }).exec();
  }

  async findAllPredictions(): Promise<DemandIntelligenceDocument[]> {
    return this.intelligenceModel.find({}).sort({ assessedAt: -1 }).exec();
  }

  async appendHistory(entry: Partial<DemandHistoryDocument>): Promise<void> {
    await this.historyModel.create({ ...entry, predictionTimestamp: new Date() });
    this.logger.debug(`Demand history appended for farmerCropId=${entry.farmerCropId}`);
  }

  async findHistory(farmerCropId: string, limit = 20): Promise<DemandHistoryDocument[]> {
    return this.historyModel.find({ farmerCropId }).sort({ predictionTimestamp: -1 }).limit(limit).exec();
  }

  async upsertAnalytics(
    scope: string,
    periodType: string,
    periodStart: Date,
    data: Partial<DemandAnalyticsDocument>,
  ): Promise<void> {
    await this.analyticsModel.updateOne(
      { scope, periodType, periodStart, regionLevel: data.regionLevel, regionName: data.regionName, cropName: data.cropName },
      { $set: { ...data, generatedAt: new Date() } },
      { upsert: true },
    ).exec();
  }

  async findAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit = 12): Promise<DemandAnalyticsDocument[]> {
    const query: Record<string, any> = {};
    if (regionLevel) query.regionLevel = regionLevel;
    if (regionName) query.regionName = regionName;
    if (periodType) query.periodType = periodType;
    return this.analyticsModel.find(query).sort({ periodStart: -1 }).limit(limit).exec();
  }
}
