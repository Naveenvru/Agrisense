-- Notification defaults are preferences only. External channel consent starts absent.
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  daily_digest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  market_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  weather_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  crop_reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  disease_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  system_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  delivery_time VARCHAR(5) NOT NULL DEFAULT '08:00',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
  preferred_language VARCHAR(10) NOT NULL DEFAULT 'en-kn',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (delivery_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
);

CREATE TABLE IF NOT EXISTS notification_consents (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(16) NOT NULL CHECK (channel IN ('whatsapp', 'sms')),
  consent_status VARCHAR(16) NOT NULL CHECK (consent_status IN ('granted', 'revoked')),
  consent_source VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_consents_latest ON notification_consents(user_id, channel, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(40) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  execution_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  retry_count INTEGER NOT NULL DEFAULT 0,
  idempotency_key VARCHAR(200) NOT NULL UNIQUE,
  attempts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_due ON notification_jobs(execution_status, scheduled_at);

CREATE TABLE IF NOT EXISTS notification_attempts (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT NOT NULL REFERENCES notification_jobs(id) ON DELETE CASCADE,
  channel VARCHAR(16) NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'in_app')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'delivered', 'failed')),
  provider_message_id VARCHAR(255),
  failure_reason TEXT,
  provider_response JSONB,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notification_attempts_job ON notification_attempts(job_id, attempted_at DESC);

INSERT INTO notification_preferences(user_id)
SELECT id FROM users ON CONFLICT (user_id) DO NOTHING;

