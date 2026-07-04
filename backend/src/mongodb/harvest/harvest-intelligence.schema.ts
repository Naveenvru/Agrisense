import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * HarvestIntelligenceDocument
 *
 * Stores the complete harvest intelligence assessment snapshot for a FarmerCrop.
 * Each assessment is a point-in-time record. The document is upserted on each
 * assessment cycle so farmerCropId is always the latest active prediction.
 *
 * Collection: harvest_intelligence
 */
@Schema({ collection: 'harvest_intelligence', timestamps: true })
export class HarvestIntelligenceDocument extends Document {
  @Prop({ required: true, index: true })
  farmerCropId: string;

  @Prop({ index: true })
  farmerProfileId: string;

  @Prop()
  cropName: string;

  @Prop()
  cropVariety?: string;

  // Lifecycle
  @Prop() daysElapsed: number;
  @Prop() daysRemaining: number;
  @Prop() growthPercentage: number;
  @Prop() lifecycleStage: string;

  // Readiness
  @Prop() readinessScore: number;
  @Prop() readinessStatus: string;

  // Harvest Window
  @Prop({ type: Date }) earliestHarvestDate?: Date;
  @Prop({ type: Date }) optimalHarvestDate?: Date;
  @Prop({ type: Date }) latestSafeHarvestDate?: Date;

  // Scores
  @Prop() harvestScore: number;
  @Prop() confidenceScore: number;

  // Risk
  @Prop() riskLevel: string;
  @Prop({ type: [String] }) riskFactors: string[];
  @Prop({ type: [String] }) mitigationRecommendations: string[];

  // Delay
  @Prop({ default: 0 }) delayDays: number;
  @Prop({ type: [String], default: [] }) delayReasons: string[];
  @Prop({ type: [String], default: [] }) delayActions: string[];

  // Estimator
  @Prop() expectedYieldKg?: number;
  @Prop() yieldConfidence?: number;

  // Quality
  @Prop() qualityGrade?: string;
  @Prop() qualityExplanation?: string;

  // Labour & Equipment
  @Prop() workersRequired?: number;
  @Prop() harvestDurationDays?: number;
  @Prop() estimatedLabourHours?: number;
  @Prop({ type: [String], default: [] }) equipmentRecommendations: string[];

  // Storage
  @Prop() storageRecommendation?: string;
  @Prop() storageExplanation?: string;

  // Explainability
  @Prop({ type: [String], default: [] }) explanations: string[];

  // Metadata
  @Prop({ type: Date, default: Date.now }) assessedAt: Date;
  @Prop({ default: 1 }) version: number;
}

export const HarvestIntelligenceSchema =
  SchemaFactory.createForClass(HarvestIntelligenceDocument);

HarvestIntelligenceSchema.index({ farmerCropId: 1 }, { unique: true });
HarvestIntelligenceSchema.index({ farmerProfileId: 1 });
HarvestIntelligenceSchema.index({ assessedAt: -1 });
