CREATE TABLE IF NOT EXISTS decision_traces (
  id BIGSERIAL PRIMARY KEY,
  trace_id VARCHAR(36) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  status VARCHAR(32) NOT NULL CHECK (status IN ('completed', 'insufficient_evidence', 'unsupported', 'failed')),
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_decision_traces_user_created ON decision_traces(user_id, created_at DESC);
