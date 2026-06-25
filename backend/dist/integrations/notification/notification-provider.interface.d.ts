import { IIntegrationProvider } from '../common/provider.interface';
export interface INotificationProvider extends IIntegrationProvider {
    send(recipient: string, title: string, body: string, metadata?: Record<string, unknown>): Promise<void>;
}
