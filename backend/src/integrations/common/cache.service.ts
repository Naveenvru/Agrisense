import { Injectable, Logger } from '@nestjs/common';
import { CacheEntry, CacheOptions } from './integration.types';

/**
 * CacheService
 *
 * An in-process, in-memory cache abstraction for the integration layer.
 * Designed as a drop-in foundation that can later be swapped for Redis
 * or MongoDB-backed caching without changing provider or business code.
 *
 * Design goals
 * ─────────────
 * 1. SOLID: Open/closed — new backends added by extending, not modifying.
 * 2. TTL-based expiry handled by the service, not the caller.
 * 3. Generic — any serialisable value can be stored.
 *
 * Future backends (Phase N):
 *   - RedisCacheService extends CacheService
 *   - MongoCacheService extends CacheService
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly store = new Map<string, CacheEntry<unknown>>();

  /**
   * Store a value under the given key with a TTL.
   */
  set<T>(key: string, value: T, options: CacheOptions): void {
    const expiresAt = Date.now() + options.ttlMs;
    this.store.set(key, { value, expiresAt });
    this.logger.debug(`Cache SET | key="${key}" ttlMs=${options.ttlMs}`);
  }

  /**
   * Retrieve a cached value.
   * Returns `null` if the key does not exist or has expired.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      this.logger.debug(`Cache MISS | key="${key}" (not found)`);
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.logger.debug(`Cache MISS | key="${key}" (expired)`);
      return null;
    }

    this.logger.debug(`Cache HIT  | key="${key}"`);
    return entry.value as T;
  }

  /**
   * Explicitly remove a key from the cache.
   */
  delete(key: string): void {
    this.store.delete(key);
    this.logger.debug(`Cache DELETE | key="${key}"`);
  }

  /**
   * Remove all expired entries from the store.
   * Call periodically from a scheduled task to prevent memory growth.
   */
  evictExpired(): number {
    const now = Date.now();
    let evicted = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        evicted++;
      }
    }

    if (evicted > 0) {
      this.logger.log(`Cache eviction: removed ${evicted} expired entries.`);
    }

    return evicted;
  }

  /**
   * Number of entries currently in the store (including expired ones not yet evicted).
   */
  size(): number {
    return this.store.size;
  }

  /**
   * Check whether a non-expired entry exists for the given key.
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}
