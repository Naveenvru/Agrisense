ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS source_condition_id VARCHAR(24);

CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_events_condition_source
  ON calendar_events (farmer_crop_id, source_condition_id)
  WHERE source_condition_id IS NOT NULL;
