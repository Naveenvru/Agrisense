import { CacheOptions } from './integration.types';
export declare class CacheService {
    private readonly logger;
    private readonly store;
    set<T>(key: string, value: T, options: CacheOptions): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    evictExpired(): number;
    size(): number;
    has(key: string): boolean;
}
