import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupplyAnalyticsDocument } from './supply-analytics.schema';
import { SupplyHistoryDocument } from './supply-history.schema';
import { SupplyIntelligenceDocument } from './supply-intelligence.schema';

@Injectable()
export class SupplyMongoService {
  private readonly logger = new Logger(SupplyMongoService.name);

  constructor(
    @InjectModel(SupplyIntelligenceDocument.name)
    private readonly intelligenceModel: Model<SupplyIntelligenceDocument>,
    @InjectModel(SupplyHistoryDocument.name)
    private readonly historyModel: Model<SupplyHistoryDocument>,
    @InjectModel(SupplyAnalyticsDocument.name)
    private readonly analyticsModel: Model<SupplyAnalyticsDocument>,
  ) {}

  async upsertAssessment(farmerCropId: string, data: Partial<SupplyIntelligenceDocument>): Promise<void> {
    await this.intelligenceModel.updateOne(
      { farmerCropId },
      { $set: { ...data, assessedAt: new Date() } },
      { upsert: true },
    ).exec();
    this.logger.debug(`Supply assessment upserted for farmerCropId=${farmerCropId}`);
  }

  async findByFarmerCropId(farmerCropId: string): Promise<SupplyIntelligenceDocument | null> {
    return this.intelligenceModel.findOne({ farmerCropId }).exec();
  }

  async findByFarmerProfileId(farmerProfileId: string): Promise<SupplyIntelligenceDocument[]> {
    return this.intelligenceModel.find({ farmerProfileId }).sort({ assessedAt: -1 }).exec();
  }

  async findAllPredictions(): Promise<SupplyIntelligenceDocument[]> {
    return this.intelligenceModel.find({}).sort({ assessedAt: -1 }).exec();
  }

  async appendHistory(entry: Partial<SupplyHistoryDocument>): Promise<void> {
    await this.historyModel.create({ ...entry, predictionTimestamp: new Date() });
    this.logger.debug(`Supply history appended for farmerCropId=${entry.farmerCropId}`);
  }

  async findHistory(farmerCropId: string, limit = 20): Promise<SupplyHistoryDocument[]> {
    return this.historyModel.find({ farmerCropId }).sort({ predictionTimestamp: -1 }).limit(limit).exec();
  }

  async upsertAnalytics(
    scope: string,
    periodType: string,
    periodStart: Date,
    data: Partial<SupplyAnalyticsDocument>,
  ): Promise<void> {
    await this.analyticsModel.updateOne(
      { scope, periodType, periodStart, regionLevel: data.regionLevel, regionName: data.regionName, cropName: data.cropName },
      { $set: { ...data, generatedAt: new Date() } },
      { upsert: true },
    ).exec();
  }

  async findAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit = 12): Promise<SupplyAnalyticsDocument[]> {
    const query: Record<string, any> = {};
    if (regionLevel) query.regionLevel = regionLevel;
    if (regionName) query.regionName = regionName;
    if (periodType) query.periodType = periodType;

    return this.analyticsModel.find(query).sort({ periodStart: -1 }).limit(limit).exec();
  }
}