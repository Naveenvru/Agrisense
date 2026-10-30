import { IsIn, IsString, MaxLength } from 'class-validator';

export class NotificationConsentDto {
  @IsIn(['whatsapp', 'sms']) channel: 'whatsapp' | 'sms';
  @IsString() @MaxLength(100) consentSource: string;
}
