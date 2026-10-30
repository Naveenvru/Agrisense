import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationConsentDto } from './dto/notification-consent.dto';
import { RevokeNotificationConsentDto } from './dto/revoke-notification-consent.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications/preferences')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}
  @Get() get(@Req() req: any) { return this.notifications.getPreferences(req.user.id); }
  @Get('/history') history(@Req() req: any) { return this.notifications.getHistory(req.user.id); }
  @Patch() update(@Req() req: any, @Body() dto: UpdateNotificationPreferencesDto) { return this.notifications.updatePreferences(req.user.id, dto); }
  @Post('consent') consent(@Req() req: any, @Body() dto: NotificationConsentDto) { return this.notifications.grantConsent(req.user.id, dto); }
  @Post('revoke') revoke(@Req() req: any, @Body() dto: RevokeNotificationConsentDto) { return this.notifications.revokeConsent(req.user.id, dto.channel); }
}
