import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WeatherService } from '../weather/weather.service';
import { CalendarService } from '../calendar/calendar.service';
import { GeoBoundaryService } from '../geoboundary/geoboundary.service';
import { CropLifecycleEngine } from '../harvest-intelligence/engines/crop-lifecycle.engine';
import { HarvestAssessmentEngine } from '../harvest-intelligence/engines/harvest-assessment.engine';
import type { WeatherContext, ActivityContext } from '../harvest-intelligence/interfaces/harvest-intelligence.types';
import { YieldMongoService } from '../mongodb/yield/yield-mongo.service';
import type { YieldEstimatorStrategy } from './interfaces/yield-estimator.interface';
import { YIELD_ESTIMATOR } from './interfaces/yield-estimator.interface';
import { YieldEventPublisher } from './events/yield-event.publisher';
import { RegionalYieldService } from './regional/regional-yield.service';
import { YieldAnalyticsService } from './services/yield-analytics.service';
import type { YieldAssessmentContext, YieldPredictionResult } from './interfaces/yield-intelligence.types';
import { average, round, safeNumber } from './utils/yield-rule.utils';

@Injectable()
export class YieldIntelligenceService {
  private readonly logger = new Logger(YieldIntelligenceService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly weatherService: WeatherService,
    private readonly calendarService: CalendarService,
    private readonly geoBoundaryService: GeoBoundaryService,
    private readonly lifecycleEngine: CropLifecycleEngine,
    private readonly harvestAssessmentEngine: HarvestAssessmentEngine,
    private readonly mongoService: YieldMongoService,
    private readonly eventPublisher: YieldEventPublisher,
    private readonly regionalService: RegionalYieldService,
    private readonly analyticsService: YieldAnalyticsService,
    @Inject(YIELD_ESTIMATOR) private readonly yieldEstimator: YieldEstimatorStrategy,
  ) {}

  async assess(farmerCropId: string, userId: string): Promise<YieldPredictionResult> {
    this.logger.debug(`Starting yield assessment | farmerCropId=${farmerCropId}`);

    const context = await this.loadAssessmentContext(farmerCropId, userId);
    const previous = await this.mongoService.findByFarmerCropId(farmerCropId);

    const result = this.yieldEstimator.estimate(context);
    result.version = (previous?.version ?? 0) + 1;
    result.assessedAt = new Date();

    await this.mongoService.upsertAssessment(farmerCropId, {
      ...result,
      riskLevel: result.risk.level,
      riskScore: result.risk.score,
      riskReasons: result.risk.reasons,
      mitigationRecommendations: result.risk.mitigationRecommendations,
      confidenceBand: result.confidenceAnalysis.band,
      confidenceExplanation: result.confidenceAnalysis.explanation,
      qualityGrade: result.quality.grade,
      qualityScore: result.quality.score,
      qualityFactors: result.quality.factors,
      qualityExplanation: result.quality.explanation,
      expectedLossPercent: result.loss.expectedLossPercent,
      expectedLossQuantityKg: result.loss.expectedLossQuantityKg,
      lossReasons: result.loss.reasons,
      lossExplanation: result.loss.explanation,
    } as any);

    await this.mongoService.appendHistory({
      farmerCropId,
      farmerProfileId: result.farmerProfileId,
      cropName: result.cropName,
      previousYieldKg: previous?.expectedYieldKg,
      newYieldKg: result.expectedYieldKg,
      reason: previous ? 'scheduled-reassessment' : 'initial-assessment',
      confidence: result.confidence,
      qualityGrade: result.quality.grade,
      riskLevel: result.risk.level,
      lossPercent: result.loss.expectedLossPercent,
      explanations: result.explanations,
      recommendations: result.recommendations as any,
      version: result.version,
    });

    await this.eventPublisher.publishPredicted({
      farmerCropId,
      farmerProfileId: result.farmerProfileId,
      cropName: result.cropName,
      expectedYieldKg: result.expectedYieldKg,
      confidence: result.confidence,
      riskLevel: result.risk.level,
      qualityGrade: result.quality.grade,
    });

    if (previous && previous.expectedYieldKg !== result.expectedYieldKg) {
      await this.eventPublisher.publishUpdated({
        farmerCropId,
        farmerProfileId: result.farmerProfileId,
        previousYieldKg: previous.expectedYieldKg,
        newYieldKg: result.expectedYieldKg,
        reason: 'daily-reassessment',
      });

      if ((previous.expectedYieldKg ?? 0) > result.expectedYieldKg) {
        await this.eventPublisher.publishReduced({
          farmerCropId,
          farmerProfileId: result.farmerProfileId,
          expectedYieldDropKg: (previous.expectedYieldKg ?? 0) - result.expectedYieldKg,
          reason: 'yield-downtrend-detected',
        });
      }
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

    if (context.actualYieldKg !== null && context.actualYieldKg !== undefined) {
      await this.eventPublisher.publishCompleted({
        farmerCropId,
        farmerProfileId: result.farmerProfileId,
        cropName: result.cropName,
        actualYieldKg: context.actualYieldKg,
      });
    }

    this.logger.log(
      `Yield assessment complete | farmerCropId=${farmerCropId} expected=${result.expectedYieldKg}kg confidence=${result.confidence}% risk=${result.risk.level}`,
    );

    return result;
  }

  async getAssessment(farmerCropId: string, userId: string): Promise<YieldPredictionResult> {
    await this.loadAssessmentContext(farmerCropId, userId);
    const doc = await this.mongoService.findByFarmerCropId(farmerCropId);
    if (!doc) return this.assess(farmerCropId, userId);
    return doc as any;
  }

  async getMyAssessments(userId: string): Promise<any[]> {
    const profileId = await this.resolveProfileId(userId);
    if (!profileId) return [];
    return this.mongoService.findByFarmerProfileId(String(profileId));
  }

  async getRisk(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      riskLevel: doc.risk?.level ?? doc.riskLevel,
      riskScore: doc.risk?.score ?? doc.riskScore,
      reasons: doc.risk?.reasons ?? doc.riskReasons,
      mitigationRecommendations: doc.risk?.mitigationRecommendations ?? doc.mitigationRecommendations,
      explanations: doc.explanations?.slice(0, 3) ?? [],
    };
  }

  async getConfidence(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      confidence: doc.confidence,
      confidenceBand: doc.confidenceAnalysis?.band ?? doc.confidenceBand,
      explanation: doc.confidenceAnalysis?.explanation ?? doc.confidenceExplanation,
      reasons: doc.confidenceAnalysis?.reasons ?? [],
    };
  }

  async getLoss(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      expectedLossPercent: doc.loss?.expectedLossPercent ?? doc.expectedLossPercent,
      expectedLossQuantityKg: doc.loss?.expectedLossQuantityKg ?? doc.expectedLossQuantityKg,
      explanation: doc.loss?.explanation ?? doc.lossExplanation,
      reasons: doc.loss?.reasons ?? doc.lossReasons,
    };
  }

  async getSummary(userId: string): Promise<any[]> {
    return this.getMyAssessments(userId);
  }

  async getHistory(farmerCropId: string, userId: string, limit = 20) {
    await this.loadAssessmentContext(farmerCropId, userId);
    return this.mongoService.findHistory(farmerCropId, limit);
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
    return this.analyticsService.refreshGlobalAnalytics();
  }

  async runBulkAssessment(): Promise<{ assessed: number; failed: number }> {
    this.logger.log('Bulk yield assessment started');
    const activeRows = await this.dataSource.query(
      `SELECT fc.id AS farmer_crop_id, fp.user_id
       FROM farmer_crops fc
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active' AND fc.sowing_date IS NOT NULL`,
    );

    let assessed = 0;
    let failed = 0;

    for (const row of activeRows) {
      try {
        await this.assess(String(row.farmer_crop_id), String(row.user_id));
        assessed++;
      } catch (error: any) {
        failed++;
        this.logger.warn(`Yield assessment failed for farmerCropId=${row.farmer_crop_id}: ${error?.message}`);
      }
    }

    this.logger.log(`Bulk yield assessment complete | assessed=${assessed} failed=${failed}`);
    return { assessed, failed };
  }

  private async loadAssessmentContext(farmerCropId: string, userId: string): Promise<YieldAssessmentContext> {
    const cropData = await this.loadCropData(farmerCropId, userId);
    if (!cropData) {
      throw new NotFoundException(`Farmer crop ${farmerCropId} not found or access denied`);
    }

    if (!cropData.sowing_date) {
      throw new BadRequestException('Sowing date must be set before yield assessment can run');
    }

    const lifecycle = this.lifecycleEngine.compute(
      new Date(cropData.sowing_date),
      cropData.duration_days ?? 90,
      cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null,
    );

    const weather = await this.buildWeatherContext(cropData.parcel_id, userId);
    const weatherHistory = await this.buildWeatherHistory(cropData.parcel_id, userId);
    const activities = await this.buildActivityContext(farmerCropId, userId);

    const harvestAssessment = this.harvestAssessmentEngine.evaluate(
      lifecycle,
      weather,
      activities,
      cropData.ideal_temperature_min,
      cropData.ideal_temperature_max,
    );

    const historicalYields = await this.loadHistoricalYields(cropData.crop_id, cropData.parcel_id);

    const soilFertilityScore = this.deriveSoilFertilityScore(
      cropData.soil_type,
      cropData.primary_soil_type,
      cropData.additional_metadata,
      activities,
      weather,
    );

    return {
      farmerCropId,
      farmerProfileId: String(cropData.farmer_profile_id),
      cropName: cropData.crop_name,
      cropVariety: cropData.crop_variety ?? null,
      cropCategory: cropData.crop_category ?? null,
      areaAcres: safeNumber(cropData.area_acres, cropData.total_land_area ?? 1),
      soilType: cropData.soil_type ?? cropData.primary_soil_type ?? null,
      soilFertilityScore,
      irrigationType: cropData.irrigation_type ?? cropData.primary_irrigation_type ?? null,
      lifecycle,
      weather,
      weatherHistory,
      activities,
      readinessScore: harvestAssessment.readinessScore,
      riskLevelEquivalent: harvestAssessment.riskLevel,
      historicalYieldKg: historicalYields.length ? average(historicalYields) : cropData.estimated_yield_kg ?? null,
      historicalYieldSamples: historicalYields,
      cropTemperatureMin: cropData.ideal_temperature_min,
      cropTemperatureMax: cropData.ideal_temperature_max,
      actualYieldKg: cropData.actual_yield_kg ?? null,
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

  private async buildWeatherContext(parcelId: string, userId: string): Promise<WeatherContext> {
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

  private async buildActivityContext(farmerCropId: string, userId: string): Promise<ActivityContext> {
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

  private async loadHistoricalYields(cropId: string, parcelId: string): Promise<number[]> {
    const rows = await this.dataSource.query(
      `SELECT actual_yield_kg, estimated_yield_kg
       FROM farmer_crops
       WHERE crop_id = $1 AND parcel_id = $2 AND (actual_yield_kg IS NOT NULL OR estimated_yield_kg IS NOT NULL)
       ORDER BY updated_at DESC
       LIMIT 10`,
      [cropId, parcelId],
    );

    return rows
      .map((row: any) => safeNumber(row.actual_yield_kg ?? row.estimated_yield_kg, 0))
      .filter((value: number) => value > 0);
  }

  private deriveSoilFertilityScore(
    soilType?: string | null,
    primarySoilType?: string | null,
    metadata?: Record<string, any> | null,
    activities?: ActivityContext,
    weather?: WeatherContext,
  ): number {
    const soil = String(soilType ?? primarySoilType ?? '').toLowerCase();
    let score = 58;

    if (/loam|alluvial/.test(soil)) score += 16;
    if (/black|regur/.test(soil)) score += 12;
    if (/red/.test(soil)) score += 6;
    if (/sandy/.test(soil)) score -= 8;
    if (/saline|alkaline/.test(soil)) score -= 18;

    const fertility = safeNumber(metadata?.soilFertility ?? metadata?.fertility, NaN);
    if (Number.isFinite(fertility)) {
      score = (score + fertility) / 2;
    }

    if ((activities?.completionRate ?? 100) >= 80) score += 4;
    if (weather?.hasFloodRisk || weather?.hasHeatStress) score -= 4;

    return Math.max(25, Math.min(92, Math.round(score)));
  }

  private async resolveProfileId(userId: string): Promise<string | null> {
    const rows = await this.dataSource.query(`SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
    return rows[0]?.id ?? null;
  }
}
