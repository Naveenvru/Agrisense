import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WeatherService } from '../weather/weather.service';
import { GeoBoundaryService } from '../geoboundary/geoboundary.service';
import { HarvestMongoService } from '../mongodb/harvest/harvest-mongo.service';
import { YieldMongoService } from '../mongodb/yield/yield-mongo.service';
import { SupplyMongoService } from '../mongodb/supply/supply-mongo.service';
import { DemandMongoService } from '../mongodb/demand/demand-mongo.service';
import { MarketRepository } from '../market/repository/market.repository';
import type { DemandEstimatorStrategy } from './interfaces/demand-estimator.interface';
import { DEMAND_ESTIMATOR } from './interfaces/demand-estimator.interface';
import type { DemandAggregator } from './interfaces/demand-aggregator.interface';
import { DEMAND_AGGREGATOR } from './interfaces/demand-aggregator.interface';
import type { DemandAssessmentContext, DemandPredictionResult } from './interfaces/demand-intelligence.types';
import { DemandEventPublisher } from './events/demand-event.publisher';
import { DemandAnalyticsService } from './services/demand-analytics.service';
import { lower, safeNumber } from '../yield-intelligence/utils/yield-rule.utils';

/** Minimal interface used by the scheduler job to avoid circular imports */
export interface DemandIntelligenceServiceInterface {
  runBulkAssessment(userId?: string): Promise<{ assessed: number; failed: number }>;
}

/** Crops with MSP procurement floor */
const MSP_CROP_KEYWORDS = [
  'rice', 'paddy', 'wheat', 'jowar', 'bajra', 'maize', 'ragi', 'barley',
  'gram', 'tur', 'moong', 'urad', 'lentil', 'groundnut', 'sunflower',
  'soybean', 'rapeseed', 'mustard', 'cotton', 'jute', 'sugarcane',
];

/** Crops with significant export demand */
const EXPORT_CROP_KEYWORDS = [
  'rice', 'basmati', 'onion', 'mango', 'banana', 'grapes', 'pomegranate',
  'cotton', 'castor', 'cumin', 'turmeric', 'chilli', 'pepper', 'guar',
  'sesame', 'groundnut', 'soybean',
];

@Injectable()
export class DemandIntelligenceService implements DemandIntelligenceServiceInterface {
  private readonly logger = new Logger(DemandIntelligenceService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly weatherService: WeatherService,
    private readonly geoBoundaryService: GeoBoundaryService,
    private readonly harvestMongoService: HarvestMongoService,
    private readonly yieldMongoService: YieldMongoService,
    private readonly supplyMongoService: SupplyMongoService,
    private readonly demandMongoService: DemandMongoService,
    private readonly marketRepository: MarketRepository,
    private readonly eventPublisher: DemandEventPublisher,
    @Inject(DEMAND_AGGREGATOR) private readonly regionalService: DemandAggregator,
    private readonly analyticsService: DemandAnalyticsService,
    @Inject(DEMAND_ESTIMATOR) private readonly demandEstimator: DemandEstimatorStrategy,
  ) {}

  // ─── Core Assessment Pipeline ───────────────────────────────────────────────

  async assess(farmerCropId: string, userId: string): Promise<DemandPredictionResult> {
    this.logger.debug(`Starting demand assessment | farmerCropId=${farmerCropId}`);

    const context = await this.loadAssessmentContext(farmerCropId, userId);
    const previous = await this.demandMongoService.findByFarmerCropId(farmerCropId);

    const result = this.demandEstimator.estimate(context);
    result.version = (previous?.version ?? 0) + 1;
    result.assessedAt = new Date();

    await this.demandMongoService.upsertAssessment(farmerCropId, {
      ...result,
      regionLevel: result.regionLevel,
      regionName: result.regionName,
      villageName: result.villageName ?? undefined,
      talukName: result.talukName ?? undefined,
      districtName: result.districtName ?? undefined,
      stateName: result.stateName ?? undefined,
      riskLevel: result.risk.level,
      riskScore: result.risk.score,
      riskReasons: result.risk.reasons,
      mitigationRecommendations: result.risk.mitigationRecommendations,
      seasonalAnalysis: result.seasonalAnalysis as any,
      timeline: result.timeline as any,
      recommendations: result.recommendations as any,
      confidenceBand: result.confidenceBand,
      explanations: result.explanations,
    } as any);

    await this.demandMongoService.appendHistory({
      farmerCropId,
      farmerProfileId: result.farmerProfileId,
      cropName: result.cropName,
      previousDemandKg: (previous as any)?.currentDemandKg,
      newDemandKg: result.currentDemandKg,
      reason: previous ? 'scheduled-reassessment' : 'initial-assessment',
      confidence: result.confidence,
      riskLevel: result.risk.level,
      demandDensityKgPerAcre: result.demandDensityKgPerAcre,
      explanations: result.explanations,
      recommendations: result.recommendations as any,
      version: result.version,
    });

    this.eventPublisher.publishPredicted(result);

    if (previous && (previous as any).currentDemandKg !== result.currentDemandKg) {
      this.eventPublisher.publishUpdated(result, (previous as any).currentDemandKg ?? 0);
    }

    if (result.risk.level === 'high' || result.risk.level === 'critical') {
      this.eventPublisher.publishWarning(result);
    }

    this.logger.log(
      `Demand assessment complete | farmerCropId=${farmerCropId} current=${result.currentDemandKg}kg expected=${result.expectedDemandKg}kg confidence=${result.confidence}% risk=${result.risk.level}`,
    );

    return result;
  }

  // ─── Read Methods ───────────────────────────────────────────────────────────

  async getAssessment(farmerCropId: string, userId: string): Promise<DemandPredictionResult> {
    await this.loadCropData(farmerCropId, userId); // validates ownership
    const doc = await this.demandMongoService.findByFarmerCropId(farmerCropId);
    if (!doc) return this.assess(farmerCropId, userId);
    return doc as any;
  }

  async getMyAssessments(userId: string): Promise<any[]> {
    const profileId = await this.resolveProfileId(userId);
    if (!profileId) return [];
    const docs = await this.demandMongoService.findByFarmerProfileId(String(profileId));
    if (docs.length > 0) return docs;
    await this.runBulkAssessment(userId);
    return this.demandMongoService.findByFarmerProfileId(String(profileId));
  }

  async getSummary(userId: string): Promise<any[]> {
    return this.getMyAssessments(userId);
  }

  async getRisk(farmerCropId?: string, userId?: string) {
    if (farmerCropId && userId) {
      const doc = await this.getAssessment(farmerCropId, userId);
      return {
        farmerCropId,
        cropName: doc.cropName,
        riskLevel: (doc as any).risk?.level ?? (doc as any).riskLevel,
        riskScore: (doc as any).risk?.score ?? (doc as any).riskScore,
        reasons: (doc as any).risk?.reasons ?? (doc as any).riskReasons ?? [],
        mitigationRecommendations: (doc as any).risk?.mitigationRecommendations ?? (doc as any).mitigationRecommendations ?? [],
        explanations: doc.explanations?.slice(0, 3) ?? [],
      };
    }

    const docs = userId ? await this.getMyAssessments(userId) : await this.demandMongoService.findAllPredictions();
    const worst = [...docs].sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0))[0];
    return {
      riskLevel: worst?.riskLevel ?? 'low',
      riskScore: worst?.riskScore ?? 0,
      reasons: worst?.riskReasons ?? [],
      mitigationRecommendations: worst?.mitigationRecommendations ?? [],
      explanations: worst?.explanations?.slice(0, 3) ?? [],
      totalAssessments: docs.length,
    };
  }

  async getTimeline(farmerCropId?: string, userId?: string) {
    if (farmerCropId && userId) {
      const doc = await this.getAssessment(farmerCropId, userId);
      return (doc as any).timeline ?? [];
    }
    const docs = userId ? await this.getMyAssessments(userId) : await this.demandMongoService.findAllPredictions();
    return docs.flatMap((doc: any) =>
      (doc.timeline ?? []).map((point: any) => ({ ...point, farmerCropId: doc.farmerCropId, cropName: doc.cropName })),
    );
  }

  async getRegional(level: string, name: string) {
    const validLevels = ['village', 'taluk', 'district', 'state'];
    if (!validLevels.includes(level)) {
      throw new BadRequestException(`regionLevel must be one of: ${validLevels.join(', ')}`);
    }
    return this.regionalService.getRegionalSummary(level as any, name);
  }

  async getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number) {
    const analytics = await this.analyticsService.getAnalytics(regionLevel, regionName, periodType, limit);
    if (analytics.length === 0) {
      await this.analyticsService.refreshGlobalAnalytics();
      return this.analyticsService.getAnalytics(regionLevel, regionName, periodType, limit);
    }
    return analytics;
  }

  async refreshAnalytics() {
    await this.analyticsService.refreshRegionalAnalytics();
    return this.analyticsService.refreshGlobalAnalytics();
  }

  // ─── Bulk Assessment (Scheduler Entry Point) ────────────────────────────────

  async runBulkAssessment(userId?: string): Promise<{ assessed: number; failed: number }> {
    this.logger.log(`Bulk demand assessment started${userId ? ` for user=${userId}` : ''}`);
    const activeRows = await this.loadActiveRows(userId);

    let assessed = 0;
    let failed = 0;

    for (const row of activeRows) {
      try {
        await this.assess(String(row.farmer_crop_id), String(row.user_id));
        assessed++;
      } catch (error: any) {
        failed++;
        this.logger.warn(`Demand assessment failed for farmerCropId=${row.farmer_crop_id}: ${error?.message}`);
      }
    }

    this.logger.log(`Bulk demand assessment complete | assessed=${assessed} failed=${failed}`);
    return { assessed, failed };
  }

  // ─── Context Loading ────────────────────────────────────────────────────────

  private async loadAssessmentContext(farmerCropId: string, userId: string): Promise<DemandAssessmentContext> {
    const cropData = await this.loadCropData(farmerCropId, userId);
    if (!cropData) throw new NotFoundException(`Farmer crop ${farmerCropId} not found or access denied`);
    if (!cropData.sowing_date) throw new BadRequestException('Sowing date must be set before demand assessment can run');

    const harvestAssessment = await this.harvestMongoService.findByFarmerCropId(farmerCropId);
    const yieldAssessment = await this.yieldMongoService.findByFarmerCropId(farmerCropId);
    const supplyAssessment = await this.supplyMongoService.findByFarmerCropId(farmerCropId);
    const weather = await this.buildWeatherContext(cropData.parcel_id, userId);
    const lifecycle = this.buildLifecycleContext(cropData);
    const geography = await this.resolveRegionHierarchy(cropData);
    const marketContext = await this.buildMarketContext(cropData.crop_name);
    const historicalDemand = await this.loadHistoricalDemand(farmerCropId);

    const cropLower = lower(cropData.crop_name ?? '');
    const isMspCrop = MSP_CROP_KEYWORDS.some((kw) => cropLower.includes(kw));
    const isExportCrop = EXPORT_CROP_KEYWORDS.some((kw) => cropLower.includes(kw));

    const regionalEventNotes: string[] = [
      ...(weather.hasFloodRisk ? ['Flood risk may disrupt supply movement to demand centres'] : []),
      ...(weather.hasHeatStress ? ['Heat stress may reduce marketable harvest quality'] : []),
    ];

    return {
      farmerCropId,
      farmerProfileId: String(cropData.farmer_profile_id),
      cropName: cropData.crop_name,
      cropVariety: cropData.crop_variety ?? null,
      cropCategory: cropData.crop_category ?? null,
      cropSeason: cropData.season ?? null,
      regionLevel: geography.regionLevel,
      regionName: geography.regionName,
      villageName: geography.villageName,
      talukName: geography.talukName,
      districtName: geography.districtName,
      stateName: geography.stateName,
      areaAcres: safeNumber(cropData.area_acres, cropData.total_land_area ?? 1),
      expectedHarvestDate: cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null,
      harvestReadinessScore: safeNumber(harvestAssessment?.readinessScore, 0),
      harvestRiskLevel: harvestAssessment?.riskLevel ?? 'low',
      harvestStage: harvestAssessment?.readinessStatus ?? lifecycle.lifecycleStage,
      yieldExpectedKg: safeNumber((yieldAssessment as any)?.expectedYieldKg ?? cropData.estimated_yield_kg ?? (harvestAssessment as any)?.expectedYieldKg, 0),
      yieldConfidence: safeNumber((yieldAssessment as any)?.confidence ?? (harvestAssessment as any)?.yieldConfidence, 60),
      yieldRiskLevel: String((yieldAssessment as any)?.risk?.level ?? (yieldAssessment as any)?.riskLevel ?? 'low'),
      availableSupplyKg: safeNumber((supplyAssessment as any)?.availableSupplyKg, 0),
      expectedSupplyKg: safeNumber((supplyAssessment as any)?.expectedSupplyKg, 0),
      supplyRiskLevel: String((supplyAssessment as any)?.riskLevel ?? 'low'),
      supplyDensityKgPerAcre: safeNumber((supplyAssessment as any)?.supplyDensityKgPerAcre, 0),
      marketModalPrice: marketContext.modalPrice,
      marketMinPrice: marketContext.minPrice,
      marketMaxPrice: marketContext.maxPrice,
      marketTrendDirection: marketContext.trendDirection,
      recentArrivalQty: marketContext.recentArrivalQty,
      weather,
      lifecycle,
      isMspCrop,
      isExportCrop,
      currentMonth: new Date().getMonth() + 1,
      historicalDemandKg: historicalDemand,
      regionalEventNotes,
    };
  }

  private async buildMarketContext(cropName: string): Promise<{
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    trendDirection: 'rising' | 'falling' | 'stable';
    recentArrivalQty: number;
  }> {
    try {
      const prices = await this.marketRepository.findPrices(cropName, undefined, undefined, undefined, 10);
      const arrivals = await this.marketRepository.findArrivals(cropName, undefined, undefined, undefined, 5);

      if (!prices.length) {
        return { modalPrice: 0, minPrice: 0, maxPrice: 0, trendDirection: 'stable', recentArrivalQty: 0 };
      }

      const latestPrice = prices[0];
      const modalPrice = safeNumber((latestPrice as any).modalPrice, 0);
      const minPrice = safeNumber((latestPrice as any).minPrice, 0);
      const maxPrice = safeNumber((latestPrice as any).maxPrice, 0);
      const recentArrivalQty = arrivals.reduce((sum, a) => sum + safeNumber((a as any).arrivalQty, 0), 0);

      // Trend: compare first vs last of the last 5 prices
      let trendDirection: 'rising' | 'falling' | 'stable' = 'stable';
      if (prices.length >= 2) {
        const newest = safeNumber((prices[0] as any).modalPrice, 0);
        const oldest = safeNumber((prices[prices.length - 1] as any).modalPrice, 0);
        const diff = newest - oldest;
        if (diff > oldest * 0.05) trendDirection = 'rising';
        else if (diff < -(oldest * 0.05)) trendDirection = 'falling';
      }

      return { modalPrice, minPrice, maxPrice, trendDirection, recentArrivalQty };
    } catch {
      return { modalPrice: 0, minPrice: 0, maxPrice: 0, trendDirection: 'stable', recentArrivalQty: 0 };
    }
  }

  private buildLifecycleContext(cropData: any) {
    const sowingDate = new Date(cropData.sowing_date);
    const durationDays = cropData.duration_days ?? 90;
    const expectedHarvestDate = cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null;
    const daysElapsed = Math.max(0, Math.floor((Date.now() - sowingDate.getTime()) / (24 * 60 * 60 * 1000)));
    const daysRemaining = expectedHarvestDate
      ? Math.max(0, Math.ceil((expectedHarvestDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
      : Math.max(0, durationDays - daysElapsed);
    const growthPercentage = durationDays > 0 ? Math.min(100, Math.round((daysElapsed / durationDays) * 100)) : 0;
    const lifecycleStage: 'pre-sowing' | 'vegetative' | 'reproductive' | 'ripening' | 'ready' =
      growthPercentage >= 90 ? 'ready' : growthPercentage >= 60 ? 'ripening' : growthPercentage >= 35 ? 'reproductive' : growthPercentage > 0 ? 'vegetative' : 'pre-sowing';
    return { sowingDate, durationDays, expectedHarvestDate, daysElapsed, daysRemaining, growthPercentage, lifecycleStage };
  }

  private async buildWeatherContext(parcelId: string, userId: string) {
    try {
      const current = await this.weatherService.getCurrentWeather(parcelId, userId);
      return {
        currentTemperature: current.temperature,
        currentHumidity: current.humidity,
        currentRainfall: current.rainfall,
        forecastRainProbability: current.rainfall > 5 ? 70 : 20,
        forecastTemperature: current.temperature,
        weatherCondition: current.weatherCondition,
        hasRainForecast: current.rainfall > 5,
        hasHeatStress: current.temperature >= 38,
        hasColdStress: current.temperature <= 10,
        hasFloodRisk: current.rainfall >= 45,
      };
    } catch {
      return { hasRainForecast: false, hasHeatStress: false, hasColdStress: false, hasFloodRisk: false, forecastRainProbability: 20 };
    }
  }

  private async resolveRegionHierarchy(cropData: any) {
    const region: { regionLevel: 'village' | 'taluk' | 'district' | 'state'; regionName: string; villageName?: string | null; talukName?: string | null; districtName?: string | null; stateName?: string | null } = {
      regionLevel: 'district',
      regionName: cropData.district ?? cropData.state ?? 'unknown',
      villageName: cropData.village ?? null,
      talukName: null,
      districtName: cropData.district ?? null,
      stateName: cropData.state ?? null,
    };

    const latitude = cropData.latitude !== null ? Number(cropData.latitude) : null;
    const longitude = cropData.longitude !== null ? Number(cropData.longitude) : null;

    if (latitude !== null && longitude !== null) {
      try {
        const resolved = await this.geoBoundaryService.resolveLocation(latitude, longitude);
        region.villageName = resolved.villageName ?? region.villageName;
        region.talukName = resolved.talukName ?? region.talukName;
        region.districtName = resolved.districtName ?? region.districtName;
        region.stateName = resolved.stateName ?? region.stateName;
        if (resolved.villageName) { region.regionLevel = 'village'; region.regionName = resolved.villageName; }
        else if (resolved.talukName) { region.regionLevel = 'taluk'; region.regionName = resolved.talukName; }
        else if (resolved.districtName) { region.regionLevel = 'district'; region.regionName = resolved.districtName; }
        else if (resolved.stateName) { region.regionLevel = 'state'; region.regionName = resolved.stateName; }
      } catch {
        // Fall back to profile geography
      }
    }
    return region;
  }

  private async loadCropData(farmerCropId: string, userId: string): Promise<any> {
    const rows = await this.dataSource.query(
      `SELECT
         fc.id, fc.sowing_date, fc.expected_harvest_date, fc.estimated_yield_kg,
         fc.actual_yield_kg, fc.status, fc.crop_variety, fc.parcel_id, fc.crop_id,
         c.crop_name, c.crop_category, c.season, c.duration_days,
         c.ideal_temperature_min, c.ideal_temperature_max, c.water_requirement,
         flp.area_acres, flp.soil_type, flp.land_type, flp.irrigation_type,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude,
         fp.id AS farmer_profile_id, fp.user_id, fp.district, fp.state, fp.village,
         fp.total_land_area, fp.primary_soil_type, fp.primary_irrigation_type
       FROM farmer_crops fc
       JOIN crops c ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       JOIN users u ON u.id = fp.user_id
       WHERE fc.id = $1 AND u.id = $2`,
      [farmerCropId, userId],
    );
    return rows[0] ?? null;
  }

  private async loadActiveRows(userId?: string): Promise<any[]> {
    const params: any[] = [];
    let userFilter = '';
    if (userId) {
      params.push(userId);
      userFilter = 'AND u.id = $1';
    }
    return this.dataSource.query(
      `SELECT fc.id AS farmer_crop_id, fp.user_id
       FROM farmer_crops fc
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       JOIN users u ON u.id = fp.user_id
       WHERE fc.status = 'active' AND fc.sowing_date IS NOT NULL ${userFilter}`,
      params,
    );
  }

  private async loadHistoricalDemand(farmerCropId: string): Promise<number[]> {
    const rows = await this.demandMongoService.findHistory(farmerCropId, 10);
    return rows.map((row: any) => safeNumber(row.newDemandKg, 0)).filter((v: number) => v > 0);
  }

  private async resolveProfileId(userId: string): Promise<string | null> {
    const rows = await this.dataSource.query(`SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
    return rows[0]?.id ?? null;
  }
}
