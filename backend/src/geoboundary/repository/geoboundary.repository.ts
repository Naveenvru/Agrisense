import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeoBoundaryCache } from '../../mongodb/geoboundary/geoboundary-cache.schema';
import { GeoBoundaryResult } from '../interfaces/geoboundary.interface';

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
}
