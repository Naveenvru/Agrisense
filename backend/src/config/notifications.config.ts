import { registerAs } from '@nestjs/config';

export default registerAs('notifications', () => ({
  dailyDeliveryTime: process.env.NOTIFICATION_DEFAULT_TIME || '08:00',
  defaultTimezone: process.env.NOTIFICATION_DEFAULT_TIMEZONE || 'Asia/Kolkata',
  defaultLanguage: process.env.NOTIFICATION_DEFAULT_LANGUAGE || 'en-kn',
  schedulerEnabled: process.env.NOTIFICATION_SCHEDULER_ENABLED !== 'false',
  schedulerPollMs: Number(process.env.NOTIFICATION_SCHEDULER_POLL_MS || 60_000),
}));
