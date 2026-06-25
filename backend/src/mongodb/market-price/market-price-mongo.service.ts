import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketPrice, MarketPriceDocument } from './market-price.schema';
import { IMarketPrice } from '../interfaces/market-price.interface';

@Injectable()
export class MarketPriceMongoService {
  private readonly logger = new Logger(MarketPriceMongoService.name);

  constructor(
    @InjectModel(MarketPrice.name)
    private readonly marketPriceModel: Model<MarketPriceDocument>,
  ) {}

  async saveMarketPrices(priceData: IMarketPrice): Promise<MarketPrice> {
    const newPrice = new this.marketPriceModel(priceData);
    return newPrice.save();
  }

  async getLatestPrices(crop: string, market: string): Promise<MarketPrice | null> {
    return this.marketPriceModel
      .findOne({ crop, market })
      .sort({ date: -1 })
      .exec();
  }

  async getHistoricalPrices(crop: string, market: string, startDate: Date, endDate: Date): Promise<MarketPrice[]> {
    return this.marketPriceModel
      .find({
        crop,
        market,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: 1 })
      .exec();
  }
}
