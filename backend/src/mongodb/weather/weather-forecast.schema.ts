import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IWeatherForecast } from '../interfaces/weather.interface';

export type WeatherForecastDocument = WeatherForecast & Document;

@Schema({ timestamps: true, collection: 'weather_forecast' })
export class WeatherForecast implements IWeatherForecast {
  @Prop({ required: true, index: true })
  locationId: string;

  @Prop({ required: true, index: true })
  forecastDate: Date;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  rainProbability: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop({ required: true })
  weatherCondition: string;

  @Prop({ required: true })
  source: string;
}

export const WeatherForecastSchema = SchemaFactory.createForClass(WeatherForecast);
