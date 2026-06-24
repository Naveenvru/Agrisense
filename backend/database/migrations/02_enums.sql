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
