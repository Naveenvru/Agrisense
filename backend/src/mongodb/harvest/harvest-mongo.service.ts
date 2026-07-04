import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HarvestIntelligenceDocument } from './harvest-intelligence.schema';
import { HarvestHistoryDocument } from './harvest-history.schema';
import { HarvestAnalyticsDocument } from './harvest-analytics.schema';
import type { IHarvestAssessmentResult } from '../../harvest-intelligence/interfaces/harvest-assessment.interface';

/**
 * HarvestMongoService
 *
 * Data access layer for all harvest-intelligence MongoDB collections.
 * Called by HarvestIntelligenceService — never directly from controllers.
 */
@Injectable()
export class HarvestMongoService {
  private readonly logger = new Logger(HarvestMongoService.name);

  constructor(
    @InjectModel(HarvestIntelligenceDocument.name)
    private readonly intelligenceModel: Model<HarvestIntelligenceDocument>,
    @InjectModel(HarvestHistoryDocument.name)
    private readonly historyModel: Model<HarvestHistoryDocument>,
    @InjectModel(HarvestAnalyticsDocument.name)
    private readonly analyticsModel: Model<HarvestAnalyticsDocument>,
  ) {}

  // ---------------------------------------------------------------------------
  // Harvest Intelligence (latest prediction per crop)
  // ---------------------------------------------------------------------------

  /** Upsert latest harvest assessment for a farmerCropId */
  async upsertAssessment(farmerCropId: string, data: Partial<HarvestIntelligenceDocument>): Promise<void> {
    await this.intelligenceModel.updateOne(
      { farmerCropId },
      { $set: { ...data, assessedAt: new Date() } },
      { upsert: true },
    ).exec();
    this.logger.debug(`Assessment upserted for farmerCropId=${farmerCropId}`);
  }

  /** Fetch latest assessment for a single farmer crop */
  async findByFarmerCropId(farmerCropId: string): Promise<HarvestIntelligenceDocument | null> {
    return this.intelligenceModel.findOne({ farmerCropId }).exec();
  }

  /** Fetch all active assessments for a farmer profile */
  async findByFarmerProfileId(farmerProfileId: string): Promise<HarvestIntelligenceDocument[]> {
    return this.intelligenceModel.find({ farmerProfileId }).sort({ assessedAt: -1 }).exec();
  }

  // ---------------------------------------------------------------------------
  // Harvest History (append-only audit trail)
  // ---------------------------------------------------------------------------

  /** Append a history entry for an assessment version */
  async appendHistory(entry: Partial<HarvestHistoryDocument>): Promise<void> {
    await this.historyModel.create({ ...entry, predictionTimestamp: new Date() });
    this.logger.debug(`History appended for farmerCropId=${entry.farmerCropId}`);
  }

  /** Fetch assessment history for a farmer crop, newest first */
  async findHistory(farmerCropId: string, limit = 20): Promise<HarvestHistoryDocument[]> {
    return this.historyModel
      .find({ farmerCropId })
      .sort({ predictionTimestamp: -1 })
      .limit(limit)
      .exec();
  }

  // ---------------------------------------------------------------------------
  // Regional Analytics
  // ---------------------------------------------------------------------------

  /** Upsert regional analytics snapshot */
  async upsertAnalytics(
    regionLevel: string,
    regionName: string,
    periodType: string,
    periodStart: Date,
    data: Partial<HarvestAnalyticsDocument>,
  ): Promise<void> {
    await this.analyticsModel.updateOne(
      { regionLevel, regionName, periodType, periodStart },
      { $set: { ...data, generatedAt: new Date() } },
      { upsert: true },
    ).exec();
  }

  /** Fetch analytics by region */
  async findAnalytics(
    regionLevel: string,
    regionName?: string,
    periodType?: string,
    limit = 12,
  ): Promise<HarvestAnalyticsDocument[]> {
    const query: Record<string, any> = { regionLevel };
    if (regionName) query.regionName = regionName;
    if (periodType) query.periodType = periodType;

    return this.analyticsModel
      .find(query)
      .sort({ periodStart: -1 })
      .limit(limit)
      .exec();
  }

  /** Fetch all active assessments (used by scheduler job) */
  async findAllActiveAssessments(): Promise<HarvestIntelligenceDocument[]> {
    return this.intelligenceModel.find({}).exec();
  }
}
