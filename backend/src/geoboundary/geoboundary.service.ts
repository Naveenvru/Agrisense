import { Injectable, Logger, Inject } from '@nestjs/common';
import { GeoBoundaryResult } from './interfaces/geoboundary.interface';
import { GeoBoundaryRepository } from './repository/geoboundary.repository';
import { GEOBOUNDARY_PROVIDER } from './providers/geoboundary-provider.interface';
import type { IGeoBoundaryProvider } from './providers/geoboundary-provider.interface';
import { HashMapService } from '../master-data/data-structures/hash-map.service';

@Injectable()
export class GeoBoundaryService {
  private readonly logger = new Logger(GeoBoundaryService.name);

  // Step 5: L1 In-Memory Coordinate Cache (LRU approximation with simple Map)
  private readonly coordinateCache = new Map<string, GeoBoundaryResult>();

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

  healthCheck(): { status: string; module: string } {
    this.logger.log('GeoBoundaryService health check called');
    return { status: 'initialising', module: 'geoboundary' };
  }
}
