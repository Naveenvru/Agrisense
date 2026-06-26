import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMarketRawRecord } from '../../market/interfaces/market.interface';

export type MarketRawDocument = MarketRaw & Document;

/**
 * market_raw — Raw market records as received from any data source.
 * Never modified after initial write.
 */
@Schema({ timestamps: true, collection: 'market_raw' })
export class MarketRaw implements IMarketRawRecord {
  @Prop({ required: true, index: true })
  commodity: string;

  @Prop({ default: '' })
  variety: string;

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

  @Prop({ required: true })
  arrivalQty: number;

  @Prop({ default: 'Quintal' })
  unit: string;

  @Prop({ required: true, index: true })
  source: string;

  /** Original JSON payload for traceability */
  @Prop({ default: '' })
  rawPayload: string;

  @Prop({ required: true })
  collectedAt: Date;

  /** Groups all records from the same collection run */
  @Prop({ required: true, index: true })
  batchId: string;
}

export const MarketRawSchema = SchemaFactory.createForClass(MarketRaw);

// Compound index for deduplication queries
MarketRawSchema.index({ commodity: 1, market: 1, date: 1 });
