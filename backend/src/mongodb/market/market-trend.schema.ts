import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { IMarketTrend, TrendDirection, TrendPeriod } from '../../market/interfaces/market.interface';

export type MarketTrendDocument = MarketTrend & Document;

/**
 * market_trends — Aggregated price trend records computed over a period.
 */
@Schema({ timestamps: true, collection: 'market_trends' })
export class MarketTrend implements IMarketTrend {
  @Prop({ required: true, index: true })
  commodity: string;

  @Prop({ required: true, index: true })
  market: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true, type: String, enum: ['daily', 'weekly', 'monthly'] })
  period: TrendPeriod;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  avgPrice: number;

  @Prop({ required: true })
  minPrice: number;

  @Prop({ required: true })
  maxPrice: number;

  @Prop({ default: 0 })
  totalArrival: number;

  @Prop({ required: true, type: String, enum: ['rising', 'falling', 'stable'] })
  trend: TrendDirection;
}

export const MarketTrendSchema = SchemaFactory.createForClass(MarketTrend);

MarketTrendSchema.index({ commodity: 1, market: 1, period: 1, startDate: -1 });
