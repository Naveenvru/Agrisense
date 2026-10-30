CREATE TABLE IF NOT EXISTS generated_reports (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(40) NOT NULL CHECK (report_type IN ('farm_performance', 'market_intelligence', 'weather', 'crop_activity', 'ai_analysis')),
  report_title VARCHAR(200) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  pdf_content BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (period_start <= period_end)
);
CREATE INDEX IF NOT EXISTS idx_generated_reports_user_created ON generated_reports(user_id, created_at DESC);
