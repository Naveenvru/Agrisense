import { IIntegrationProvider } from '../../common/provider.interface';
export interface IMarketProvider extends IIntegrationProvider {
    fetchPrices(crop: string, market: string, date: Date): Promise<unknown>;
}
