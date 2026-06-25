import { Model } from 'mongoose';
import { MarketPrice, MarketPriceDocument } from './market-price.schema';
import { IMarketPrice } from '../interfaces/market-price.interface';
export declare class MarketPriceMongoService {
    private readonly marketPriceModel;
    private readonly logger;
    constructor(marketPriceModel: Model<MarketPriceDocument>);
    saveMarketPrices(priceData: IMarketPrice): Promise<MarketPrice>;
    getLatestPrices(crop: string, market: string): Promise<MarketPrice | null>;
    getHistoricalPrices(crop: string, market: string, startDate: Date, endDate: Date): Promise<MarketPrice[]>;
}
