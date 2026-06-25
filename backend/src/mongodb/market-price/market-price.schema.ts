import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMarketPrice } from '../interfaces/market-price.interface';

export type MarketPriceDocument = MarketPrice & Document;

@Schema({ timestamps: true, collection: 'market_prices' })
export class MarketPrice implements IMarketPrice {
  @Prop({ required: true, index: true })
  crop: string;

  @Prop({ required: true, index: true })
  market: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: true })
  minimumPrice: number;

  @Prop({ required: true })
  maximumPrice: number;

  @Prop({ required: true })
  modalPrice: number;

  @Prop({ required: true })
  arrivalQuantity: number;

  @Prop({ required: true })
  source: string;
}

export const MarketPriceSchema = SchemaFactory.createForClass(MarketPrice);
