import { IsBoolean, IsIn, IsOptional, Matches, MaxLength } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @IsOptional() @IsBoolean() inAppEnabled?: boolean;
  @IsOptional() @IsBoolean() dailyDigestEnabled?: boolean;
  @IsOptional() @IsBoolean() marketAlertsEnabled?: boolean;
  @IsOptional() @IsBoolean() weatherAlertsEnabled?: boolean;
  @IsOptional() @IsBoolean() cropRemindersEnabled?: boolean;
  @IsOptional() @IsBoolean() diseaseAlertsEnabled?: boolean;
  @IsOptional() @IsBoolean() systemNotificationsEnabled?: boolean;
  @IsOptional() @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) deliveryTime?: string;
  @IsOptional() @MaxLength(64) timezone?: string;
  @IsOptional() @IsIn(['en', 'en-kn', 'kn']) preferredLanguage?: string;
}
