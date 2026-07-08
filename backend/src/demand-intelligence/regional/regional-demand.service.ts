import { Injectable, Inject, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GeoBoundaryService } from '../../geoboundary/geoboundary.service';
import { HarvestMongoService } from '../../mongodb/harvest/harvest-mongo.service';
import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import { SupplyMongoService } from '../../mongodb/supply/supply-mongo.service';
import { DemandMongoService } from '../../mongodb/demand/demand-mongo.service';
import type { DemandRegionalSummary, DemandAssessmentContext } from '../interfaces/demand-intelligence.types';
import type { DemandAggregator } from '../interfaces/demand-aggregator.interface';
import type { DemandEstimatorStrategy } from '../interfaces/demand-estimator.interface';
import { DEMAND_ESTIMATOR } from '../interfaces/demand-estimator.interface';
import { average, round, safeNumber } from '../../yield-intelligence/utils/yield-rule.utils';
import type { LifecycleStage } from '../../harvest-intelligence/interfaces/harvest-intelligence.types';

@Injectable()
export class RegionalDemandService implements DemandAggregator {
  private readonly logger = new Logger(RegionalDemandService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly demandMongoService: DemandMongoService,
    private readonly harvestMongoService: HarvestMongoService,
    private readonly yieldMongoService: YieldMongoService,
    private readonly supplyMongoService: SupplyMongoService,
    private readonly geoBoundaryService: GeoBoundaryService,
    @Inject(DEMAND_ESTIMATOR) private readonly demandEstimator: DemandEstimatorStrategy,
  ) {}

  async getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<DemandRegionalSummary> {
    this.logger.debug(`Regional demand summary request | level=${regionLevel} name=${regionName}`);

    const farmerCropRows = await this.queryActiveFarmerCrops();
    const filteredRows: any[] = [];

    for (const row of farmerCropRows) {
      const resolved = await this.resolveRegionHierarchy(row);
      if (this.matchesRegion(resolved, regionLevel, regionName)) {
        filteredRows.push({ ...row, ...resolved });
      }
    }

    if (!filteredRows.length) {
      return {
        regionLevel,
        regionName,
        totalFarmers: 0,
        totalCrops: 0,
        totalDemandKg: 0,
        currentDemandKg: 0,
        cropBreakdown: {},
        demandDensityKgPerAcre: 0,
        summary: 'No active crops found in this region',
        explanations: ['No farmer crops matched the requested regional filter'],
        generatedAt: new Date(),
      };
    }

    const predictions = await Promise.all(filteredRows.map((row) => this.resolvePrediction(row)));
    const validPredictions = predictions.filter(Boolean) as any[];

    const totalFarmers = new Set(filteredRows.map((row: any) => String(row.farmer_profile_id))).size;
    const totalDemandKg = round(validPredictions.reduce((sum, item) => sum + (item.expectedDemandKg ?? 0), 0), 0);
    const currentDemandKg = round(validPredictions.reduce((sum, item) => sum + (item.currentDemandKg ?? 0), 0), 0);
    const totalArea = filteredRows.reduce((sum: number, row: any) => sum + Number(row.area_acres ?? 0), 0);
    const demandDensityKgPerAcre = totalArea > 0 ? round(currentDemandKg / totalArea, 2) : 0;

    const cropBreakdown: DemandRegionalSummary['cropBreakdown'] = {};
    for (const row of filteredRows) {
      const cropName: string = row.crop_name ?? 'Unknown';
      const prediction = validPredictions.find((item) => item.farmerCropId === String(row.farmer_crop_id));

      if (!cropBreakdown[cropName]) {
        cropBreakdown[cropName] = { count: 0, totalDemandKg: 0, averageDemandKg: 0, averageConfidence: 0 };
      }

      cropBreakdown[cropName].count += 1;
      if (prediction) {
        cropBreakdown[cropName].totalDemandKg += prediction.currentDemandKg ?? 0;
        cropBreakdown[cropName].averageDemandKg += prediction.currentDemandKg ?? 0;
        cropBreakdown[cropName].averageConfidence += prediction.confidence ?? 0;
      }
    }

    Object.values(cropBreakdown).forEach((entry) => {
      if (entry.count > 0) {
        entry.averageDemandKg = round(entry.totalDemandKg / entry.count, 0);
        entry.averageConfidence = round(entry.averageConfidence / entry.count, 0);
      }
    });

    return {
      regionLevel,
      regionName,
      totalFarmers,
      totalCrops: filteredRows.length,
      totalDemandKg,
      currentDemandKg,
      cropBreakdown,
      demandDensityKgPerAcre,
      summary: `Regional demand summary for ${regionLevel} ${regionName} covers ${filteredRows.length} crops with ${currentDemandKg} kg current demand.`,
      explanations: [
        'Regional aggregation reused active farmer crop records and current demand predictions',
        `Total area considered: ${round(totalArea, 2)} acres`,
      ],
      generatedAt: new Date(),
    };
  }

  private async resolvePrediction(row: any) {
    const existing = await this.demandMongoService.findByFarmerCropId(String(row.farmer_crop_id));
    if (existing) return existing;

    const harvestAssessment = await this.harvestMongoService.findByFarmerCropId(String(row.farmer_crop_id));
    const yieldAssessment = await this.yieldMongoService.findByFarmerCropId(String(row.farmer_crop_id));
    const supplyAssessment = await this.supplyMongoService.findByFarmerCropId(String(row.farmer_crop_id));
    const region = await this.resolveRegionHierarchy(row);
    const lifecycle = this.buildLifecycleContext(row);
    const now = new Date();

    const context: DemandAssessmentContext = {
      farmerCropId: String(row.farmer_crop_id),
      farmerProfileId: String(row.farmer_profile_id),
      cropName: row.crop_name ?? 'Unknown',
      cropVariety: row.crop_variety ?? null,
      cropCategory: row.crop_category ?? null,
      cropSeason: row.season ?? null,
      regionLevel: region.regionLevel,
      regionName: region.regionName,
      villageName: region.villageName,
      talukName: region.talukName,
      districtName: region.districtName,
      stateName: region.stateName,
      areaAcres: safeNumber(row.area_acres, 1),
      expectedHarvestDate: row.expected_harvest_date ? new Date(row.expected_harvest_date) : null,
      harvestReadinessScore: safeNumber(harvestAssessment?.readinessScore, 50),
      harvestRiskLevel: harvestAssessment?.riskLevel ?? 'low',
      harvestStage: harvestAssessment?.readinessStatus ?? lifecycle.lifecycleStage,
      yieldExpectedKg: safeNumber((yieldAssessment as any)?.expectedYieldKg ?? row.estimated_yield_kg ?? (harvestAssessment as any)?.expectedYieldKg, 0),
      yieldConfidence: safeNumber((yieldAssessment as any)?.confidence ?? (harvestAssessment as any)?.yieldConfidence, 60),
      yieldRiskLevel: String((yieldAssessment as any)?.risk?.level ?? (yieldAssessment as any)?.riskLevel ?? 'low'),
      availableSupplyKg: safeNumber((supplyAssessment as any)?.availableSupplyKg, 0),
      expectedSupplyKg: safeNumber((supplyAssessment as any)?.expectedSupplyKg, 0),
      supplyRiskLevel: String((supplyAssessment as any)?.riskLevel ?? 'low'),
      supplyDensityKgPerAcre: safeNumber((supplyAssessment as any)?.supplyDensityKgPerAcre, 0),
      marketModalPrice: 0,
      marketMinPrice: 0,
      marketMaxPrice: 0,
      marketTrendDirection: 'stable',
      recentArrivalQty: 0,
      weather: {
        hasRainForecast: false,
        hasHeatStress: false,
        hasColdStress: false,
        hasFloodRisk: false,
        forecastRainProbability: 20,
        currentTemperature: 27,
        currentRainfall: 0,
        weatherCondition: 'stable weather',
      },
      lifecycle: lifecycle as any,
      isMspCrop: false,
      isExportCrop: false,
      currentMonth: now.getMonth() + 1,
      historicalDemandKg: [],
      regionalEventNotes: [],
    };

    return this.demandEstimator.estimate(context);
  }

  private async queryActiveFarmerCrops(): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
         fc.id AS farmer_crop_id,
         fc.crop_variety,
         fc.sowing_date,
         fc.expected_harvest_date,
         fc.estimated_yield_kg,
         fc.actual_yield_kg,
         c.crop_name,
         c.crop_category,
         c.season,
         c.duration_days,
         flp.area_acres,
         flp.soil_type,
         flp.irrigation_type,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude,
         fp.id AS farmer_profile_id,
         fp.district,
         fp.state,
         fp.village
       FROM farmer_crops fc
       JOIN crops c ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active' AND fc.sowing_date IS NOT NULL`,
    );
  }

  private buildLifecycleContext(row: any) {
    const sowingDate = new Date(row.sowing_date);
    const durationDays = row.duration_days ?? 90;
    const expectedHarvestDate = row.expected_harvest_date ? new Date(row.expected_harvest_date) : null;
    const daysElapsed = Math.max(0, Math.floor((Date.now() - sowingDate.getTime()) / (24 * 60 * 60 * 1000)));
    const daysRemaining = expectedHarvestDate
      ? Math.max(0, Math.ceil((expectedHarvestDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
      : Math.max(0, durationDays - daysElapsed);
    const growthPercentage = durationDays > 0 ? Math.min(100, Math.round((daysElapsed / durationDays) * 100)) : 0;
    const lifecycleStage: LifecycleStage = growthPercentage >= 90 ? 'ready' : growthPercentage >= 60 ? 'ripening' : growthPercentage >= 35 ? 'reproductive' : growthPercentage > 0 ? 'vegetative' : 'pre-sowing';
    return { sowingDate, durationDays, expectedHarvestDate, daysElapsed, daysRemaining, growthPercentage, lifecycleStage };
  }

  private async resolveRegionHierarchy(row: any) {
    const region: { regionLevel: 'village' | 'taluk' | 'district' | 'state'; regionName: string; villageName?: string | null; talukName?: string | null; districtName?: string | null; stateName?: string | null } = {
      regionLevel: 'district',
      regionName: row.district ?? row.state ?? 'unknown',
      villageName: row.village ?? null,
      talukName: null,
      districtName: row.district ?? null,
      stateName: row.state ?? null,
    };

    if (row.latitude !== null && row.longitude !== null) {
      try {
        const resolved = await this.geoBoundaryService.resolveLocation(Number(row.latitude), Number(row.longitude));
        region.villageName = resolved.villageName ?? region.villageName;
        region.talukName = resolved.talukName ?? region.talukName;
        region.districtName = resolved.districtName ?? region.districtName;
        region.stateName = resolved.stateName ?? region.stateName;
        if (resolved.villageName) { region.regionLevel = 'village'; region.regionName = resolved.villageName; }
        else if (resolved.talukName) { region.regionLevel = 'taluk'; region.regionName = resolved.talukName; }
        else if (resolved.districtName) { region.regionLevel = 'district'; region.regionName = resolved.districtName; }
        else if (resolved.stateName) { region.regionLevel = 'state'; region.regionName = resolved.stateName; }
      } catch {
        // fall back to profile geography
      }
    }
    return region;
  }

  private matchesRegion(
    region: { regionLevel: string; regionName: string; villageName?: string | null; talukName?: string | null; districtName?: string | null; stateName?: string | null },
    level: string,
    name: string,
  ): boolean {
    const target = name.toLowerCase();
    const candidates = [
      { level: 'village', value: region.villageName },
      { level: 'taluk', value: region.talukName },
      { level: 'district', value: region.districtName },
      { level: 'state', value: region.stateName },
    ];
    const match = candidates.find((c) => c.level === level && String(c.value ?? '').toLowerCase() === target);
    if (match) return true;
    return String(region.regionName ?? '').toLowerCase() === target && region.regionLevel === level;
  }
}
