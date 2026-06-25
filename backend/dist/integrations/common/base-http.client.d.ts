import { RetryService } from './retry.service';
import { HttpRequestConfig, HttpResponse, RetryConfig } from './integration.types';
export declare class BaseHttpClient {
    private readonly retryService;
    private readonly logger;
    constructor(retryService: RetryService);
    get<T>(url: string, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>, retryConfig?: RetryConfig): Promise<HttpResponse<T>>;
    post<T>(url: string, body: unknown, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>, retryConfig?: RetryConfig): Promise<HttpResponse<T>>;
    put<T>(url: string, body: unknown, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>, retryConfig?: RetryConfig): Promise<HttpResponse<T>>;
    delete<T>(url: string, options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>, retryConfig?: RetryConfig): Promise<HttpResponse<T>>;
    private request;
    private executeRequest;
    private buildUrl;
}
