import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HarvestMongoService } from '../../mongodb/harvest/harvest-mongo.service';

/**
 * RegionalHarvestService
 *
 * Aggregates harvest predictions at village, taluk, district, and state level.
 * Reuses PostGIS location data from farmer_land_parcels + farmer_profiles.
 * Does NOT duplicate geoboundary logic — uses farmer_profiles.district/state directly.
 *
 * Phase 13 (Supply Intelligence) will extend this with supply-demand correlation.
 */
@Injectable()
export class RegionalHarvestService {
  private readonly logger = new Logger(RegionalHarvestService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly harvestMongoService: HarvestMongoService,
  ) {}

  /**
   * Aggregate regional harvest summary for a given region level and name.
   */
  async getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string) {
    this.logger.debug(`Regional summary request | level=${regionLevel} name=${regionName}`);

    // Fetch all farmer crops in this region via PostgreSQL
    const farmerCropRows = await this.queryFarmerCropsByRegion(regionLevel, regionName);

    if (!farmerCropRows.length) {
      return {
        regionLevel,
        regionName,
        totalFarmers: 0,
        totalCrops: 0,
        summary: 'No active crops found in this region',
        crops: [],
      };
    }

    // Fetch harvest assessments for these farmer crop IDs
    const farmerCropIds = farmerCropRows.map((r: any) => String(r.farmer_crop_id));
    const assessments = await Promise.all(
      farmerCropIds.map(id => this.harvestMongoService.findByFarmerCropId(id))
    );

    const validAssessments = assessments.filter(Boolean);
    const totalFarmers = new Set(farmerCropRows.map((r: any) => r.farmer_profile_id)).size;
    const avgReadiness = validAssessments.length
      ? Math.round(validAssessments.reduce((s, a) => s + (a?.readinessScore ?? 0), 0) / validAssessments.length)
      : 0;
    const totalYield = validAssessments.reduce((s, a) => s + (a?.expectedYieldKg ?? 0), 0);

    const readyCrops = validAssessments.filter(a => a?.readinessStatus === 'ready').length;
    const delayedCrops = validAssessments.filter(a => (a?.delayDays ?? 0) > 0).length;

    // Crop-wise breakdown
    const cropBreakdown: Record<string, { count: number; totalYieldKg: number; avgReadiness: number }> = {};
    for (const row of farmerCropRows) {
      const cropName: string = row.crop_name ?? 'Unknown';
      const assessment = validAssessments.find(a => a?.farmerCropId === String(row.farmer_crop_id));
      if (!cropBreakdown[cropName]) cropBreakdown[cropName] = { count: 0, totalYieldKg: 0, avgReadiness: 0 };
      cropBreakdown[cropName].count++;
      if (assessment) {
        cropBreakdown[cropName].totalYieldKg += assessment.expectedYieldKg ?? 0;
        cropBreakdown[cropName].avgReadiness += assessment.readinessScore ?? 0;
      }
    }
    // Finalise averages
    for (const key of Object.keys(cropBreakdown)) {
      if (cropBreakdown[key].count > 0) {
        cropBreakdown[key].avgReadiness = Math.round(cropBreakdown[key].avgReadiness / cropBreakdown[key].count);
      }
    }

    return {
      regionLevel,
      regionName,
      totalFarmers,
      totalCrops: farmerCropRows.length,
      totalAssessed: validAssessments.length,
      avgReadinessScore: avgReadiness,
      totalExpectedYieldKg: Math.round(totalYield),
      readyCrops,
      delayedCrops,
      cropBreakdown,
      generatedAt: new Date(),
    };
  }

  /** Store the regional analytics snapshot to MongoDB */
  async saveRegionalAnalytics(
    regionLevel: string,
    regionName: string,
    periodType: 'weekly' | 'monthly',
    data: Record<string, any>,
  ): Promise<void> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    await this.harvestMongoService.upsertAnalytics(regionLevel, regionName, periodType, periodStart, {
      ...data,
      periodEnd,
    } as any);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async queryFarmerCropsByRegion(regionLevel: string, regionName: string): Promise<any[]> {
    let whereClause = '';
    const params: string[] = [regionName];

    switch (regionLevel) {
      case 'state':    whereClause = 'fp.state ILIKE $1'; break;
      case 'district': whereClause = 'fp.district ILIKE $1'; break;
      case 'taluk':    whereClause = 'fp.district ILIKE $1'; break; // taluk stored in district for now
      case 'village':  whereClause = 'fp.village ILIKE $1'; break;
      default:         whereClause = 'fp.district ILIKE $1';
    }

    return this.dataSource.query(
      `SELECT
         fc.id              AS farmer_crop_id,
         fc.crop_variety,
         c.crop_name,
         fp.id              AS farmer_profile_id,
         fp.district,
         fp.state,
         fp.village
       FROM farmer_crops     fc
       JOIN crops            c  ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles  fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active'
         AND ${whereClause}`,
      params,
    );
  }
}
