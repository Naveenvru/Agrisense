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

INSERT INTO crop_calendar_templates (crop_id, day_offset, task_name, task_description, priority) VALUES 
(1, 0, 'Sowing', 'Sow the tomato seeds in nursery beds.', 'High'),
(1, 21, 'Transplanting', 'Transplant seedlings to the main field.', 'High'),
(1, 35, 'First Fertilization', 'Apply NPK fertilizer as top dressing.', 'Medium'),
(1, 60, 'Weeding & Staking', 'Remove weeds and provide support to plants.', 'Medium'),
(1, 90, 'First Harvest', 'Begin harvesting ripe tomatoes.', 'High'),
(2, 0, 'Sowing', 'Sow wheat seeds directly in the field.', 'High'),
(2, 21, 'First Irrigation', 'Crown Root Initiation stage - critical for yield.', 'High'),
(2, 45, 'Tillering Stage Irrigation', 'Apply water and top dressing of urea.', 'Medium'),
(2, 120, 'Harvesting', 'Harvest when grains are hard and moisture is low.', 'High');

