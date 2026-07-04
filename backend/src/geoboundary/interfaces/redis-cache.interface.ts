/**
 * IRedisBoundaryCache
 *
 * Future-ready interface for a Redis-backed distributed spatial boundary cache.
 * Designed to be injected as an optional enhancement on top of the existing
 * two-level cache (L1 in-memory Map + L2 MongoDB) in GeoBoundaryService.
 *
 * When implemented, this becomes L1.5 -- sitting between the process-local Map
 * and MongoDB, providing fast distributed access across multiple backend instances.
 *
 * === Integration Pattern ===
 *
 * To activate in GeoBoundaryService:
 *   1. Implement RedisBoundaryCacheService implementing this interface.
 *   2. Provide it in GeoBoundaryModule with the REDIS_BOUNDARY_CACHE token.
 *   3. Optionally inject it with @Inject(REDIS_BOUNDARY_CACHE) and call
 *      get/set before falling through to MongoDB.
 *
 * === Cache Key Conventions ===
 *
 *   Coordinate lookups:  `geo:coord:{lat}:{lon}`
 *   Polygon lookups:     `geo:polygon:{adminLevel}:{name_lowercase}`
 *
 * === Required Redis Modules ===
 *
 *   Standard cache ops:   Redis Strings (GET/SETEX)
 *   Geospatial near ops:  Redis GEOADD / GEODIST / GEOSEARCH (Redis >= 6.2)
 *
 * @see https://redis.io/docs/data-types/geospatial/
 */

import type { GeoBoundaryResult, GeoJsonFeature } from './geoboundary.interface';

export const REDIS_BOUNDARY_CACHE = 'IRedisBoundaryCache';

export interface IRedisBoundaryCache {
  // ---------------------------------------------------------------------------
  // Coordinate-Based Boundary Cache
  // ---------------------------------------------------------------------------

  /**
   * Fetches a cached reverse geocode result for a coordinate pair.
   */
  getByCoordinates(latitude: number, longitude: number): Promise<GeoBoundaryResult | null>;

  /**
   * Caches a reverse geocode result for a coordinate pair.
   * @param ttlSec - Time-to-live in seconds (recommended: 86400 for 24h)
   */
  setByCoordinates(result: GeoBoundaryResult, ttlSec?: number): Promise<void>;

  // ---------------------------------------------------------------------------
  // Polygon Boundary Cache
  // ---------------------------------------------------------------------------

  /**
   * Fetches a cached GeoJSON boundary polygon for an administrative unit.
   */
  getBoundaryPolygon(adminLevel: string, name: string): Promise<GeoJsonFeature | null>;

  /**
   * Caches a GeoJSON boundary polygon for an administrative unit.
   * @param ttlSec - Time-to-live in seconds (recommended: 604800 for 7 days)
   */
  setBoundaryPolygon(
    adminLevel: string,
    name: string,
    polygon: GeoJsonFeature,
    ttlSec?: number,
  ): Promise<void>;

  // ---------------------------------------------------------------------------
  // Geospatial Index Operations (Redis GEO)
  // ---------------------------------------------------------------------------

  /**
   * Adds a coordinate to the Redis geo index under a named key set.
   * Enables fast nearby / within-radius queries without PostGIS.
   *
   * @example await redisCache.geoAdd('geo:parcels', 'parcel:42', 12.9716, 77.5946);
   */
  geoAdd(
    indexKey: string,
    memberId: string,
    latitude: number,
    longitude: number,
  ): Promise<void>;

  /**
   * Finds all member IDs within a given radius of a coordinate.
   * Equivalent to PostGIS ST_DWithin but served from Redis GEOSEARCH.
   * @param radiusMeters - Search radius in meters
   */
  geoSearch(
    indexKey: string,
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ): Promise<string[]>;

  /**
   * Computes the distance in meters between two members in a geo index.
   * Returns null if either member is not found.
   */
  geoDistance(
    indexKey: string,
    memberId1: string,
    memberId2: string,
  ): Promise<number | null>;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Deletes a specific key from the Redis cache.
   * Used to invalidate stale entries (e.g. when a parcel location is updated).
   */
  del(key: string): Promise<void>;

  /**
   * Flushes all geoboundary-related cache keys (prefixed `geo:*`).
   * Should only be called during admin-triggered cache refreshes.
   */
  flushGeoKeys(): Promise<void>;
}
