import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * HarvestHistoryDocument
 *
 * Stores each version of a harvest assessment for a FarmerCrop.
 * Provides audit trail and supports AI evaluation in Phase 12+.
 * A new document is appended on every recalculation.
 *
 * Collection: harvest_history
 */
@Schema({ collection: 'harvest_history', timestamps: true })
export class HarvestHistoryDocument extends Document {
  @Prop({ required: true, index: true })
  farmerCropId: string;

  @Prop({ index: true })
  farmerProfileId: string;

  @Prop()
  cropName: string;

  /** Prediction timestamp */
  @Prop({ type: Date, default: Date.now })
  predictionTimestamp: Date;

  /** Previous expected harvest date (null on first prediction) */
  @Prop({ type: Date })
  previousHarvestDate?: Date;

  /** New (current) expected harvest date */
  @Prop({ type: Date })
  newHarvestDate?: Date;

  /** What triggered this recalculation */
  @Prop()
  reason: string;

  /** Readiness score at this point in time */
  @Prop()
  readinessScore: number;

  /** Harvest score at this point in time */
  @Prop()
  harvestScore: number;

  /** Confidence score at this point in time */
  @Prop()
  confidenceScore: number;

  /** Risk level at this point in time */
  @Prop()
  riskLevel: string;

  /** Delay days calculated at this point */
  @Prop({ default: 0 })
  delayDays: number;

  /** Explanations for this version */
  @Prop({ type: [String], default: [] })
  explanations: string[];

  /** Version number of this history entry */
  @Prop({ default: 1 })
  version: number;
}

export const HarvestHistorySchema =
  SchemaFactory.createForClass(HarvestHistoryDocument);

HarvestHistorySchema.index({ farmerCropId: 1, predictionTimestamp: -1 });
HarvestHistorySchema.index({ farmerProfileId: 1 });
