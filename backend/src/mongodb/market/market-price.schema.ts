import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMarketPrice } from '../../market/interfaces/market.interface';

export type MarketPriceV2Document = MarketPriceV2 & Document;

/**
 * market_prices — Normalized, quality-validated market price records.
 * Lives alongside the legacy market_prices collection from Phase 6.
 * Phase 9 uses this schema exclusively for new writes.
 */
@Schema({ timestamps: true, collection: 'market_prices_v2' })
export class MarketPriceV2 implements IMarketPrice {
  @Prop({ required: true, index: true })
  commodity: string;

  @Prop({ required: true, index: true })
  market: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: true })
  minPrice: number;

  @Prop({ required: true })
  maxPrice: number;

  @Prop({ required: true })
  modalPrice: number;

  @Prop({ default: 'Quintal' })
  unit: string;

  @Prop({ required: true })
  source: string;

  @Prop()
  variety?: string;

  @Prop()
  grade?: string;

  @Prop({ required: true })
  normalizedAt: Date;

  /** 0–100 quality score assigned by MarketQualityService */
  @Prop({ default: 100 })
  qualityScore: number;
}

export const MarketPriceV2Schema = SchemaFactory.createForClass(MarketPriceV2);

MarketPriceV2Schema.index({ commodity: 1, market: 1, date: -1 });
MarketPriceV2Schema.index({ state: 1, date: -1 });
MarketPriceV2Schema.index(
  { source: 1, state: 1, market: 1, commodity: 1, variety: 1, grade: 1, date: 1 },
  { unique: true, partialFilterExpression: { source: 'mandi_api' } },
);
