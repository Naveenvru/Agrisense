import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HarvestMongoService } from '../mongodb/harvest/harvest-mongo.service';
import { CropLifecycleEngine } from './engines/crop-lifecycle.engine';
import { HarvestAssessmentEngine } from './engines/harvest-assessment.engine';
import { HarvestEstimatorEngine } from './engines/harvest-estimator.engine';
import { HarvestEventPublisher } from './events/harvest-event.publisher';
import { RegionalHarvestService } from './regional/regional-harvest.service';
import type { WeatherContext, ActivityContext } from './interfaces/harvest-intelligence.types';

/**
 * HarvestIntelligenceService
 *
 * Central orchestrator for Phase 11 Harvest Intelligence.
 *
 * Pipeline per assessment:
 *   1. Load FarmerCrop + Crop + LandParcel from PostgreSQL
 *   2. Fetch weather context from WeatherService (optional — graceful fallback)
 *   3. Fetch calendar activity context from PostgreSQL calendar_events
 *   4. Run CropLifecycleEngine → LifecycleContext
 *   5. Run HarvestAssessmentEngine → IHarvestAssessmentResult
 *   6. Run HarvestEstimatorEngine → yield, quality, labour, equipment, storage
 *   7. Persist to MongoDB (harvest_intelligence upsert + harvest_history append)
 *   8. Publish domain events
 *
 * Future phases: inject IHarvestLifecycleEngine, IHarvestAssessmentStrategy
 * via DI tokens so ML implementations can be swapped seamlessly.
 */
@Injectable()
export class HarvestIntelligenceService {
  private readonly logger = new Logger(HarvestIntelligenceService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly mongoService: HarvestMongoService,
    private readonly lifecycleEngine: CropLifecycleEngine,
    private readonly assessmentEngine: HarvestAssessmentEngine,
    private readonly estimatorEngine: HarvestEstimatorEngine,
    private readonly eventPublisher: HarvestEventPublisher,
    private readonly regionalService: RegionalHarvestService,
  ) {}

  // ---------------------------------------------------------------------------
  // Core Assessment
  // ---------------------------------------------------------------------------

  /**
   * Compute and persist a full harvest intelligence assessment for a single farmer crop.
   * Called by the controller (GET/POST) and by the daily scheduler job.
   */
  async assess(farmerCropId: string, userId: string): Promise<any> {
    this.logger.debug(`Starting assessment | farmerCropId=${farmerCropId}`);

    // Load crop data
    const cropData = await this.loadCropData(farmerCropId, userId);
    if (!cropData) {
      throw new NotFoundException(`Farmer crop ${farmerCropId} not found or access denied`);
    }

    if (!cropData.sowing_date) {
      throw new BadRequestException('Sowing date must be set before harvest assessment can run');
    }

    // Build lifecycle context
    const lifecycle = this.lifecycleEngine.compute(
      new Date(cropData.sowing_date),
      cropData.duration_days ?? 90,
      cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null,
    );

    // Build weather context (graceful degradation if weather unavailable)
    const weather = await this.buildWeatherContext(cropData.parcel_id);

    // Build activity context from calendar_events
    const activities = await this.buildActivityContext(farmerCropId);

    // Assessment
    const assessment = this.assessmentEngine.evaluate(
      lifecycle,
      weather,
      activities,
      cropData.ideal_temperature_min,
      cropData.ideal_temperature_max,
    );

    // Estimations
    const yieldEstimate = this.estimatorEngine.estimateYield(
      cropData.estimated_yield_kg,
      cropData.area_acres,
      lifecycle,
      activities,
    );
    const qualityEstimate = this.estimatorEngine.estimateQuality(
      weather,
      activities,
      cropData.crop_variety,
      lifecycle,
    );
    const labourEstimate = this.estimatorEngine.estimateLabour(
      cropData.area_acres,
      cropData.crop_name,
      assessment.harvestWindow,
    );
    const equipmentRec = this.estimatorEngine.recommendEquipment(
      cropData.crop_name,
      cropData.area_acres,
      qualityEstimate.grade,
    );
    const storageAdvice = this.estimatorEngine.recommendStorage(
      qualityEstimate.grade,
      lifecycle,
      weather,
    );

    // Aggregate all explanations
    const allExplanations = [
      ...assessment.explanations,
      yieldEstimate.explanation,
      qualityEstimate.explanation,
      labourEstimate.explanation,
      equipmentRec.explanation,
      storageAdvice.explanation,
    ];

    // Build result document
    const resultDoc = {
      farmerCropId,
      farmerProfileId: String(cropData.farmer_profile_id),
      cropName: cropData.crop_name,
      cropVariety: cropData.crop_variety ?? undefined,
      // Lifecycle
      daysElapsed: lifecycle.daysElapsed,
      daysRemaining: lifecycle.daysRemaining,
      growthPercentage: lifecycle.growthPercentage,
      lifecycleStage: lifecycle.lifecycleStage,
      // Readiness
      readinessScore: assessment.readinessScore,
      readinessStatus: assessment.readinessStatus,
      // Harvest window
      earliestHarvestDate: assessment.harvestWindow.earliestHarvestDate,
      optimalHarvestDate: assessment.harvestWindow.optimalHarvestDate,
      latestSafeHarvestDate: assessment.harvestWindow.latestSafeHarvestDate,
      // Scores
      harvestScore: assessment.harvestScore,
      confidenceScore: assessment.confidenceScore,
      // Risk
      riskLevel: assessment.riskLevel,
      riskFactors: assessment.riskFactors,
      mitigationRecommendations: assessment.mitigationRecommendations,
      // Delay
      delayDays: assessment.harvestDelay.delayDays,
      delayReasons: assessment.harvestDelay.delayReasons,
      delayActions: assessment.harvestDelay.suggestedActions,
      // Estimations
      expectedYieldKg: yieldEstimate.expectedYieldKg,
      yieldConfidence: yieldEstimate.yieldConfidence,
      qualityGrade: qualityEstimate.grade,
      qualityExplanation: qualityEstimate.explanation,
      // Labour & Equipment
      workersRequired: labourEstimate.workersRequired,
      harvestDurationDays: labourEstimate.harvestDurationDays,
      estimatedLabourHours: labourEstimate.estimatedLabourHours,
      equipmentRecommendations: equipmentRec.recommended,
      // Storage
      storageRecommendation: storageAdvice.recommendation,
      storageExplanation: storageAdvice.explanation,
      // Explainability
      explanations: allExplanations,
    };

    // Get previous assessment for change detection
    const previous = await this.mongoService.findByFarmerCropId(farmerCropId);
    const previousReadiness = previous?.readinessScore;

    // Persist to MongoDB
    await this.mongoService.upsertAssessment(farmerCropId, resultDoc as any);

    // Append history
    await this.mongoService.appendHistory({
      farmerCropId,
      farmerProfileId: resultDoc.farmerProfileId,
      cropName: cropData.crop_name,
      previousHarvestDate: previous?.optimalHarvestDate,
      newHarvestDate: assessment.harvestWindow.optimalHarvestDate,
      reason: previous ? 'scheduled-reassessment' : 'initial-assessment',
      readinessScore: assessment.readinessScore,
      harvestScore: assessment.harvestScore,
      confidenceScore: assessment.confidenceScore,
      riskLevel: assessment.riskLevel,
      delayDays: assessment.harvestDelay.delayDays,
      explanations: allExplanations,
      version: (previous?.version ?? 0) + 1,
    });

    // Publish events
    await this.eventPublisher.publishPredicted({
      farmerCropId,
      farmerProfileId: resultDoc.farmerProfileId,
      cropName: cropData.crop_name,
      readinessScore: assessment.readinessScore,
      harvestScore: assessment.harvestScore,
      confidenceScore: assessment.confidenceScore,
      optimalHarvestDate: assessment.harvestWindow.optimalHarvestDate,
    });

    if (previousReadiness !== undefined && assessment.readinessScore !== previousReadiness) {
      await this.eventPublisher.publishUpdated({
        farmerCropId,
        farmerProfileId: resultDoc.farmerProfileId,
        previousReadiness,
        newReadiness: assessment.readinessScore,
        reason: 'daily-reassessment',
      });
    }

    if (assessment.harvestDelay.hasDelay) {
      await this.eventPublisher.publishDelayed({
        farmerCropId,
        farmerProfileId: resultDoc.farmerProfileId,
        cropName: cropData.crop_name,
        delayDays: assessment.harvestDelay.delayDays,
        delayReasons: assessment.harvestDelay.delayReasons,
      });
    }

    if (['ready', 'almost-ready'].includes(assessment.readinessStatus)) {
      await this.eventPublisher.publishReadinessAlert({
        farmerCropId,
        farmerProfileId: resultDoc.farmerProfileId,
        cropName: cropData.crop_name,
        readinessStatus: assessment.readinessStatus,
        readinessScore: assessment.readinessScore,
        recommendation: assessment.mitigationRecommendations[0] ?? 'Prepare for harvest',
      });
    }

    this.logger.log(
      `Assessment complete | farmerCropId=${farmerCropId} readiness=${assessment.readinessScore}% score=${assessment.harvestScore} confidence=${assessment.confidenceScore}%`,
    );

    return resultDoc;
  }

  /** Fetch existing assessment (no recalculation) */
  async getAssessment(farmerCropId: string, userId: string): Promise<any> {
    await this.loadCropData(farmerCropId, userId); // ownership check
    const doc = await this.mongoService.findByFarmerCropId(farmerCropId);
    if (!doc) {
      // Run assessment on first access
      return this.assess(farmerCropId, userId);
    }
    return doc;
  }

  /** Fetch all active crop assessments for the authenticated user */
  async getMyAssessments(userId: string): Promise<any[]> {
    const profileId = await this.resolveProfileId(userId);
    if (!profileId) return [];
    return this.mongoService.findByFarmerProfileId(String(profileId));
  }

  /** Fetch readiness view only */
  async getReadiness(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      readinessScore: doc.readinessScore,
      readinessStatus: doc.readinessStatus,
      daysRemaining: doc.daysRemaining,
      lifecycleStage: doc.lifecycleStage,
      explanations: doc.explanations?.slice(0, 3) ?? [],
      assessedAt: doc.assessedAt,
    };
  }

  /** Fetch harvest window only */
  async getWindow(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      earliestHarvestDate: doc.earliestHarvestDate,
      optimalHarvestDate: doc.optimalHarvestDate,
      latestSafeHarvestDate: doc.latestSafeHarvestDate,
      delayDays: doc.delayDays,
      delayReasons: doc.delayReasons,
      explanations: doc.explanations?.slice(0, 2) ?? [],
    };
  }

  /** Fetch risk view only */
  async getRisk(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      riskLevel: doc.riskLevel,
      riskFactors: doc.riskFactors,
      mitigationRecommendations: doc.mitigationRecommendations,
      confidenceScore: doc.confidenceScore,
    };
  }

  /** Fetch history for a farmer crop */
  async getHistory(farmerCropId: string, userId: string, limit = 20) {
    await this.loadCropData(farmerCropId, userId); // ownership check
    return this.mongoService.findHistory(farmerCropId, limit);
  }

  /** Fetch estimate (yield, quality, labour, equipment, storage) */
  async getEstimate(farmerCropId: string, userId: string) {
    const doc = await this.getAssessment(farmerCropId, userId);
    return {
      farmerCropId,
      cropName: doc.cropName,
      expectedYieldKg: doc.expectedYieldKg,
      yieldConfidence: doc.yieldConfidence,
      qualityGrade: doc.qualityGrade,
      qualityExplanation: doc.qualityExplanation,
      workersRequired: doc.workersRequired,
      harvestDurationDays: doc.harvestDurationDays,
      estimatedLabourHours: doc.estimatedLabourHours,
      equipmentRecommendations: doc.equipmentRecommendations,
      storageRecommendation: doc.storageRecommendation,
      storageExplanation: doc.storageExplanation,
    };
  }

  /** Fetch analytics from MongoDB */
  async getAnalytics(regionLevel: string, regionName?: string, periodType?: string, limit?: number) {
    return this.mongoService.findAnalytics(regionLevel, regionName, periodType, limit);
  }

  /** Fetch regional summary */
  async getRegional(level: string, name: string) {
    const validLevels = ['village', 'taluk', 'district', 'state'];
    if (!validLevels.includes(level)) {
      throw new BadRequestException(`regionLevel must be one of: ${validLevels.join(', ')}`);
    }
    return this.regionalService.getRegionalSummary(level as any, name);
  }

  /** Trigger manual bulk reassessment (also called by scheduler job) */
  async runBulkAssessment(): Promise<{ assessed: number; failed: number }> {
    this.logger.log('Bulk harvest assessment started');
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
      } catch (err: any) {
        failed++;
        this.logger.warn(`Assessment failed for farmerCropId=${row.farmer_crop_id}: ${err?.message}`);
      }
    }

    this.logger.log(`Bulk assessment complete | assessed=${assessed} failed=${failed}`);
    return { assessed, failed };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

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
         c.crop_name,
         c.duration_days,
         c.ideal_temperature_min,
         c.ideal_temperature_max,
         c.water_requirement,
         flp.area_acres,
         fp.id AS farmer_profile_id,
         fp.user_id,
         fp.district,
         fp.state
       FROM farmer_crops          fc
       JOIN crops                 c   ON c.id   = fc.crop_id
       JOIN farmer_land_parcels   flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles       fp  ON fp.id  = flp.farmer_profile_id
       JOIN users                 u   ON u.id   = fp.user_id
       WHERE fc.id = $1 AND u.id = $2`,
      [farmerCropId, userId],
    );
    return rows[0] ?? null;
  }

  private async buildWeatherContext(parcelId: string): Promise<WeatherContext> {
    try {
      const rows = await this.dataSource.query(
        `SELECT temperature, humidity, rainfall, weather_condition, wind_speed
         FROM weather_history
         WHERE location_id IN (
           SELECT CONCAT(
             ROUND(CAST(ST_Y(location::geometry) AS NUMERIC), 4)::text, '_',
             ROUND(CAST(ST_X(location::geometry) AS NUMERIC), 4)::text
           )
           FROM farmer_land_parcels WHERE id = $1
         )
         ORDER BY timestamp DESC LIMIT 1`,
        [parcelId],
      );

      if (!rows.length) return this.defaultWeatherContext();

      const w = rows[0];
      const temp = parseFloat(w.temperature ?? '25');
      const rain = parseFloat(w.rainfall ?? '0');

      return {
        currentTemperature: temp,
        currentHumidity: parseFloat(w.humidity ?? '60'),
        currentRainfall: rain,
        weatherCondition: w.weather_condition ?? '',
        hasRainForecast: rain > 5,
        hasHeatStress: temp > 38,
        hasColdStress: temp < 10,
        hasFloodRisk: rain > 50,
        forecastRainProbability: rain > 5 ? 70 : 20,
        forecastTemperature: temp,
      };
    } catch {
      return this.defaultWeatherContext();
    }
  }

  private defaultWeatherContext(): WeatherContext {
    return {
      hasRainForecast: false,
      hasHeatStress: false,
      hasColdStress: false,
      hasFloodRisk: false,
      forecastRainProbability: 20,
    };
  }

  private async buildActivityContext(farmerCropId: string): Promise<ActivityContext> {
    try {
      const rows = await this.dataSource.query(
        `SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) AS completed,
           SUM(CASE WHEN NOT is_completed THEN 1 ELSE 0 END) AS pending,
           SUM(CASE WHEN NOT is_completed AND event_date < NOW() THEN 1 ELSE 0 END) AS overdue,
           SUM(CASE WHEN task_name ILIKE '%irrigat%' AND NOT is_completed AND event_date < NOW() THEN 1 ELSE 0 END) AS late_irrigation,
           SUM(CASE WHEN task_name ILIKE '%fertiliz%' AND NOT is_completed AND event_date < NOW() THEN 1 ELSE 0 END) AS late_fertilizer
         FROM calendar_events
         WHERE farmer_crop_id = $1`,
        [farmerCropId],
      );
      const r = rows[0];
      const total = parseInt(r.total ?? '0', 10);
      const completed = parseInt(r.completed ?? '0', 10);
      const pending = parseInt(r.pending ?? '0', 10);
      const overdue = parseInt(r.overdue ?? '0', 10);
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

      return {
        totalEvents: total,
        completedEvents: completed,
        pendingEvents: pending,
        overduePendingEvents: overdue,
        completionRate,
        hasLateIrrigation: parseInt(r.late_irrigation ?? '0', 10) > 0,
        hasLateFertilizer: parseInt(r.late_fertilizer ?? '0', 10) > 0,
        hasMissedActivities: overdue > 0,
      };
    } catch {
      return {
        totalEvents: 0, completedEvents: 0, pendingEvents: 0,
        overduePendingEvents: 0, completionRate: 100,
        hasLateIrrigation: false, hasLateFertilizer: false, hasMissedActivities: false,
      };
    }
  }

  private async resolveProfileId(userId: string): Promise<string | null> {
    const rows = await this.dataSource.query(
      `SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    return rows[0]?.id ?? null;
  }
}
