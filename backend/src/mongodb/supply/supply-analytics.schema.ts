import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'supply_analytics', timestamps: true })
export class SupplyAnalyticsDocument extends Document {
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
  cropWiseSupply: Record<string, number>;

  @Prop({ type: Object, default: {} })
  regionWiseSupply: Record<string, number>;

  @Prop({ type: Object, default: {} })
  weeklySupply: Record<string, number>;

  @Prop({ type: Object, default: {} })
  monthlySupply: Record<string, number>;

  @Prop({ type: Object, default: {} })
  seasonalSupply: Record<string, number>;

  @Prop({ default: 0 })
  averageSupplyKg: number;

  @Prop({ type: Array, default: [] })
  supplyTrend: Array<{ period: string; supplyKg: number }>;

  @Prop({ type: Array, default: [] })
  topProducingRegions: Array<{ regionLevel: string; regionName: string; supplyKg: number; confidence: number }>;

  @Prop({ type: Array, default: [] })
  cropDistribution: Array<{ cropName: string; supplyKg: number; sharePercent: number }>;

  @Prop({ type: Date, default: Date.now })
  generatedAt: Date;
}

export const SupplyAnalyticsSchema = SchemaFactory.createForClass(SupplyAnalyticsDocument);
SupplyAnalyticsSchema.index({ scope: 1, periodStart: -1 });
SupplyAnalyticsSchema.index({ generatedAt: -1 });