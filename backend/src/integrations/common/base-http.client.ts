import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { INTEGRATION_CONSTANTS } from './integration.constants';
import { RetryService } from './retry.service';
import {
  HttpRequestConfig,
  HttpResponse,
  RetryConfig,
} from './integration.types';

/**
 * BaseHttpClient
 *
 * The single, centralised HTTP client for all external API communication
 * in the AgriSense integration layer.
 *
 * Responsibilities
 * ─────────────────
 * ✔ GET / POST / PUT / DELETE / PATCH
 * ✔ Request-level timeout via AbortController
 * ✔ Structured logging (request start, response, errors)
 * ✔ Delegates retry logic to RetryService
 * ✔ Normalises errors into ServiceUnavailableException
 *
 * Business modules and provider clients MUST use this class.
 * Direct use of fetch() or Axios in business code is prohibited.
 */
@Injectable()
export class BaseHttpClient {
  private readonly logger = new Logger(BaseHttpClient.name);

  constructor(private readonly retryService: RetryService) {}

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async get<T>(
    url: string,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>,
    retryConfig?: RetryConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'GET', ...options }, retryConfig);
  }

  async post<T>(
    url: string,
    body: unknown,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>,
    retryConfig?: RetryConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'POST', body, ...options }, retryConfig);
  }

  async put<T>(
    url: string,
    body: unknown,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>,
    retryConfig?: RetryConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'PUT', body, ...options }, retryConfig);
  }

  async delete<T>(
    url: string,
    options?: Omit<HttpRequestConfig, 'url' | 'method' | 'body'>,
    retryConfig?: RetryConfig,
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'DELETE', ...options }, retryConfig);
  }

  // ---------------------------------------------------------------------------
  // Core request execution
  // ---------------------------------------------------------------------------

  private async request<T>(
    config: HttpRequestConfig,
    retryConfig?: RetryConfig,
  ): Promise<HttpResponse<T>> {
    const method = config.method ?? 'GET';
    const fullUrl = this.buildUrl(config.url, config.params);
    const timeoutMs = config.timeoutMs ?? INTEGRATION_CONSTANTS.DEFAULT_TIMEOUT_MS;
    const context = `${method} ${fullUrl}`;

    return this.retryService.execute<HttpResponse<T>>(
      () => this.executeRequest<T>(fullUrl, method, config, timeoutMs),
      context,
      retryConfig,
    );
  }

  private async executeRequest<T>(
    url: string,
    method: string,
    config: HttpRequestConfig,
    timeoutMs: number,
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url}`);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      };

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (config.body && method !== 'GET' && method !== 'DELETE') {
        fetchOptions.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, fetchOptions);
      const durationMs = Date.now() - startTime;

      this.logger.log(`← ${response.status} ${method} ${url} (${durationMs}ms)`);

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `HTTP ${response.status} from ${url}: ${errorBody}`,
        );
        throw new ServiceUnavailableException(
          `External service returned HTTP ${response.status}`,
        );
      }

      const data = (await response.json()) as T;
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return { data, status: response.status, headers: responseHeaders, durationMs };
    } catch (error: any) {
      const durationMs = Date.now() - startTime;

      if (error?.name === 'AbortError') {
        this.logger.error(`Timeout after ${durationMs}ms: ${method} ${url}`);
        throw new ServiceUnavailableException(
          `Request timed out after ${timeoutMs}ms`,
        );
      }

      if (error instanceof ServiceUnavailableException) {
        throw error; // already normalised — let RetryService handle it
      }

      this.logger.error(
        `Unexpected error on ${method} ${url}: ${error?.message}`,
      );
      throw new ServiceUnavailableException(
        `Failed to communicate with external service: ${error?.message}`,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private buildUrl(
    base: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    if (!params || Object.keys(params).length === 0) return base;
    const qs = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    return `${base}?${qs}`;
  }
}
