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
