import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IWeatherHistory } from '../interfaces/weather.interface';

export type WeatherHistoryDocument = WeatherHistory & Document;

@Schema({ timestamps: true, collection: 'weather_history' })
export class WeatherHistory implements IWeatherHistory {
  @Prop({ required: true, index: true })
  locationId: string;

  @Prop({ default: '', index: true })
  district: string;

  @Prop({ default: '' })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true, index: true })
  timestamp: Date;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  rainfall: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop({ required: true })
  pressure: number;

  @Prop({ required: true })
  weatherCondition: string;

  @Prop({ required: true })
  source: string;
}

export const WeatherHistorySchema = SchemaFactory.createForClass(WeatherHistory);
