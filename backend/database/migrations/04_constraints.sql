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
