import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { GeoBoundaryResult, GeoJsonFeature } from './interfaces/geoboundary.interface';
import { GeoBoundaryRepository } from './repository/geoboundary.repository';
import { GEOBOUNDARY_PROVIDER } from './providers/geoboundary-provider.interface';
import type { IGeoBoundaryProvider } from './providers/geoboundary-provider.interface';
import { HashMapService } from '../master-data/data-structures/hash-map.service';

@Injectable()
export class GeoBoundaryService {
  private readonly logger = new Logger(GeoBoundaryService.name);

  // Step 5: L1 In-Memory Coordinate Cache (LRU approximation with simple Map)
  private readonly coordinateCache = new Map<string, GeoBoundaryResult>();

  // L1 In-Memory Polygon Cache (keyed by `${adminLevel}:${name.toLowerCase()}`)
  private readonly polygonCache = new Map<string, GeoJsonFeature>();

  constructor(
    private readonly repository: GeoBoundaryRepository,
    @Inject(GEOBOUNDARY_PROVIDER) private readonly provider: IGeoBoundaryProvider,
    private readonly hashMapService: HashMapService,
  ) {}

  async resolveLocation(latitude: number, longitude: number): Promise<GeoBoundaryResult> {
    this.logger.log(`Resolving location for lat=${latitude}, lon=${longitude}`);
    const cacheKey = `${latitude},${longitude}`;

    // 1. Check L1 In-Memory Cache (O(1))
    if (this.coordinateCache.has(cacheKey)) {
      this.logger.debug(`L1 Cache hit for ${cacheKey}`);
      return this.coordinateCache.get(cacheKey)!;
    }

    // 2. Check L2 GeoBoundary MongoDB Cache
    const dbCachedResult = await this.repository.findByCoordinates(latitude, longitude);
    if (dbCachedResult) {
      this.logger.debug(`L2 DB Cache hit for ${cacheKey}`);
      this.coordinateCache.set(cacheKey, dbCachedResult);
      return dbCachedResult;
    }

    // 3. Cache Miss: Call Provider (L3)
    this.logger.debug(`Cache miss for ${cacheKey}. Calling Provider...`);
    const providerResult = await this.provider.reverseGeocode(latitude, longitude);

    // 4. Resolve IDs using Master Data HashMapService (O(1))
    const resolvedResult: GeoBoundaryResult = {
      latitude,
      longitude,
      ...providerResult,
      resolvedAt: new Date(),
    };

    if (providerResult.stateName) {
      resolvedResult.stateId = this.hashMapService.getStateId(providerResult.stateName);
    }
    
    if (providerResult.districtName) {
      resolvedResult.districtId = this.hashMapService.getDistrictId(providerResult.districtName);
    }

    // 5. Save to L2 DB Cache
    await this.repository.save(resolvedResult);

    // 6. Save to L1 Memory Cache
    this.coordinateCache.set(cacheKey, resolvedResult);

    return resolvedResult;
  }

  /**
   * Resolves the GeoJSON boundary polygon for a named administrative unit.
   *
   * Cache Strategy (two-level):
   *   L1 → In-memory Map (process-scoped, instant)
   *   L2 → MongoDB GeoBoundaryCache (persistent, shared)
   *   L3 → External provider (network call, only on full cache miss)
   *
   * @param adminLevel - The administrative level ('village' | 'taluk' | 'district' | 'state' | 'country')
   * @param name       - The name of the administrative unit
   * @returns A GeoJSON Feature containing the boundary polygon geometry.
   * @throws NotFoundException if the provider returns no polygon.
   */
  async resolveBoundaryPolygon(
    adminLevel: 'village' | 'taluk' | 'district' | 'state' | 'country',
    name: string,
  ): Promise<GeoJsonFeature> {
    const cacheKey = `${adminLevel}:${name.toLowerCase()}`;
    this.logger.log(`Resolving boundary polygon for ${cacheKey}`);

    // 1. L1 In-Memory Polygon Cache
    if (this.polygonCache.has(cacheKey)) {
      this.logger.debug(`L1 Polygon Cache hit for ${cacheKey}`);
      return this.polygonCache.get(cacheKey)!;
    }

    // 2. L2 MongoDB Polygon Cache
    const cachedPolygon = await this.repository.findPolygonByAdminUnit(adminLevel, name);
    if (cachedPolygon) {
      this.logger.debug(`L2 MongoDB Polygon Cache hit for ${cacheKey}`);
      this.polygonCache.set(cacheKey, cachedPolygon);
      return cachedPolygon;
    }

    // 3. Cache Miss: Call provider
    this.logger.debug(`Polygon cache miss for ${cacheKey}. Calling provider...`);
    const polygon = await this.provider.fetchBoundaryPolygon(adminLevel, name);

    if (!polygon) {
      throw new NotFoundException(
        `Boundary polygon not found for adminLevel='${adminLevel}', name='${name}'`,
      );
    }

    // 4. Save to L2 MongoDB Cache
    await this.repository.savePolygon(adminLevel, name, polygon);

    // 5. Save to L1 In-Memory Cache
    this.polygonCache.set(cacheKey, polygon);

    return polygon;
  }

  healthCheck(): { status: string; module: string } {
    this.logger.log('GeoBoundaryService health check called');
    return { status: 'initialising', module: 'geoboundary' };
  }
}

