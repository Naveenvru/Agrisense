import { RetryConfig } from './integration.types';
export declare class RetryService {
    private readonly logger;
    execute<T>(operation: () => Promise<T>, context: string, config?: RetryConfig): Promise<T>;
    private sleep;
}
