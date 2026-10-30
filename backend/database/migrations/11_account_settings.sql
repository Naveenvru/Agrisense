ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS user_settings (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(16) NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  accent_theme VARCHAR(16) NOT NULL DEFAULT 'farm' CHECK (accent_theme IN ('farm', 'ocean', 'sunrise')),
  units VARCHAR(16) NOT NULL DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  ai_assistance_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  personalized_recommendations_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  google_link_ticket_hash VARCHAR(64),
  google_link_ticket_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS google_link_ticket_hash VARCHAR(64);
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS google_link_ticket_expires_at TIMESTAMPTZ;

INSERT INTO user_settings(user_id)
SELECT id FROM users ON CONFLICT (user_id) DO NOTHING;
