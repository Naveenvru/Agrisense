import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'demand_analytics', timestamps: true })
export class DemandAnalyticsDocument extends Document {
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
  cropWiseDemand: Record<string, number>;

  @Prop({ type: Object, default: {} })
  regionWiseDemand: Record<string, number>;

  @Prop({ type: Object, default: {} })
  weeklyDemand: Record<string, number>;

  @Prop({ type: Object, default: {} })
  monthlyDemand: Record<string, number>;

  @Prop({ type: Object, default: {} })
  seasonalDemand: Record<string, number>;

  @Prop({ default: 0 })
  averageDemandKg: number;

  @Prop({ type: Array, default: [] })
  demandTrend: Array<{ period: string; demandKg: number }>;

  @Prop({ type: Array, default: [] })
  topDemandRegions: Array<{ regionLevel: string; regionName: string; demandKg: number; confidence: number }>;

  @Prop({ type: Array, default: [] })
  cropDistribution: Array<{ cropName: string; demandKg: number; sharePercent: number }>;

  @Prop({ type: Date, default: Date.now })
  generatedAt: Date;
}

export const DemandAnalyticsSchema = SchemaFactory.createForClass(DemandAnalyticsDocument);
DemandAnalyticsSchema.index({ scope: 1, periodStart: -1 });
DemandAnalyticsSchema.index({ generatedAt: -1 });
