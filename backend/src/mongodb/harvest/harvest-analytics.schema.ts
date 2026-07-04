import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * HarvestAnalyticsDocument
 *
 * Aggregated regional harvest analytics snapshot.
 * Keyed by region level + region name + period (weekly or monthly).
 * Used by GET /harvest-intelligence/analytics and /harvest-intelligence/regional.
 *
 * Collection: harvest_analytics
 */
@Schema({ collection: 'harvest_analytics', timestamps: true })
export class HarvestAnalyticsDocument extends Document {
  /** Geographic granularity: village | taluk | district | state */
  @Prop({ required: true, index: true })
  regionLevel: string;

  /** Name of the region */
  @Prop({ required: true, index: true })
  regionName: string;

  /** Period type: weekly | monthly */
  @Prop({ required: true })
  periodType: string;

  /** Start of the reporting period */
  @Prop({ type: Date, required: true, index: true })
  periodStart: Date;

  /** End of the reporting period */
  @Prop({ type: Date, required: true })
  periodEnd: Date;

  // Aggregated metrics
  @Prop({ default: 0 }) totalFarmers: number;
  @Prop({ default: 0 }) totalCrops: number;
  @Prop({ default: 0 }) totalExpectedYieldKg: number;
  @Prop({ default: 0 }) harvestedCount: number;
  @Prop({ default: 0 }) readyCount: number;
  @Prop({ default: 0 }) almostReadyCount: number;
  @Prop({ default: 0 }) delayedCount: number;
  @Prop({ default: 0 }) avgReadinessScore: number;
  @Prop({ default: 0 }) avgHarvestScore: number;
  @Prop({ default: 0 }) avgConfidenceScore: number;
  @Prop({ default: 0 }) avgDelayDays: number;

  /** Most prevalent risk levels in this region */
  @Prop({ type: [String], default: [] }) dominantRisks: string[];

  /** Crop-wise breakdown */
  @Prop({ type: Object, default: {} }) cropBreakdown: Record<string, {
    count: number;
    totalYieldKg: number;
    avgReadiness: number;
  }>;

  /** Harvest timeline — which weeks crops are expected */
  @Prop({ type: Object, default: {} }) harvestTimeline: Record<string, number>;

  @Prop({ type: Date, default: Date.now }) generatedAt: Date;
}

export const HarvestAnalyticsSchema =
  SchemaFactory.createForClass(HarvestAnalyticsDocument);

HarvestAnalyticsSchema.index({ regionLevel: 1, regionName: 1, periodStart: -1 });
HarvestAnalyticsSchema.index({ generatedAt: -1 });
