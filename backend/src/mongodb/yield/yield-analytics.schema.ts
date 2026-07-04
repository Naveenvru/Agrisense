import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'yield_analytics', timestamps: true })
export class YieldAnalyticsDocument extends Document {
  @Prop({ required: true, index: true })
  scope: string;

  @Prop({ index: true })
  regionLevel?: string;

  @Prop({ index: true })
  regionName?: string;

  @Prop({ index: true })
  cropName?: string;

  @Prop({ required: true })
  periodType: string;

  @Prop({ type: Date, required: true, index: true })
  periodStart: Date;

  @Prop({ type: Date, required: true })
  periodEnd: Date;

  @Prop({ type: Object, default: {} })
  cropWiseYield: Record<string, number>;

  @Prop({ type: Object, default: {} })
  regionWiseYield: Record<string, number>;

  @Prop({ type: Object, default: {} })
  monthlyYield: Record<string, number>;

  @Prop({ type: Object, default: {} })
  seasonWiseYield: Record<string, number>;

  @Prop({ default: 0 })
  averageYieldKg: number;

  @Prop({ type: Array, default: [] })
  yieldTrend: Array<{ period: string; yieldKg: number }>;

  @Prop({ type: Array, default: [] })
  topPerformingCrops: Array<{ cropName: string; averageYieldKg: number; confidence: number }>;

  @Prop({ type: Date, default: Date.now })
  generatedAt: Date;
}

export const YieldAnalyticsSchema = SchemaFactory.createForClass(YieldAnalyticsDocument);
YieldAnalyticsSchema.index({ scope: 1, periodStart: -1 });
YieldAnalyticsSchema.index({ generatedAt: -1 });
