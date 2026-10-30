INSERT INTO crop_calendar_templates (crop_id, day_offset, task_name, task_description, priority)
SELECT c.id, t.day_offset, t.task_name, t.task_description, t.priority
FROM crops c
JOIN (VALUES
  ('Tomato', 0, 'Sowing', 'Sow tomato seeds in a nursery using the locally recommended seed rate.', 'High'),
  ('Tomato', 21, 'Transplanting', 'Transplant healthy seedlings to the prepared field when they are ready.', 'High'),
  ('Tomato', 35, 'Crop nutrition check', 'Review crop growth and follow locally recommended nutrient guidance.', 'Medium'),
  ('Tomato', 60, 'Weeding and plant support', 'Check weeds and plant support; record any crop stress observed.', 'Medium'),
  ('Tomato', 90, 'Harvest readiness check', 'Check fruit maturity and harvest according to local market and crop guidance.', 'High'),
  ('Wheat', 0, 'Sowing', 'Sow wheat using locally recommended seed and spacing guidance.', 'High'),
  ('Wheat', 21, 'Early crop and irrigation check', 'Inspect crop establishment and review irrigation needs for the field.', 'High'),
  ('Wheat', 45, 'Tillering stage check', 'Inspect tillering and crop condition; use local agronomy guidance for any inputs.', 'Medium'),
  ('Wheat', 120, 'Harvest readiness check', 'Check grain maturity and harvest timing with local crop guidance.', 'High')
) AS t(crop_name, day_offset, task_name, task_description, priority)
  ON lower(c.crop_name) = lower(t.crop_name)
WHERE NOT EXISTS (
  SELECT 1 FROM crop_calendar_templates existing
  WHERE existing.crop_id = c.id
    AND existing.day_offset = t.day_offset
);
