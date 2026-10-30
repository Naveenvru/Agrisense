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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

INSERT INTO weather_locations (location_name, district, state, country, location) VALUES 
('Pune Central Station', 'Pune', 'Maharashtra', 'India', ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326));

INSERT INTO farmer_land_parcels (farmer_profile_id, parcel_name, area_acres, soil_type, land_type, irrigation_type, location, additional_metadata) VALUES 
(1, 'North Field', 5.0, 'Black Cotton', 'Flat', 'Drip', 
ST_SetSRID(ST_MakePoint(73.9856, 18.5808), 4326), 
'{"sensor_id": "SENS-8472", "soil_ph": 6.8, "has_borewell": true}'::jsonb);

INSERT INTO farmer_crops (parcel_id, crop_id, crop_variety, estimated_yield_kg, actual_yield_kg, sowing_date, expected_harvest_date, status) VALUES 
(1, 1, 'Pusa Ruby', 1200.00, NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active');

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
