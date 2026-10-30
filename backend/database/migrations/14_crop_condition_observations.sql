CREATE TABLE IF NOT EXISTS farmer_crop_conditions (
  id BIGSERIAL PRIMARY KEY,
  farmer_crop_id BIGINT NOT NULL REFERENCES farmer_crops(id) ON DELETE CASCADE,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  condition_label VARCHAR(120) NOT NULL,
  growth_stage VARCHAR(100),
  soil_moisture_percent NUMERIC(5,2) CHECK (soil_moisture_percent BETWEEN 0 AND 100),
  air_temperature_c NUMERIC(5,2) CHECK (air_temperature_c BETWEEN -30 AND 70),
  rainfall_mm NUMERIC(8,2) CHECK (rainfall_mm BETWEEN 0 AND 1000),
  irrigation_status VARCHAR(120),
  symptoms_and_signs TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmer_crop_conditions_recent
  ON farmer_crop_conditions (farmer_crop_id, observed_at DESC);
