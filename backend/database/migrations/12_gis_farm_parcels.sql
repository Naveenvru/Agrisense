BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE farmer_land_parcels
  ADD COLUMN IF NOT EXISTS boundary_geom geometry(Polygon, 4326),
  ADD COLUMN IF NOT EXISTS centroid geography(Point, 4326),
  ADD COLUMN IF NOT EXISTS calculated_area_sqm NUMERIC(16, 2),
  ADD COLUMN IF NOT EXISTS calculated_area_acres NUMERIC(14, 4),
  ADD COLUMN IF NOT EXISTS calculated_area_hectares NUMERIC(14, 4),
  ADD COLUMN IF NOT EXISTS location_accuracy VARCHAR(24) NOT NULL DEFAULT 'approximate',
  ADD COLUMN IF NOT EXISTS village VARCHAR(160),
  ADD COLUMN IF NOT EXISTS taluk VARCHAR(160),
  ADD COLUMN IF NOT EXISTS district VARCHAR(160),
  ADD COLUMN IF NOT EXISTS state VARCHAR(100),
  ADD COLUMN IF NOT EXISTS pin_code VARCHAR(12),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS land_profile JSONB;

DO $$ BEGIN
  ALTER TABLE farmer_land_parcels
    ADD CONSTRAINT farmer_land_parcels_boundary_valid
    CHECK (boundary_geom IS NULL OR (ST_IsValid(boundary_geom) AND NOT ST_IsEmpty(boundary_geom)));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE farmer_land_parcels
    ADD CONSTRAINT farmer_land_parcels_calculated_area_positive
    CHECK (calculated_area_sqm IS NULL OR calculated_area_sqm > 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE farmer_land_parcels
    ADD CONSTRAINT farmer_land_parcels_location_accuracy_check
    CHECK (location_accuracy IN ('boundary', 'gps', 'approximate'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS farmer_land_parcels_boundary_gix
  ON farmer_land_parcels USING GIST (boundary_geom);
CREATE INDEX IF NOT EXISTS farmer_land_parcels_centroid_gix
  ON farmer_land_parcels USING GIST (centroid);

COMMIT;

-- Rollback:
-- DROP INDEX IF EXISTS farmer_land_parcels_boundary_gix;
-- DROP INDEX IF EXISTS farmer_land_parcels_centroid_gix;
-- ALTER TABLE farmer_land_parcels DROP CONSTRAINT IF EXISTS farmer_land_parcels_boundary_valid;
-- ALTER TABLE farmer_land_parcels DROP CONSTRAINT IF EXISTS farmer_land_parcels_calculated_area_positive;
-- ALTER TABLE farmer_land_parcels DROP CONSTRAINT IF EXISTS farmer_land_parcels_location_accuracy_check;
-- ALTER TABLE farmer_land_parcels DROP COLUMN IF EXISTS boundary_geom, DROP COLUMN IF EXISTS centroid,
--   DROP COLUMN IF EXISTS calculated_area_sqm, DROP COLUMN IF EXISTS calculated_area_acres,
--   DROP COLUMN IF EXISTS calculated_area_hectares, DROP COLUMN IF EXISTS location_accuracy,
--   DROP COLUMN IF EXISTS village, DROP COLUMN IF EXISTS taluk, DROP COLUMN IF EXISTS district,
--   DROP COLUMN IF EXISTS state, DROP COLUMN IF EXISTS pin_code, DROP COLUMN IF EXISTS description,
--   DROP COLUMN IF EXISTS land_profile;
