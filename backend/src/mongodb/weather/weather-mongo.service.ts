import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherHistory, WeatherHistoryDocument } from './weather-history.schema';
import { WeatherForecast, WeatherForecastDocument } from './weather-forecast.schema';
import { IWeatherHistory, IWeatherForecast } from '../interfaces/weather.interface';

@Injectable()
export class WeatherMongoService {
  private readonly logger = new Logger(WeatherMongoService.name);

  constructor(
    @InjectModel(WeatherHistory.name)
    private readonly weatherHistoryModel: Model<WeatherHistoryDocument>,
    @InjectModel(WeatherForecast.name)
    private readonly weatherForecastModel: Model<WeatherForecastDocument>,
  ) {}

  async saveWeather(weatherData: IWeatherHistory): Promise<WeatherHistory> {
    const newWeather = new this.weatherHistoryModel(weatherData);
    return newWeather.save();
  }

  async getLatestWeather(locationId: string): Promise<WeatherHistory | null> {
    return this.weatherHistoryModel
      .findOne({ locationId })
      .sort({ timestamp: -1 })
      .exec();
  }

  async getWeatherHistory(locationId: string, startDate: Date, endDate: Date): Promise<WeatherHistory[]> {
    return this.weatherHistoryModel
      .find({
        locationId,
        timestamp: { $gte: startDate, $lte: endDate },
      })
      .sort({ timestamp: 1 })
      .exec();
  }

  async deleteOldWeather(olderThanDate: Date): Promise<any> {
    return this.weatherHistoryModel.deleteMany({
      timestamp: { $lt: olderThanDate },
    }).exec();
  }

  async saveForecast(forecastData: IWeatherForecast): Promise<WeatherForecast> {
      const newForecast = new this.weatherForecastModel(forecastData);
      return newForecast.save();
  }

  async getForecast(locationId: string, startDate: Date): Promise<WeatherForecast[]> {
      return this.weatherForecastModel.find({
          locationId,
          forecastDate: { $gte: startDate }
      })
      .sort({ forecastDate: 1 })
      .exec();
  }
}
