import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreferences } from './notification-preferences.entity';
import { NotificationConsent } from './notification-consent.entity';
import { NotificationJob } from './notification-job.entity';
import { NotificationAttempt } from './notification-attempt.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { DailyDigestSchedulerService } from './daily-digest-scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationPreferences, NotificationConsent, NotificationJob, NotificationAttempt])],
  controllers: [NotificationsController], providers: [NotificationsService, DailyDigestSchedulerService], exports: [NotificationsService],
})
export class NotificationsModule {}
