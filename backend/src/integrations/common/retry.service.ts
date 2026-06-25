import { Injectable, Logger } from '@nestjs/common';
import { INTEGRATION_CONSTANTS } from './integration.constants';
import { RetryConfig } from './integration.types';

/**
 * RetryService
 *
 * A reusable utility service that wraps any async operation with configurable
 * exponential-backoff retry logic.  Every provider in the integration layer
 * must use this service instead of rolling its own retry mechanism.
 *
 * Strategy: exponential backoff with jitter
 *   attempt 1 → delay ~1 s
 *   attempt 2 → delay ~2 s
 *   attempt 3 → delay ~4 s  (up to maxRetries)
 */
@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  /**
   * Execute an async operation with automatic retry on failure.
   *
   * @param operation   The async function to execute.
   * @param context     Human-readable label used in log messages (e.g. "OpenWeather/current").
   * @param config      Optional retry configuration overrides.
   */
  async execute<T>(
    operation: () => Promise<T>,
    context: string,
    config?: RetryConfig,
  ): Promise<T> {
    const maxRetries =
      config?.maxRetries ?? INTEGRATION_CONSTANTS.DEFAULT_MAX_RETRIES;
    const baseDelayMs =
      config?.baseDelayMs ?? INTEGRATION_CONSTANTS.DEFAULT_RETRY_DELAY_MS;

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        const isLastAttempt = attempt === maxRetries;
        if (isLastAttempt) {
          this.logger.error(
            `[${context}] All ${maxRetries} attempts failed. Last error: ${error?.message}`,
          );
          throw error;
        }

        // Exponential backoff with ±20% jitter to avoid thundering herd
        const jitter = 0.8 + Math.random() * 0.4; // 0.8–1.2
        const delay = Math.round(baseDelayMs * Math.pow(2, attempt - 1) * jitter);

        this.logger.warn(
          `[${context}] Attempt ${attempt}/${maxRetries} failed: ${error?.message}. Retrying in ${delay}ms...`,
        );

        await this.sleep(delay);
      }
    }

    // TypeScript: this path is unreachable but required for strict mode
    throw lastError ?? new Error(`[${context}] Retry exhausted with no captured error.`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
