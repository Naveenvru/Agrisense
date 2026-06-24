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
