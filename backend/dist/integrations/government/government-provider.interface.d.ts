import { IIntegrationProvider } from '../common/provider.interface';
export interface IGovernmentProvider extends IIntegrationProvider {
    fetchData(region: string, startDate: Date, endDate: Date): Promise<unknown>;
}
