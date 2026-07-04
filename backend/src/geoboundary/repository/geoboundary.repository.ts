import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeoBoundaryCache } from '../../mongodb/geoboundary/geoboundary-cache.schema';
import { GeoBoundaryResult, GeoJsonFeature } from '../interfaces/geoboundary.interface';

@Injectable()
export class GeoBoundaryRepository {
  private readonly logger = new Logger(GeoBoundaryRepository.name);

  constructor(
    @InjectModel(GeoBoundaryCache.name) private readonly cacheModel: Model<GeoBoundaryCache>,
  ) {}

  async findByCoordinates(latitude: number, longitude: number): Promise<GeoBoundaryResult | null> {
    const record = await this.cacheModel.findOne({ latitude, longitude }).exec();
    if (!record) return null;

    return {
      latitude: record.latitude,
      longitude: record.longitude,
      villageName: record.villageName,
      talukName: record.talukName,
      districtName: record.districtName,
      stateName: record.stateName,
      countryName: record.countryName,
      postalCode: record.postalCode,
      villageId: record.villageId,
      talukId: record.talukId,
      districtId: record.districtId,
      stateId: record.stateId,
      provider: record.provider,
      resolvedAt: record.resolvedAt,
    };
  }

  async save(result: GeoBoundaryResult): Promise<void> {
    await this.cacheModel.updateOne(
      { latitude: result.latitude, longitude: result.longitude },
      { $set: result },
      { upsert: true }
    ).exec();
  }

  // ---------------------------------------------------------------------------
  // Polygon Lookup Cache Methods
  // ---------------------------------------------------------------------------

  /**
   * Looks up a cached boundary polygon from MongoDB by administrative level and name.
   * Keyed on a virtual compound of adminLevel + normalised name.
   *
   * @param adminLevel - e.g. 'district', 'state'
   * @param name       - Name of the administrative unit (case-insensitive match)
   * @returns The cached GeoJSON Feature, or null if not found.
   */
  async findPolygonByAdminUnit(
    adminLevel: string,
    name: string,
  ): Promise<GeoJsonFeature | null> {
    // We store polygon-only cache documents with a sentinel lat/lng of 0/0
    // and a discriminator field `polygonCacheKey` to separate them from coordinate lookups.
    const record = await this.cacheModel
      .findOne({
        polygonCacheKey: `${adminLevel}:${name.toLowerCase()}`,
      })
      .exec();

    if (!record || !record.boundaryPolygon) return null;

    this.logger.debug(`Polygon cache hit for adminLevel=${adminLevel}, name=${name}`);
    return record.boundaryPolygon as unknown as GeoJsonFeature;
  }

  /**
   * Saves (upserts) a GeoJSON boundary polygon to the MongoDB cache,
   * keyed by adminLevel and name for future lookups.
   *
   * @param adminLevel - e.g. 'district', 'state'
   * @param name       - Name of the administrative unit
   * @param polygon    - The GeoJSON Feature to cache
   */
  async savePolygon(
    adminLevel: string,
    name: string,
    polygon: GeoJsonFeature,
  ): Promise<void> {
    const key = `${adminLevel}:${name.toLowerCase()}`;
    await this.cacheModel.updateOne(
      { polygonCacheKey: key },
      {
        $set: {
          polygonCacheKey: key,
          latitude: 0,       // Sentinel — not a real coordinate lookup
          longitude: 0,      // Sentinel — not a real coordinate lookup
          provider: polygon.properties?.source ?? 'unknown',
          boundaryPolygon: polygon,
          resolvedAt: new Date(),
        },
      },
      { upsert: true },
    ).exec();
    this.logger.debug(`Polygon cached for adminLevel=${adminLevel}, name=${name}`);
  }
}

