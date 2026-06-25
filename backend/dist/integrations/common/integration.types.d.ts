export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface HttpRequestConfig {
    url: string;
    method?: HttpMethod;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    body?: unknown;
    timeoutMs?: number;
}
export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    headers: Record<string, string>;
    durationMs: number;
}
export interface RetryConfig {
    maxRetries?: number;
    baseDelayMs?: number;
    retryableStatusCodes?: number[];
}
export interface CacheEntry<T = unknown> {
    value: T;
    expiresAt: number;
}
export interface CacheOptions {
    ttlMs: number;
}
export interface ProviderHealthResult {
    provider: string;
    healthy: boolean;
    latencyMs?: number;
    message?: string;
    checkedAt: Date;
}
export interface IntegrationError {
    provider: string;
    statusCode?: number;
    message: string;
    retried: boolean;
    attempts: number;
}
