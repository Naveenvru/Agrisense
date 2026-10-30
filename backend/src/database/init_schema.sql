-- ==============================================================================
-- AGRISENSE UNIFIED DATABASE SCHEMA V1.0 (FINAL FREEZE)
-- Includes all extensions, enums, tables, constraints, indexes, and seed data.
-- ==============================================================================

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ==============================================================================
-- 2. ENUMS
-- ==============================================================================
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE file_category AS ENUM ('disease_image', 'marketplace_image', 'knowledge_document');
CREATE TYPE document_type AS ENUM ('guide', 'government_scheme', 'research_paper');
CREATE TYPE chat_source AS ENUM ('faq', 'rag', 'llm');
CREATE TYPE prediction_type AS ENUM ('price_prediction', 'yield_prediction', 'disease_risk');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'expired');
CREATE TYPE crop_status AS ENUM ('active', 'harvested', 'failed');
CREATE TYPE treatment_type AS ENUM ('organic', 'chemical', 'preventive');
CREATE TYPE embedding_status_enum AS ENUM ('pending', 'processing', 'processed', 'failed');

-- ==============================================================================
-- 3. TABLES (With Final Additions Directly Integrated)
-- ==============================================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role user_role NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    village VARCHAR(255),
    total_land_area NUMERIC(10,2),
    primary_soil_type VARCHAR(100),
    primary_irrigation_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmer_land_parcels (
    id BIGSERIAL PRIMARY KEY,
    farmer_profile_id BIGINT NOT NULL,
    parcel_name VARCHAR(255),
    area_acres NUMERIC(10,2),
    soil_type VARCHAR(100),
    land_type VARCHAR(100),
    irrigation_type VARCHAR(100),
    location GEOGRAPHY(POINT, 4326),
      boundary_geom geometry(Polygon, 4326),
      centroid geography(Point, 4326),
      calculated_area_sqm NUMERIC(16, 2),
      calculated_area_acres NUMERIC(14, 4),
      calculated_area_hectares NUMERIC(14, 4),
      location_accuracy VARCHAR(24) NOT NULL DEFAULT 'approximate',
      village VARCHAR(160),
      taluk VARCHAR(160),
      district VARCHAR(160),
      state VARCHAR(100),
      pin_code VARCHAR(12),
      description TEXT,
      land_profile JSONB,
    additional_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crops (
    id BIGSERIAL PRIMARY KEY,
    crop_name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255),
    crop_category VARCHAR(100),
    season VARCHAR(100),
    duration_days INTEGER,
    water_requirement VARCHAR(255),
    ideal_temperature_min NUMERIC(5,2),
    ideal_temperature_max NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmer_crops (
    id BIGSERIAL PRIMARY KEY,
    parcel_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    crop_variety VARCHAR(255),              -- Added V1.0
    estimated_yield_kg NUMERIC(12,2),       -- Added V1.0
    actual_yield_kg NUMERIC(12,2),          -- Added V1.0
    sowing_date DATE,
    expected_harvest_date DATE,
    status crop_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crop_calendar_templates (
    id BIGSERIAL PRIMARY KEY,
    crop_id BIGINT NOT NULL,
    day_offset INTEGER NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    farmer_crop_id BIGINT NOT NULL,
    event_date DATE NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    generated_by_weather BOOLEAN DEFAULT FALSE,
    generated_by_ai BOOLEAN NOT NULL DEFAULT FALSE,
    source_condition_id VARCHAR(24),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_calendar_events_condition_source
    ON calendar_events (farmer_crop_id, source_condition_id)
    WHERE source_condition_id IS NOT NULL;

CREATE TABLE farmer_crop_conditions (
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
CREATE INDEX idx_farmer_crop_conditions_recent ON farmer_crop_conditions (farmer_crop_id, observed_at DESC);

CREATE TABLE files (
    id BIGSERIAL PRIMARY KEY,
    cid VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_category file_category,
    uploaded_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketplace_listings (
    id BIGSERIAL PRIMARY KEY,
    farmer_profile_id BIGINT NOT NULL,
    crop_id BIGINT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    expected_price NUMERIC(12,2) NOT NULL,
    description TEXT,
    status listing_status DEFAULT 'active',
    pickup_available BOOLEAN DEFAULT TRUE,  -- Added V1.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketplace_images (
    listing_id BIGINT NOT NULL,
    file_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (listing_id, file_id)
);

CREATE TABLE marketplace_transactions (
    id BIGSERIAL PRIMARY KEY,
    listing_id BIGINT,
    buyer_id BIGINT,
    seller_farmer_profile_id BIGINT,
    quantity NUMERIC(10,2) NOT NULL,
    agreed_price NUMERIC(12,2) NOT NULL,
    transaction_status VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE diseases (
    id BIGSERIAL PRIMARY KEY,
    crop_id BIGINT NOT NULL,
    disease_name VARCHAR(255) NOT NULL,
    description TEXT,
    symptoms TEXT,
    severity_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disease_treatments (
    id BIGSERIAL PRIMARY KEY,
    disease_id BIGINT NOT NULL,
    treatment_type treatment_type,
    treatment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disease_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_id BIGINT,
    disease_id BIGINT,
    prediction_model VARCHAR(100),
    confidence_score NUMERIC(5,2),
    processing_time_ms INTEGER,             -- Added V1.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE weather_locations (
    id BIGSERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE weather_history (
    id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    temperature NUMERIC(5,2),
    humidity NUMERIC(5,2),
    rainfall NUMERIC(8,2),
    wind_speed NUMERIC(5,2),
    weather_condition VARCHAR(100),
    recorded_at TIMESTAMP NOT NULL
);

CREATE TABLE market_price_history (
    id BIGSERIAL PRIMARY KEY,
    crop_id BIGINT NOT NULL,
    market_name VARCHAR(255),
    district VARCHAR(100),
    state VARCHAR(100),
    price NUMERIC(12,2) NOT NULL,
    recorded_date DATE NOT NULL
);

CREATE TABLE knowledge_documents (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT NOT NULL,
    crop_id BIGINT,
    title VARCHAR(255) NOT NULL,
    document_type document_type,
    embedding_status embedding_status_enum DEFAULT 'pending', -- Added V1.0
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    source chat_source,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_predictions (
    id BIGSERIAL PRIMARY KEY,
    crop_id BIGINT NOT NULL,
    prediction_type prediction_type,
    predicted_value NUMERIC(12,2),
    confidence_score NUMERIC(5,2),
    model_version VARCHAR(50),
    weather_snapshot JSONB,                 -- Added V1.0
    prediction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prediction_explanations (
    prediction_id BIGINT NOT NULL,
    factor_name VARCHAR(255) NOT NULL,
    impact_score NUMERIC(5,2),
    impact_direction VARCHAR(50),
    description TEXT,
    PRIMARY KEY (prediction_id, factor_name)
);

CREATE TABLE crop_recommendations (
    id BIGSERIAL PRIMARY KEY,
    farmer_profile_id BIGINT NOT NULL,
    location_id BIGINT,
    recommended_crop_id BIGINT NOT NULL,
    recommendation_score NUMERIC(5,2),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. CONSTRAINTS (Foreign Keys)
-- ==============================================================================
ALTER TABLE farmer_profiles ADD CONSTRAINT fk_farmer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE farmer_land_parcels ADD CONSTRAINT fk_parcel_farmer FOREIGN KEY (farmer_profile_id) REFERENCES farmer_profiles(id) ON DELETE CASCADE;
ALTER TABLE farmer_crops ADD CONSTRAINT fk_farmer_crops_parcel FOREIGN KEY (parcel_id) REFERENCES farmer_land_parcels(id) ON DELETE CASCADE;
ALTER TABLE farmer_crops ADD CONSTRAINT fk_farmer_crops_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE;
ALTER TABLE crop_calendar_templates ADD CONSTRAINT fk_template_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE;
ALTER TABLE calendar_events ADD CONSTRAINT fk_event_farmer_crop FOREIGN KEY (farmer_crop_id) REFERENCES farmer_crops(id) ON DELETE CASCADE;
ALTER TABLE files ADD CONSTRAINT fk_files_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE marketplace_listings ADD CONSTRAINT fk_listing_farmer FOREIGN KEY (farmer_profile_id) REFERENCES farmer_profiles(id) ON DELETE CASCADE;
ALTER TABLE marketplace_listings ADD CONSTRAINT fk_listing_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE;
ALTER TABLE marketplace_images ADD CONSTRAINT fk_marketplace_listing FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE CASCADE;
ALTER TABLE marketplace_images ADD CONSTRAINT fk_marketplace_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE;
ALTER TABLE marketplace_transactions ADD CONSTRAINT fk_transaction_listing FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE SET NULL;
ALTER TABLE marketplace_transactions ADD CONSTRAINT fk_transaction_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE marketplace_transactions ADD CONSTRAINT fk_transaction_seller FOREIGN KEY (seller_farmer_profile_id) REFERENCES farmer_profiles(id) ON DELETE SET NULL;
ALTER TABLE diseases ADD CONSTRAINT fk_disease_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE;
ALTER TABLE disease_treatments ADD CONSTRAINT fk_treatment_disease FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE;
ALTER TABLE disease_logs ADD CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE disease_logs ADD CONSTRAINT fk_log_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL;
ALTER TABLE disease_logs ADD CONSTRAINT fk_log_disease FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE SET NULL;
ALTER TABLE weather_history ADD CONSTRAINT fk_weather_location FOREIGN KEY (location_id) REFERENCES weather_locations(id) ON DELETE CASCADE;
ALTER TABLE market_price_history ADD CONSTRAINT fk_market_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE;
ALTER TABLE knowledge_documents ADD CONSTRAINT fk_doc_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE;
ALTER TABLE knowledge_documents ADD CONSTRAINT fk_doc_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL;
ALTER TABLE chat_history ADD CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ai_predictions ADD CONSTRAINT fk_prediction_crop FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE;
ALTER TABLE prediction_explanations ADD CONSTRAINT fk_explanation_prediction FOREIGN KEY (prediction_id) REFERENCES ai_predictions(id) ON DELETE CASCADE;
ALTER TABLE crop_recommendations ADD CONSTRAINT fk_recommendation_farmer FOREIGN KEY (farmer_profile_id) REFERENCES farmer_profiles(id) ON DELETE CASCADE;
ALTER TABLE crop_recommendations ADD CONSTRAINT fk_recommendation_location FOREIGN KEY (location_id) REFERENCES weather_locations(id) ON DELETE SET NULL;
ALTER TABLE crop_recommendations ADD CONSTRAINT fk_recommendation_crop FOREIGN KEY (recommended_crop_id) REFERENCES crops(id) ON DELETE CASCADE;

-- ==============================================================================
-- 5. INDEXES
-- ==============================================================================
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
CREATE UNIQUE INDEX idx_crops_name_unique ON crops(crop_name);
CREATE UNIQUE INDEX idx_farmer_profiles_user_unique ON farmer_profiles(user_id);

CREATE INDEX idx_farmer_parcels_location_gist ON farmer_land_parcels USING GIST (location);
CREATE INDEX farmer_land_parcels_boundary_gix ON farmer_land_parcels USING GIST (boundary_geom);
CREATE INDEX farmer_land_parcels_centroid_gix ON farmer_land_parcels USING GIST (centroid);
CREATE INDEX idx_weather_locations_gist ON weather_locations USING GIST (location);

CREATE INDEX idx_farmer_parcels_metadata_gin ON farmer_land_parcels USING GIN (additional_metadata);

CREATE INDEX idx_fk_farmer_profiles_user ON farmer_profiles(user_id);
CREATE INDEX idx_fk_farmer_parcels_farmer ON farmer_land_parcels(farmer_profile_id);
CREATE INDEX idx_fk_farmer_crops_parcel ON farmer_crops(parcel_id);
CREATE INDEX idx_fk_farmer_crops_crop ON farmer_crops(crop_id);
CREATE INDEX idx_fk_listings_farmer ON marketplace_listings(farmer_profile_id);
CREATE INDEX idx_fk_listings_crop ON marketplace_listings(crop_id);
CREATE INDEX idx_fk_transactions_listing ON marketplace_transactions(listing_id);
CREATE INDEX idx_fk_disease_logs_user ON disease_logs(user_id);
CREATE INDEX idx_fk_disease_logs_disease ON disease_logs(disease_id);
CREATE INDEX idx_fk_weather_history_location ON weather_history(location_id);
CREATE INDEX idx_fk_market_history_crop ON market_price_history(crop_id);
CREATE INDEX idx_fk_predictions_crop ON ai_predictions(crop_id);
CREATE INDEX idx_fk_chat_history_user ON chat_history(user_id);

CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);

-- ==============================================================================
-- 6. SEED DATA
-- ==============================================================================
INSERT INTO users (name, email, password_hash, phone_number, role, preferred_language) VALUES 
('Ravi Kumar', 'ravi@agrisense.test', 'hashed_pw_1', '+919876543210', 'farmer', 'hi'),
('Priya Sharma', 'priya@freshfoods.test', 'hashed_pw_2', '+919876543211', 'buyer', 'en');

INSERT INTO farmer_profiles (user_id, district, state, village, total_land_area, primary_soil_type, primary_irrigation_type) VALUES 
(1, 'Pune', 'Maharashtra', 'Wagholi', 15.5, 'Black Cotton', 'Drip');

INSERT INTO crops (crop_name, scientific_name, crop_category, season, duration_days, water_requirement, ideal_temperature_min, ideal_temperature_max) VALUES 
('Tomato', 'Solanum lycopersicum', 'Vegetable', 'Kharif', 90, 'Medium', 15.00, 30.00),
('Wheat', 'Triticum', 'Cereal', 'Rabi', 120, 'Low', 10.00, 25.00);

INSERT INTO crop_calendar_templates (crop_id, day_offset, task_name, task_description, priority)
SELECT c.id, t.day_offset, t.task_name, t.task_description, t.priority
FROM crops c
JOIN (VALUES
  ('Tomato', 0, 'Sowing', 'Sow tomato seeds in a nursery using the locally recommended seed rate.', 'High'),
  ('Tomato', 21, 'Transplanting', 'Transplant healthy seedlings to the prepared field when they are ready.', 'High'),
  ('Tomato', 35, 'Crop nutrition check', 'Review crop growth and follow locally recommended nutrient guidance.', 'Medium'),
  ('Tomato', 60, 'Weeding and plant support', 'Check weeds and plant support; record any crop stress observed.', 'Medium'),
  ('Tomato', 90, 'Harvest readiness check', 'Check fruit maturity and harvest according to local market and crop guidance.', 'High'),
  ('Wheat', 0, 'Sowing', 'Sow wheat using locally recommended seed and spacing guidance.', 'High'),
  ('Wheat', 21, 'Early crop and irrigation check', 'Inspect crop establishment and review irrigation needs for the field.', 'High'),
  ('Wheat', 45, 'Tillering stage check', 'Inspect tillering and crop condition; use local agronomy guidance for any inputs.', 'Medium'),
  ('Wheat', 120, 'Harvest readiness check', 'Check grain maturity and harvest timing with local crop guidance.', 'High')
) AS t(crop_name, day_offset, task_name, task_description, priority)
  ON lower(c.crop_name) = lower(t.crop_name);

INSERT INTO weather_locations (location_name, district, state, country, location) VALUES 
('Pune Central Station', 'Pune', 'Maharashtra', 'India', ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326));

INSERT INTO farmer_land_parcels (farmer_profile_id, parcel_name, area_acres, soil_type, land_type, irrigation_type, location, additional_metadata) VALUES 
(1, 'North Field', 5.0, 'Black Cotton', 'Flat', 'Drip', 
ST_SetSRID(ST_MakePoint(73.9856, 18.5808), 4326), 
'{"sensor_id": "SENS-8472", "soil_ph": 6.8, "has_borewell": true}'::jsonb);

INSERT INTO farmer_crops (parcel_id, crop_id, crop_variety, estimated_yield_kg, actual_yield_kg, sowing_date, expected_harvest_date, status) VALUES 
(1, 1, 'Pusa Ruby', 1200.00, NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active');

INSERT INTO calendar_events (farmer_crop_id, event_date, task_name, task_description, generated_by_ai)
SELECT fc.id, fc.sowing_date + template.day_offset, template.task_name, template.task_description, FALSE
FROM farmer_crops fc
JOIN crop_calendar_templates template ON template.crop_id = fc.crop_id
WHERE NOT EXISTS (SELECT 1 FROM calendar_events existing WHERE existing.farmer_crop_id = fc.id);

-- Notification preferences are initialized with outbound channels off until consent.
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE, sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE, daily_digest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  market_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE, weather_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  crop_reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE, disease_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  system_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  delivery_time VARCHAR(5) NOT NULL DEFAULT '08:00', timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
  preferred_language VARCHAR(10) NOT NULL DEFAULT 'en-kn', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (delivery_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
);
CREATE TABLE IF NOT EXISTS notification_consents (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(16) NOT NULL CHECK (channel IN ('whatsapp', 'sms')),
  consent_status VARCHAR(16) NOT NULL CHECK (consent_status IN ('granted', 'revoked')),
  consent_source VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_consents_latest ON notification_consents(user_id, channel, created_at DESC);
CREATE TABLE IF NOT EXISTS notification_jobs (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(40) NOT NULL, scheduled_at TIMESTAMPTZ NOT NULL,
  execution_status VARCHAR(20) NOT NULL DEFAULT 'pending', retry_count INTEGER NOT NULL DEFAULT 0,
  idempotency_key VARCHAR(200) NOT NULL UNIQUE, attempts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_due ON notification_jobs(execution_status, scheduled_at);
CREATE TABLE IF NOT EXISTS notification_attempts (
  id BIGSERIAL PRIMARY KEY, job_id BIGINT NOT NULL REFERENCES notification_jobs(id) ON DELETE CASCADE,
  channel VARCHAR(16) NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'in_app')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'delivered', 'failed')),
  provider_message_id VARCHAR(255), failure_reason TEXT, provider_response JSONB,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_attempts_job ON notification_attempts(job_id, attempted_at DESC);
INSERT INTO notification_preferences(user_id) SELECT id FROM users ON CONFLICT (user_id) DO NOTHING;
CREATE TABLE IF NOT EXISTS decision_traces (
  id BIGSERIAL PRIMARY KEY, trace_id VARCHAR(36) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, query TEXT NOT NULL,
  status VARCHAR(32) NOT NULL CHECK (status IN ('completed', 'insufficient_evidence', 'unsupported', 'failed')),
  result JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decision_traces_user_created ON decision_traces(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS generated_reports (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(40) NOT NULL CHECK (report_type IN ('farm_performance', 'market_intelligence', 'weather', 'crop_activity', 'ai_analysis')),
  report_title VARCHAR(200) NOT NULL, period_start DATE NOT NULL, period_end DATE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, pdf_content BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), CHECK (period_start <= period_end)
);
CREATE INDEX IF NOT EXISTS idx_generated_reports_user_created ON generated_reports(user_id, created_at DESC);

-- Persisted appearance, accessibility, locale, and AI consent settings.
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS user_settings (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(16) NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  accent_theme VARCHAR(16) NOT NULL DEFAULT 'farm' CHECK (accent_theme IN ('farm', 'ocean', 'sunrise')),
  units VARCHAR(16) NOT NULL DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  ai_assistance_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  personalized_recommendations_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  google_link_ticket_hash VARCHAR(64), google_link_ticket_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO user_settings(user_id) SELECT id FROM users ON CONFLICT (user_id) DO NOTHING;

-- Satellite-derived measurements only; no mock observations are seeded.
CREATE TABLE IF NOT EXISTS satellite_processing_jobs (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT NOT NULL REFERENCES farmer_land_parcels(id) ON DELETE CASCADE,
  requested_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL DEFAULT 'sentinel_hub',
  status VARCHAR(32) NOT NULL DEFAULT 'queued',
  idempotency_key VARCHAR(64) NOT NULL UNIQUE,
  date_from DATE NOT NULL, date_to DATE NOT NULL,
  max_cloud_coverage SMALLINT NOT NULL DEFAULT 30 CHECK (max_cloud_coverage BETWEEN 0 AND 100),
  attempt_count SMALLINT NOT NULL DEFAULT 0,
  error_code VARCHAR(60), error_message TEXT, provider_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ,
  CHECK (date_from <= date_to),
  CHECK (status IN ('queued','processing','complete','no_data','quality_insufficient','blocked_configuration','failed'))
);
CREATE INDEX IF NOT EXISTS satellite_jobs_parcel_created_idx ON satellite_processing_jobs(parcel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS satellite_jobs_queue_idx ON satellite_processing_jobs(status, created_at) WHERE status = 'queued';
CREATE TABLE IF NOT EXISTS satellite_vegetation_observations (
  id BIGSERIAL PRIMARY KEY,
  parcel_id BIGINT NOT NULL REFERENCES farmer_land_parcels(id) ON DELETE CASCADE,
  job_id BIGINT NOT NULL UNIQUE REFERENCES satellite_processing_jobs(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL, satellite VARCHAR(40) NOT NULL DEFAULT 'Sentinel-2 L2A',
  acquisition_date DATE NOT NULL, period_start TIMESTAMPTZ NOT NULL, period_end TIMESTAMPTZ NOT NULL,
  mean_ndvi NUMERIC(8,6) NOT NULL CHECK (mean_ndvi BETWEEN -1 AND 1),
  min_ndvi NUMERIC(8,6) NOT NULL CHECK (min_ndvi BETWEEN -1 AND 1),
  max_ndvi NUMERIC(8,6) NOT NULL CHECK (max_ndvi BETWEEN -1 AND 1),
  cloud_coverage_percent NUMERIC(5,2) CHECK (cloud_coverage_percent BETWEEN 0 AND 100),
  valid_pixel_count BIGINT, source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (min_ndvi <= mean_ndvi AND mean_ndvi <= max_ndvi)
);
CREATE INDEX IF NOT EXISTS satellite_observations_parcel_date_idx ON satellite_vegetation_observations(parcel_id, acquisition_date DESC);
