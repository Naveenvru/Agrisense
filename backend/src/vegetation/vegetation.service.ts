import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';

const NDVI_EVALSCRIPT = `//VERSION=3
function setup() {
  return { input: [{ bands: ["B04", "B08", "SCL", "dataMask"] }], output: [
    { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
    { id: "cloud", bands: 1, sampleType: "FLOAT32" },
    { id: "dataMask", bands: 2 }
  ] };
}
function evaluatePixel(s) {
  const cloudy = [3, 8, 9, 10, 11].includes(s.SCL);
  const hasData = s.dataMask === 1;
  const denominator = s.B08 + s.B04;
  const validNdvi = hasData && !cloudy && denominator !== 0;
  const ndvi = denominator === 0 ? 0 : (s.B08 - s.B04) / denominator;
  return { ndvi: [ndvi], cloud: [cloudy ? 1 : 0], dataMask: [validNdvi ? 1 : 0, hasData ? 1 : 0] };
}`;

@Injectable()
export class VegetationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(VegetationService.name);
  private worker: NodeJS.Timeout | undefined;
  private processing = false;
  private providerToken: string | undefined;
  private providerTokenExpiresAt = 0;

  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    this.worker = setInterval(() => void this.processNext(), 15_000);
    this.worker.unref();
    void this.processNext();
  }

  onModuleDestroy() {
    if (this.worker) clearInterval(this.worker);
  }

  async createJob(userId: string, parcelId: string, request: { dateFrom?: string; dateTo?: string; maxCloudCoverage?: number }) {
    const today = new Date().toISOString().slice(0, 10);
    const dateTo = request.dateTo || today;
    const dateFrom = request.dateFrom || new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);
    const cloudLimit = request.maxCloudCoverage ?? 30;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(dateTo) || dateFrom > dateTo || dateTo > today) {
      throw new BadRequestException('Use valid dates in YYYY-MM-DD format; dateTo cannot be in the future.');
    }
    if (Date.parse(`${dateTo}T00:00:00Z`) - Date.parse(`${dateFrom}T00:00:00Z`) > 365 * 86400_000) {
      throw new BadRequestException('A single vegetation request can cover at most 366 calendar days.');
    }
    if (!Number.isInteger(cloudLimit) || cloudLimit < 0 || cloudLimit > 100) {
      throw new BadRequestException('maxCloudCoverage must be an integer from 0 to 100.');
    }
    const parcels = await this.dataSource.query(
      `SELECT p.id, ST_AsGeoJSON(p.boundary_geom)::json AS boundary
       FROM farmer_land_parcels p JOIN farmer_profiles f ON f.id = p.farmer_profile_id
       WHERE p.id = $1 AND f.user_id = $2`, [parcelId, userId],
    );
    if (!parcels.length) throw new NotFoundException('Farm parcel not found.');
    if (!parcels[0].boundary) throw new ConflictException('Draw and save a farm boundary before requesting satellite monitoring.');

    const idempotencyKey = createHash('sha256').update(`${parcelId}:${dateFrom}:${dateTo}:${cloudLimit}`).digest('hex');
    const rows = await this.dataSource.query(
      `INSERT INTO satellite_processing_jobs (parcel_id, requested_by, idempotency_key, date_from, date_to, max_cloud_coverage)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (idempotency_key) DO UPDATE SET idempotency_key = EXCLUDED.idempotency_key
       RETURNING id, status, provider, date_from AS "dateFrom", date_to AS "dateTo", created_at AS "createdAt"`,
      [parcelId, userId, idempotencyKey, dateFrom, dateTo, cloudLimit],
    );
    return rows[0];
  }

  async getJob(userId: string, jobId: string) {
    const rows = await this.dataSource.query(
      `SELECT j.id, j.parcel_id AS "parcelId", j.provider, j.status, j.date_from AS "dateFrom", j.date_to AS "dateTo",
        j.max_cloud_coverage AS "maxCloudCoverage", j.attempt_count AS "attemptCount", j.error_code AS "errorCode",
        j.error_message AS "errorMessage", j.created_at AS "createdAt", j.started_at AS "startedAt", j.completed_at AS "completedAt"
       FROM satellite_processing_jobs j JOIN farmer_land_parcels p ON p.id = j.parcel_id
       JOIN farmer_profiles f ON f.id = p.farmer_profile_id
       WHERE j.id = $1 AND f.user_id = $2`, [jobId, userId],
    );
    if (!rows.length) throw new NotFoundException('Vegetation processing job not found.');
    return rows[0];
  }

  async retryJob(userId: string, jobId: string) {
    const rows = await this.dataSource.query(
      `UPDATE satellite_processing_jobs j SET status = 'queued', error_code = NULL, error_message = NULL,
          provider_response = NULL, started_at = NULL, completed_at = NULL
       FROM farmer_land_parcels p JOIN farmer_profiles f ON f.id = p.farmer_profile_id
       WHERE j.id = $1 AND j.parcel_id = p.id AND f.user_id = $2
         AND j.status IN ('failed','no_data','quality_insufficient','blocked_configuration')
       RETURNING j.id, j.status, j.provider, j.date_from AS "dateFrom", j.date_to AS "dateTo", j.created_at AS "createdAt"`,
      [jobId, userId],
    );
    if (rows.length) return rows[0];
    const current = await this.getJob(userId, jobId);
    if (['queued', 'processing'].includes(current.status)) return current;
    throw new ConflictException('Only an unfinished or retryable satellite job can be retried.');
  }

  async getParcelData(userId: string, parcelId: string) {
    const parcels = await this.dataSource.query(
      `SELECT p.id FROM farmer_land_parcels p JOIN farmer_profiles f ON f.id = p.farmer_profile_id
       WHERE p.id = $1 AND f.user_id = $2`, [parcelId, userId],
    );
    if (!parcels.length) throw new NotFoundException('Farm parcel not found.');
    const [observations, jobs] = await Promise.all([
      this.dataSource.query(
        `SELECT id, parcel_id AS "parcelId", provider, satellite, acquisition_date AS "acquisitionDate",
          period_start AS "periodStart", period_end AS "periodEnd", mean_ndvi AS "meanNdvi", min_ndvi AS "minNdvi",
          max_ndvi AS "maxNdvi", cloud_coverage_percent AS "cloudCoveragePercent", valid_pixel_count AS "validPixelCount",
          source_metadata AS "sourceMetadata"
         FROM satellite_vegetation_observations WHERE parcel_id = $1 ORDER BY acquisition_date DESC`, [parcelId],
      ),
      this.dataSource.query(
        `SELECT id, status, date_from AS "dateFrom", date_to AS "dateTo", error_code AS "errorCode", error_message AS "errorMessage",
          created_at AS "createdAt", completed_at AS "completedAt"
         FROM satellite_processing_jobs WHERE parcel_id = $1 ORDER BY created_at DESC LIMIT 20`, [parcelId],
      ),
    ]);
    return { observations, jobs, providerConfigured: Boolean(process.env.SENTINEL_HUB_CLIENT_ID && process.env.SENTINEL_HUB_CLIENT_SECRET) };
  }

  private async processNext() {
    if (this.processing) return;
    this.processing = true;
    try {
      await this.dataSource.query(
        `UPDATE satellite_processing_jobs SET status = 'queued', started_at = NULL
         WHERE status = 'processing' AND started_at < NOW() - INTERVAL '10 minutes'`,
      );
      const claimed = await this.dataSource.query(
        `UPDATE satellite_processing_jobs SET status = 'processing', attempt_count = attempt_count + 1, started_at = NOW()
         WHERE id = (SELECT id FROM satellite_processing_jobs WHERE status = 'queued' ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1)
         RETURNING id, parcel_id, date_from, date_to, max_cloud_coverage`,
      );
      if (!claimed.length) return;
      await this.processJob(claimed[0]);
    } catch (error) {
      this.logger.error('Satellite job worker pass failed', error instanceof Error ? error.stack : undefined);
    } finally {
      this.processing = false;
    }
  }

  private async processJob(job: any) {
    const clientId = process.env.SENTINEL_HUB_CLIENT_ID;
    const clientSecret = process.env.SENTINEL_HUB_CLIENT_SECRET;
    const tokenUrl = process.env.SENTINEL_HUB_TOKEN_URL || 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
    const apiUrl = process.env.SENTINEL_HUB_STATISTICS_URL || 'https://sh.dataspace.copernicus.eu/statistics/v1';
    if (!clientId || !clientSecret) {
      await this.finishJob(job.id, 'blocked_configuration', 'PROVIDER_CREDENTIALS_MISSING', 'Set SENTINEL_HUB_CLIENT_ID and SENTINEL_HUB_CLIENT_SECRET to enable Sentinel Hub processing.');
      return;
    }
    try {
      const parcelRows = await this.dataSource.query('SELECT ST_AsGeoJSON(boundary_geom)::json AS boundary FROM farmer_land_parcels WHERE id = $1', [job.parcel_id]);
      if (!parcelRows[0]?.boundary) throw new Error('BOUNDARY_REMOVED');
      const accessToken = await this.getProviderToken(clientId, clientSecret, tokenUrl);
      const from = `${String(job.date_from).slice(0, 10)}T00:00:00Z`;
      const exclusiveEnd = new Date(`${String(job.date_to).slice(0, 10)}T00:00:00Z`);
      exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
      const to = exclusiveEnd.toISOString().replace('.000Z', 'Z');
      const payload = {
        input: { bounds: { geometry: parcelRows[0].boundary }, data: [{ type: 'sentinel-2-l2a', dataFilter: { maxCloudCoverage: Number(job.max_cloud_coverage), mosaickingOrder: 'leastCC' }, processing: { upsampling: 'NEAREST', downsampling: 'NEAREST' } }] },
        aggregation: { timeRange: { from, to }, aggregationInterval: { of: 'P1D' }, resx: 10, resy: 10,
          evalscript: NDVI_EVALSCRIPT },
      };
      const response = await fetch(apiUrl, {
        method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(90_000),
      });
      if (!response.ok) throw new Error(`STATISTICS_HTTP_${response.status}`);
      const providerResult: any = await response.json();
      const periods = Array.isArray(providerResult.data) ? providerResult.data : [];
      const candidates = periods.map((period: any) => {
        const ndvi = period.outputs?.ndvi?.bands?.B0?.stats;
        const cloud = period.outputs?.cloud?.bands?.B0?.stats;
        return { period, ndvi, cloud };
      }).filter(({ ndvi, cloud }: any) => Number(ndvi?.sampleCount) > 0 && [ndvi?.mean, ndvi?.min, ndvi?.max].every((value: any) => Number.isFinite(Number(value))) && Number.isFinite(Number(cloud?.mean)));
      candidates.sort((left: any, right: any) => String(left.period.interval?.to || '').localeCompare(String(right.period.interval?.to || '')));
      const found = candidates[candidates.length - 1];
      if (!found) {
        await this.finishJob(job.id, 'no_data', 'NO_VALID_PIXELS', 'No valid, cloud-masked Sentinel-2 pixels were available in the selected period.');
        return;
      }
      const mean = Number(found.ndvi.mean);
      const min = Number(found.ndvi.min);
      const max = Number(found.ndvi.max);
      if ([mean, min, max].some((value) => value < -1 || value > 1) || min > mean || mean > max) throw new Error('INVALID_NDVI_RESPONSE');
      const cloudPercent = Math.max(0, Math.min(100, Number(found.cloud.mean) * 100));
      if (cloudPercent > Number(job.max_cloud_coverage)) {
        await this.finishJob(job.id, 'quality_insufficient', 'PIXEL_CLOUD_LIMIT', `Cloud and shadow pixels were ${cloudPercent.toFixed(1)}%; this exceeds the configured ${job.max_cloud_coverage}% limit. No vegetation observation was saved.`);
        return;
      }
      const start = String(found.period.interval?.from || from);
      const end = String(found.period.interval?.to || to);
      const acquisitionDate = start.slice(0, 10);
      await this.dataSource.transaction(async (manager) => {
        await manager.query(
          `INSERT INTO satellite_vegetation_observations
            (parcel_id, job_id, provider, satellite, acquisition_date, period_start, period_end, mean_ndvi, min_ndvi, max_ndvi, cloud_coverage_percent, valid_pixel_count, source_metadata)
           VALUES ($1,$2,'sentinel_hub','Sentinel-2 L2A',$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb)`,
          [job.parcel_id, job.id, acquisitionDate, start, end, mean, min, max, cloudPercent, Number(found.ndvi.sampleCount), JSON.stringify({ sampleResolutionMeters: 10, cloudMask: 'Sentinel-2 SCL classes 3, 8, 9, 10, 11; dataMask', responseInterval: found.period.interval })],
        );
        await manager.query(`UPDATE satellite_processing_jobs SET status = 'complete', provider_response = $2::jsonb, completed_at = NOW(), error_code = NULL, error_message = NULL WHERE id = $1`,
          [job.id, JSON.stringify({ dataPeriods: periods.length, selectedInterval: found.period.interval })]);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Provider request failed.';
      const code = message === 'BOUNDARY_REMOVED' ? 'BOUNDARY_REMOVED' : message.split('_').slice(0, 2).join('_').slice(0, 60);
      await this.finishJob(job.id, 'failed', code, `Sentinel Hub processing failed (${code}). Check provider configuration and retry later.`);
      this.logger.warn(`Satellite job ${job.id} failed: ${code}`);
    }
  }

  private async getProviderToken(clientId: string, clientSecret: string, tokenUrl: string) {
    if (this.providerToken && this.providerTokenExpiresAt > Date.now() + 60_000) return this.providerToken;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!tokenResponse.ok) throw new Error(`AUTH_HTTP_${tokenResponse.status}`);
    const token = await tokenResponse.json() as { access_token?: string; expires_in?: number };
    if (!token.access_token) throw new Error('AUTH_TOKEN_MISSING');
    this.providerToken = token.access_token;
    this.providerTokenExpiresAt = Date.now() + Math.max(60, Number(token.expires_in) || 300) * 1000;
    return this.providerToken;
  }

  private async finishJob(jobId: string, status: string, code: string, message: string) {
    await this.dataSource.query(
      `UPDATE satellite_processing_jobs SET status = $2, error_code = $3, error_message = $4, completed_at = NOW() WHERE id = $1`,
      [jobId, status, code, message],
    );
  }
}
