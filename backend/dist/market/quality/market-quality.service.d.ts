import { IMarketRawRecord, MarketValidationResult } from '../interfaces/market.interface';
export declare class MarketQualityService {
    private readonly logger;
    private static readonly MAX_PRICE;
    private static readonly MAX_DATE_AGE_DAYS;
    validate(records: IMarketRawRecord[]): MarketValidationResult;
    private validateRecord;
    private dedupKey;
}
