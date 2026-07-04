import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { YieldAnalyticsDocument } from './yield-analytics.schema';
import { YieldHistoryDocument } from './yield-history.schema';
import { YieldIntelligenceDocument } from './yield-intelligence.schema';

@Injectable()
export class YieldMongoService {
  private readonly logger = new Logger(YieldMongoService.name);

  constructor(
    @InjectModel(YieldIntelligenceDocument.name)
    private readonly intelligenceModel: Model<YieldIntelligenceDocument>,
    @InjectModel(YieldHistoryDocument.name)
    private readonly historyModel: Model<YieldHistoryDocument>,
    @InjectModel(YieldAnalyticsDocument.name)
    private readonly analyticsModel: Model<YieldAnalyticsDocument>,
  ) {}

  async upsertAssessment(farmerCropId: string, data: Partial<YieldIntelligenceDocument>): Promise<void> {
    await this.intelligenceModel.updateOne(
      { farmerCropId },
      { $set: { ...data, assessedAt: new Date() } },
      { upsert: true },
    ).exec();
    this.logger.debug(`Yield assessment upserted for farmerCropId=${farmerCropId}`);
  }

  async findByFarmerCropId(farmerCropId: string): Promise<YieldIntelligenceDocument | null> {
    return this.intelligenceModel.findOne({ farmerCropId }).exec();
  }

  async findByFarmerProfileId(farmerProfileId: string): Promise<YieldIntelligenceDocument[]> {
    return this.intelligenceModel.find({ farmerProfileId }).sort({ assessedAt: -1 }).exec();
  }

  async findAllPredictions(): Promise<YieldIntelligenceDocument[]> {
    return this.intelligenceModel.find({}).sort({ assessedAt: -1 }).exec();
  }

  async appendHistory(entry: Partial<YieldHistoryDocument>): Promise<void> {
    await this.historyModel.create({ ...entry, predictionTimestamp: new Date() });
    this.logger.debug(`Yield history appended for farmerCropId=${entry.farmerCropId}`);
  }

  async findHistory(farmerCropId: string, limit = 20): Promise<YieldHistoryDocument[]> {
    return this.historyModel.find({ farmerCropId }).sort({ predictionTimestamp: -1 }).limit(limit).exec();
  }

  async upsertAnalytics(
    scope: string,
    periodType: string,
    periodStart: Date,
    data: Partial<YieldAnalyticsDocument>,
  ): Promise<void> {
    await this.analyticsModel.updateOne(
      { scope, periodType, periodStart, regionLevel: data.regionLevel, regionName: data.regionName, cropName: data.cropName },
      { $set: { ...data, generatedAt: new Date() } },
      { upsert: true },
    ).exec();
  }

  async findAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit = 12): Promise<YieldAnalyticsDocument[]> {
    const query: Record<string, any> = {};
    if (regionLevel) query.regionLevel = regionLevel;
    if (regionName) query.regionName = regionName;
    if (periodType) query.periodType = periodType;

    return this.analyticsModel.find(query).sort({ periodStart: -1 }).limit(limit).exec();
  }
}
