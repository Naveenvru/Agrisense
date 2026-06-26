import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMarketArrival } from '../../market/interfaces/market.interface';

export type MarketArrivalDocument = MarketArrival & Document;

/**
 * market_arrivals — Daily arrival quantities per commodity per market.
 */
@Schema({ timestamps: true, collection: 'market_arrivals' })
export class MarketArrival implements IMarketArrival {
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
  arrivalQty: number;

  @Prop({ default: 'Quintal' })
  unit: string;

  @Prop({ required: true })
  source: string;
}

export const MarketArrivalSchema = SchemaFactory.createForClass(MarketArrival);

MarketArrivalSchema.index({ commodity: 1, market: 1, date: -1 });
