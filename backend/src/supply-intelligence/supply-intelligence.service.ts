import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WeatherService } from '../weather/weather.service';
import { CalendarService } from '../calendar/calendar.service';
import { GeoBoundaryService } from '../geoboundary/geoboundary.service';
import { HarvestMongoService } from '../mongodb/harvest/harvest-mongo.service';
import { YieldMongoService } from '../mongodb/yield/yield-mongo.service';
import { SupplyMongoService } from '../mongodb/supply/supply-mongo.service';
import type { SupplyEstimatorStrategy } from './interfaces/supply-estimator.interface';
import { SUPPLY_ESTIMATOR } from './interfaces/supply-estimator.interface';
import { SupplyEventPublisher } from './events/supply-event.publisher';
import { SupplyAnalyticsService } from './services/supply-analytics.service';
import type { SupplyAggregator } from './interfaces/supply-aggregator.interface';
import { SUPPLY_AGGREGATOR } from './interfaces/supply-aggregator.interface';
import type { SupplyAssessmentContext, SupplyPredictionResult } from './interfaces/supply-intelligence.types';
import { average, safeNumber } from '../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class SupplyIntelligenceService {
  private readonly logger = new Logger(SupplyIntelligenceService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly weatherService: WeatherService,
    private readonly calendarService: CalendarService,
    private readonly geoBoundaryService: GeoBoundaryService,
    private readonly harvestMongoService: HarvestMongoService,
    private readonly yieldMongoService: YieldMongoService,
    private readonly supplyMongoService: SupplyMongoService,
    private readonly eventPublisher: SupplyEventPublisher,
    @Inject(SUPPLY_AGGREGATOR) private readonly regionalService: SupplyAggregator,
    private readonly analyticsService: SupplyAnalyticsService,
    @Inject(SUPPLY_ESTIMATOR) private readonly supplyEstimator: SupplyEstimatorStrategy,
  ) {}

  async assess(farmerCropId: string, userId: string): Promise<SupplyPredictionResult> {
    this.logger.debug(`Starting supply assessment | farmerCropId=${farmerCropId}`);

    const context = await this.loadAssessmentContext(farmerCropId, userId);
    const previous = await this.supplyMongoService.findByFarmerCropId(farmerCropId);

    const result = this.supplyEstimator.estimate(context);
    result.version = (previous?.version ?? 0) + 1;
    result.assessedAt = new Date();

    await this.supplyMongoService.upsertAssessment(farmerCropId, {
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
      seasonalAnalysis: result.seasonalAnalysis,
      timeline: result.timeline,
      recommendations: result.recommendations,
      confidenceBand: result.confidenceBand,
      explanations: result.explanations,
    } as any);

    await this.supplyMongoService.appendHistory({
      farmerCropId,
      farmerProfileId: result.farmerProfileId,
      cropName: result.cropName,
      previousSupplyKg: previous?.availableSupplyKg,
      newSupplyKg: result.availableSupplyKg,
      reason: previous ? 'scheduled-reassessment' : 'initial-assessment',
      confidence: result.confidence,
      riskLevel: result.risk.level,
      supplyDensityKgPerAcre: result.supplyDensityKgPerAcre,
      explanations: result.explanations,
      recommendations: result.recommendations as any,
      version: result.version,
    });

    await this.eventPublisher.publishPredicted({
      farmerCropId,
      farmerProfileId: result.farmerProfileId,
      cropName: result.cropName,
      expectedSupplyKg: result.expectedSupplyKg,
      availableSupplyKg: result.availableSupplyKg,
      confidence: result.confidence,
      riskLevel: result.risk.level,
    });

    if (previous && previous.availableSupplyKg !== result.availableSupplyKg) {
      await this.eventPublisher.publishUpdated({
        farmerCropId,
        farmerProfileId: result.farmerProfileId,
        previousSupplyKg: previous.availableSupplyKg,
        newSupplyKg: result.availableSupplyKg,
        reason: 'daily-reassessment',
      });
    }

    if (result.risk.level === 'high' || result.risk.level === 'critical') {
      await this.eventPublisher.publishWarning({
        farmerCropId,
        farmerProfileId: result.farmerProfileId,
        cropName: result.cropName,
        riskLevel: result.risk.level,
        reasons: result.risk.reasons,
      });
    }

    if (context.actualYieldKg !== null && context.actualYieldKg !== undefined && result.availableSupplyKg > 0) {
      await this.eventPublisher.publishCompleted({
        farmerCropId,
        farmerProfileId: result.farmerProfileId,
        cropName: result.cropName,
        actualSupplyKg: result.availableSupplyKg,
      });
    }

    this.logger.log(
      `Supply assessment complete | farmerCropId=${farmerCropId} expected=${result.expectedSupplyKg}kg available=${result.availableSupplyKg}kg confidence=${result.confidence}% risk=${result.risk.level}`,
    );

    return result;
  }

  async getAssessment(farmerCropId: string, userId: string): Promise<SupplyPredictionResult> {
    await this.loadAssessmentContext(farmerCropId, userId);
    const doc = await this.supplyMongoService.findByFarmerCropId(farmerCropId);
    if (!doc) return this.assess(farmerCropId, userId);
    return doc as any;
  }

  async getMyAssessments(userId: string): Promise<any[]> {
    const profileId = await this.resolveProfileId(userId);
    if (!profileId) return [];
    const docs = await this.supplyMongoService.findByFarmerProfileId(String(profileId));
    if (docs.length > 0) return docs;
    await this.runBulkAssessment(userId);
    return this.supplyMongoService.findByFarmerProfileId(String(profileId));
  }

  async getRisk(farmerCropId?: string, userId?: string) {
    if (farmerCropId && userId) {
      const doc = await this.getAssessment(farmerCropId, userId);
      return {
        farmerCropId,
        cropName: doc.cropName,
        riskLevel: (doc as any).risk?.level ?? (doc as any).riskLevel,
        riskScore: (doc as any).risk?.score ?? (doc as any).riskScore,
        reasons: (doc as any).risk?.reasons ?? (doc as any).riskReasons,
        mitigationRecommendations: (doc as any).risk?.mitigationRecommendations ?? (doc as any).mitigationRecommendations,
        explanations: doc.explanations?.slice(0, 3) ?? [],
      };
    }

    const docs = userId ? await this.getMyAssessments(userId) : await this.supplyMongoService.findAllPredictions();
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
      return doc.timeline ?? [];
    }

    const docs = userId ? await this.getMyAssessments(userId) : await this.supplyMongoService.findAllPredictions();
    return docs.flatMap((doc: any) => (doc.timeline ?? []).map((point: any) => ({ ...point, farmerCropId: doc.farmerCropId, cropName: doc.cropName })));
  }

  async getSummary(userId: string): Promise<any[]> {
    return this.getMyAssessments(userId);
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

  async runBulkAssessment(userId?: string): Promise<{ assessed: number; failed: number }> {
    this.logger.log(`Bulk supply assessment started${userId ? ` for user=${userId}` : ''}`);
    const activeRows = await this.loadActiveRows(userId);

    let assessed = 0;
    let failed = 0;

    for (const row of activeRows) {
      try {
        await this.assess(String(row.farmer_crop_id), String(row.user_id));
        assessed++;
      } catch (error: any) {
        failed++;
        this.logger.warn(`Supply assessment failed for farmerCropId=${row.farmer_crop_id}: ${error?.message}`);
      }
    }

    this.logger.log(`Bulk supply assessment complete | assessed=${assessed} failed=${failed}`);
    return { assessed, failed };
  }

  private async loadAssessmentContext(farmerCropId: string, userId: string): Promise<SupplyAssessmentContext> {
    const cropData = await this.loadCropData(farmerCropId, userId);
    if (!cropData) {
      throw new NotFoundException(`Farmer crop ${farmerCropId} not found or access denied`);
    }

    if (!cropData.sowing_date) {
      throw new BadRequestException('Sowing date must be set before supply assessment can run');
    }

    const harvestAssessment = await this.harvestMongoService.findByFarmerCropId(farmerCropId);
    const yieldAssessment = await this.yieldMongoService.findByFarmerCropId(farmerCropId);
    const weather = await this.buildWeatherContext(cropData.parcel_id, userId);
    const weatherHistory = await this.buildWeatherHistory(cropData.parcel_id, userId);
    const activities = await this.buildActivityContext(farmerCropId, userId);
    const lifecycle = this.buildLifecycleContext(cropData);
    const geography = await this.resolveRegionHierarchy(cropData, userId);
    const historicalSupply = await this.loadHistoricalSupply(farmerCropId, (yieldAssessment as any)?.historicalYieldSamples ?? []);

    const regionalEventNotes = [
      ...(weather.hasFloodRisk ? ['Flood risk may delay supply movement'] : []),
      ...(weather.hasHeatStress ? ['Heat stress may reduce marketable supply'] : []),
      ...(activities.hasMissedActivities ? ['Missed farm activities may slow harvest'] : []),
    ];

    return {
      farmerCropId,
      farmerProfileId: String(cropData.farmer_profile_id),
      cropName: cropData.crop_name,
      cropVariety: cropData.crop_variety ?? null,
      cropCategory: cropData.crop_category ?? null,
      regionLevel: geography.regionLevel,
      regionName: geography.regionName,
      villageName: geography.villageName,
      talukName: geography.talukName,
      districtName: geography.districtName,
      stateName: geography.stateName,
      areaAcres: safeNumber(cropData.area_acres, cropData.total_land_area ?? 1),
      expectedHarvestDate: cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : harvestAssessment?.optimalHarvestDate ?? null,
      harvestStage: harvestAssessment?.readinessStatus ?? lifecycle.lifecycleStage,
      harvestReadinessScore: harvestAssessment?.readinessScore ?? 0,
      harvestRiskLevel: harvestAssessment?.riskLevel ?? 'low',
      harvestExplanations: harvestAssessment?.explanations ?? [],
      yieldExpectedKg: safeNumber(yieldAssessment?.expectedYieldKg ?? cropData.estimated_yield_kg ?? harvestAssessment?.expectedYieldKg, 0),
      yieldConfidence: safeNumber(yieldAssessment?.confidence ?? harvestAssessment?.yieldConfidence, 60),
      yieldRiskLevel: String((yieldAssessment as any)?.risk?.level ?? (yieldAssessment as any)?.riskLevel ?? 'low'),
      yieldExplanations: yieldAssessment?.explanations ?? [],
      weather,
      weatherHistory,
      activities,
      lifecycle,
      historicalSupplyKg: historicalSupply,
      actualYieldKg: cropData.actual_yield_kg ?? null,
      regionalEventNotes,
    };
  }

  private buildLifecycleContext(cropData: any) {
    const sowingDate = new Date(cropData.sowing_date);
    const durationDays = cropData.duration_days ?? 90;
    const expectedHarvestDate = cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null;
    const daysElapsed = Math.max(0, Math.floor((Date.now() - sowingDate.getTime()) / (24 * 60 * 60 * 1000)));
    const daysRemaining = expectedHarvestDate ? Math.max(0, Math.ceil((expectedHarvestDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : Math.max(0, durationDays - daysElapsed);
    const growthPercentage = durationDays > 0 ? Math.min(100, Math.round((daysElapsed / durationDays) * 100)) : 0;
    const lifecycleStage: 'pre-sowing' | 'vegetative' | 'reproductive' | 'ripening' | 'ready' = growthPercentage >= 90 ? 'ready' : growthPercentage >= 60 ? 'ripening' : growthPercentage >= 35 ? 'reproductive' : growthPercentage > 0 ? 'vegetative' : 'pre-sowing';

    return {
      sowingDate,
      durationDays,
      expectedHarvestDate,
      daysElapsed,
      daysRemaining,
      growthPercentage,
      lifecycleStage,
    };
  }

  private async loadCropData(farmerCropId: string, userId: string): Promise<any> {
    const rows = await this.dataSource.query(
      `SELECT
         fc.id,
         fc.sowing_date,
         fc.expected_harvest_date,
         fc.estimated_yield_kg,
         fc.actual_yield_kg,
         fc.status,
         fc.crop_variety,
         fc.parcel_id,
         fc.crop_id,
         c.crop_name,
         c.crop_category,
         c.season,
         c.duration_days,
         c.ideal_temperature_min,
         c.ideal_temperature_max,
         c.water_requirement,
         flp.area_acres,
         flp.soil_type,
         flp.land_type,
         flp.irrigation_type,
         flp.additional_metadata,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude,
         fp.id AS farmer_profile_id,
         fp.user_id,
         fp.district,
         fp.state,
         fp.village,
         fp.total_land_area,
         fp.primary_soil_type,
         fp.primary_irrigation_type
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
      return {
        hasRainForecast: false,
        hasHeatStress: false,
        hasColdStress: false,
        hasFloodRisk: false,
        forecastRainProbability: 20,
      };
    }
  }

  private async buildWeatherHistory(parcelId: string, userId: string) {
    try {
      const history = await this.weatherService.getWeatherHistory(parcelId, userId);
      return history.history.map((item) => ({
        timestamp: item.timestamp,
        temperature: typeof item.temperature === 'number' ? item.temperature : undefined,
        humidity: typeof item.humidity === 'number' ? item.humidity : undefined,
        rainfall: typeof item.rainfall === 'number' ? item.rainfall : undefined,
        weatherCondition: item.weatherCondition,
      })).filter((item) => Number.isFinite(item.temperature) || Number.isFinite(item.rainfall));
    } catch {
      return [];
    }
  }

  private async buildActivityContext(farmerCropId: string, userId: string) {
    try {
      const events = await this.calendarService.findAll(userId);
      const cropEvents = events.filter((event) => String(event.farmerCrop?.id ?? '') === String(farmerCropId));
      const total = cropEvents.length;
      const completed = cropEvents.filter((event) => event.isCompleted).length;
      const pending = total - completed;
      const overdue = cropEvents.filter((event) => !event.isCompleted && new Date(event.eventDate) < new Date()).length;
      const lateIrrigation = cropEvents.filter((event) => /irrigat/i.test(event.taskName) && !event.isCompleted && new Date(event.eventDate) < new Date()).length;
      const lateFertilizer = cropEvents.filter((event) => /fertiliz/i.test(event.taskName) && !event.isCompleted && new Date(event.eventDate) < new Date()).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

      return {
        totalEvents: total,
        completedEvents: completed,
        pendingEvents: pending,
        overduePendingEvents: overdue,
        completionRate,
        hasLateIrrigation: lateIrrigation > 0,
        hasLateFertilizer: lateFertilizer > 0,
        hasMissedActivities: overdue > 0,
      };
    } catch {
      return {
        totalEvents: 0,
        completedEvents: 0,
        pendingEvents: 0,
        overduePendingEvents: 0,
        completionRate: 100,
        hasLateIrrigation: false,
        hasLateFertilizer: false,
        hasMissedActivities: false,
      };
    }
  }

  private async resolveRegionHierarchy(cropData: any, userId: string) {
    const region: {
      regionLevel: 'village' | 'taluk' | 'district' | 'state';
      regionName: string;
      villageName?: string | null;
      talukName?: string | null;
      districtName?: string | null;
      stateName?: string | null;
    } = {
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
        if (resolved.villageName) {
          region.regionLevel = 'village';
          region.regionName = resolved.villageName;
        } else if (resolved.talukName) {
          region.regionLevel = 'taluk';
          region.regionName = resolved.talukName;
        } else if (resolved.districtName) {
          region.regionLevel = 'district';
          region.regionName = resolved.districtName;
        } else if (resolved.stateName) {
          region.regionLevel = 'state';
          region.regionName = resolved.stateName;
        }
      } catch {
        // Fall back to profile-based geography
      }
    }

    return region;
  }

  private async loadHistoricalSupply(farmerCropId: string, fallbackSamples: number[]): Promise<number[]> {
    const rows = await this.supplyMongoService.findHistory(farmerCropId, 10);
    const history = rows.map((row: any) => safeNumber(row.newSupplyKg, 0)).filter((value: number) => value > 0);
    if (history.length > 0) return history;
    return fallbackSamples.filter((value: number) => value > 0);
  }

  private async resolveProfileId(userId: string): Promise<string | null> {
    const rows = await this.dataSource.query(`SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
    return rows[0]?.id ?? null;
  }
}