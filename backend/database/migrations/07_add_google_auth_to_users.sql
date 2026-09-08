-- Migration 07: Add Google Auth and email verification to users table

-- 1. Make password_hash NULLABLE to support Google-only users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Add google_id column with unique constraint
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- 3. Add auth_provider column
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';

-- 4. Add is_email_verified column
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;

-- 5. Add index on google_id for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
