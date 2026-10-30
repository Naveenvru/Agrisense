BEGIN;

CREATE TABLE IF NOT EXISTS satellite_processing_jobs (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT NOT NULL REFERENCES farmer_land_parcels(id) ON DELETE CASCADE,
  requested_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL DEFAULT 'sentinel_hub',
  status VARCHAR(32) NOT NULL DEFAULT 'queued',
  idempotency_key VARCHAR(64) NOT NULL UNIQUE,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  max_cloud_coverage SMALLINT NOT NULL DEFAULT 30 CHECK (max_cloud_coverage BETWEEN 0 AND 100),
  attempt_count SMALLINT NOT NULL DEFAULT 0,
  error_code VARCHAR(60),
  error_message TEXT,
  provider_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  CHECK (date_from <= date_to),
  CHECK (status IN ('queued', 'processing', 'complete', 'no_data', 'quality_insufficient', 'blocked_configuration', 'failed'))
);

CREATE INDEX IF NOT EXISTS satellite_jobs_parcel_created_idx ON satellite_processing_jobs(parcel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS satellite_jobs_queue_idx ON satellite_processing_jobs(status, created_at) WHERE status = 'queued';

CREATE TABLE IF NOT EXISTS satellite_vegetation_observations (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT NOT NULL REFERENCES farmer_land_parcels(id) ON DELETE CASCADE,
  job_id BIGINT NOT NULL UNIQUE REFERENCES satellite_processing_jobs(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL,
  satellite VARCHAR(40) NOT NULL DEFAULT 'Sentinel-2 L2A',
  acquisition_date DATE NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  mean_ndvi NUMERIC(8,6) NOT NULL CHECK (mean_ndvi BETWEEN -1 AND 1),
  min_ndvi NUMERIC(8,6) NOT NULL CHECK (min_ndvi BETWEEN -1 AND 1),
  max_ndvi NUMERIC(8,6) NOT NULL CHECK (max_ndvi BETWEEN -1 AND 1),
  cloud_coverage_percent NUMERIC(5,2) CHECK (cloud_coverage_percent BETWEEN 0 AND 100),
  valid_pixel_count BIGINT,
  source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (min_ndvi <= mean_ndvi AND mean_ndvi <= max_ndvi)
);

CREATE INDEX IF NOT EXISTS satellite_observations_parcel_date_idx
  ON satellite_vegetation_observations(parcel_id, acquisition_date DESC);

COMMIT;

-- Rollback:
-- DROP TABLE IF EXISTS satellite_vegetation_observations;
-- DROP TABLE IF EXISTS satellite_processing_jobs;
