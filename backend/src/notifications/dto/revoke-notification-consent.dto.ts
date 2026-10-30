import { IsIn } from 'class-validator';

export class RevokeNotificationConsentDto {
  @IsIn(['whatsapp', 'sms']) channel: 'whatsapp' | 'sms';
}
