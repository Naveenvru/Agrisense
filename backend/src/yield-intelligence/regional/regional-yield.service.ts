import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GeoBoundaryService } from '../../geoboundary/geoboundary.service';
import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import type { YieldRegionalSummary } from '../interfaces/yield-intelligence.types';
import { average, round } from '../utils/yield-rule.utils';

@Injectable()
export class RegionalYieldService {
  private readonly logger = new Logger(RegionalYieldService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly yieldMongoService: YieldMongoService,
    private readonly geoBoundaryService: GeoBoundaryService,
  ) {}

  async getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<YieldRegionalSummary> {
    this.logger.debug(`Regional yield summary request | level=${regionLevel} name=${regionName}`);

    const farmerCropRows = await this.queryFarmerCropsByRegion(regionLevel, regionName);
    if (!farmerCropRows.length) {
      return {
        regionLevel,
        regionName,
        totalFarmers: 0,
        totalCrops: 0,
        totalExpectedYieldKg: 0,
        averageYieldKg: 0,
        cropBreakdown: {},
        regionalYieldDensityKgPerAcre: 0,
        summary: 'No active crops found in this region',
        explanations: ['No farmer crops matched the requested regional filter'],
        generatedAt: new Date(),
      };
    }

    const farmerCropIds = farmerCropRows.map((row: any) => String(row.farmer_crop_id));
    const predictions = await Promise.all(farmerCropIds.map((id) => this.yieldMongoService.findByFarmerCropId(id)));
    const validPredictions = predictions.filter(Boolean) as any[];

    const totalFarmers = new Set(farmerCropRows.map((row: any) => String(row.farmer_profile_id))).size;
    const totalExpectedYieldKg = round(validPredictions.reduce((sum, item) => sum + (item.expectedYieldKg ?? 0), 0), 0);
    const averageYieldKg = validPredictions.length ? round(totalExpectedYieldKg / validPredictions.length, 0) : 0;
    const totalArea = farmerCropRows.reduce((sum: number, row: any) => sum + Number(row.area_acres ?? 0), 0);
    const regionalYieldDensityKgPerAcre = totalArea > 0 ? round(totalExpectedYieldKg / totalArea, 2) : 0;

    const cropBreakdown: YieldRegionalSummary['cropBreakdown'] = {};
    for (const row of farmerCropRows) {
      const cropName = row.crop_name ?? 'Unknown';
      const prediction = validPredictions.find((item) => item.farmerCropId === String(row.farmer_crop_id));

      if (!cropBreakdown[cropName]) {
        cropBreakdown[cropName] = {
          count: 0,
          totalExpectedYieldKg: 0,
          averageYieldKg: 0,
          averageConfidence: 0,
        };
      }

      cropBreakdown[cropName].count += 1;
      if (prediction) {
        cropBreakdown[cropName].totalExpectedYieldKg += prediction.expectedYieldKg ?? 0;
        cropBreakdown[cropName].averageYieldKg += prediction.expectedYieldKg ?? 0;
        cropBreakdown[cropName].averageConfidence += prediction.confidence ?? 0;
      }
    }

    Object.values(cropBreakdown).forEach((entry) => {
      if (entry.count > 0) {
        entry.averageYieldKg = round(entry.totalExpectedYieldKg / entry.count, 0);
        entry.averageConfidence = round(entry.averageConfidence / entry.count, 0);
      }
    });

    const summary = `Regional yield summary for ${regionLevel} ${regionName} covers ${farmerCropRows.length} crops and ${totalExpectedYieldKg} kg expected production.`;

    return {
      regionLevel,
      regionName,
      totalFarmers,
      totalCrops: farmerCropRows.length,
      totalExpectedYieldKg,
      averageYieldKg,
      cropBreakdown,
      regionalYieldDensityKgPerAcre,
      summary,
      explanations: [
        `Regional aggregation reused active farmer crop records and current yield predictions`,
        `Total area considered: ${round(totalArea, 2)} acres`,
      ],
      generatedAt: new Date(),
    };
  }

  private async queryFarmerCropsByRegion(regionLevel: string, regionName: string): Promise<any[]> {
    let whereClause = '';
    const params: string[] = [regionName];

    switch (regionLevel) {
      case 'state':
        whereClause = 'fp.state ILIKE $1';
        break;
      case 'district':
        whereClause = 'fp.district ILIKE $1';
        break;
      case 'taluk':
        whereClause = 'fp.district ILIKE $1';
        break;
      case 'village':
        whereClause = 'fp.village ILIKE $1';
        break;
      default:
        whereClause = 'fp.district ILIKE $1';
    }

    return this.dataSource.query(
      `SELECT
         fc.id AS farmer_crop_id,
         fc.crop_variety,
         c.crop_name,
         fc.sowing_date,
         flp.area_acres,
         flp.soil_type,
         flp.irrigation_type,
         fp.id AS farmer_profile_id,
         fp.district,
         fp.state,
         fp.village,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude
       FROM farmer_crops fc
       JOIN crops c ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active'
         AND ${whereClause}`,
      params,
    );
  }
}
