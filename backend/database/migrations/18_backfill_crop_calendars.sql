INSERT INTO calendar_events (
  farmer_crop_id, event_date, task_name, task_description,
  is_completed, generated_by_weather, generated_by_ai, source_condition_id
)
SELECT
  fc.id,
  fc.sowing_date + template.day_offset,
  template.task_name,
  template.task_description,
  FALSE,
  FALSE,
  FALSE,
  NULL
FROM farmer_crops fc
JOIN crop_calendar_templates template ON template.crop_id = fc.crop_id
WHERE fc.sowing_date IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM calendar_events existing
    WHERE existing.farmer_crop_id = fc.id
      AND existing.source_condition_id IS NULL
  );
