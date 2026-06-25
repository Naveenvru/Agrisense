import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherHistory, WeatherHistorySchema } from './weather/weather-history.schema';
import { WeatherForecast, WeatherForecastSchema } from './weather/weather-forecast.schema';
import { MarketPrice, MarketPriceSchema } from './market-price/market-price.schema';
import { WeatherMongoService } from './weather/weather-mongo.service';
import { MarketPriceMongoService } from './market-price/market-price-mongo.service';
import { MongodbService } from './mongodb.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherHistory.name, schema: WeatherHistorySchema },
      { name: WeatherForecast.name, schema: WeatherForecastSchema },
      { name: MarketPrice.name, schema: MarketPriceSchema },
    ]),
  ],
  providers: [MongodbService, WeatherMongoService, MarketPriceMongoService],
  exports: [MongodbService, WeatherMongoService, MarketPriceMongoService, MongooseModule],
})
export class MongodbModule {}
