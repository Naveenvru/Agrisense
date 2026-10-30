import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
import { DisconnectGoogleDto } from './dto/disconnect-google.dto';

@ApiTags('Account settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get persisted account settings' })
  get(@Req() req: any) { return this.service.get(req.user.id); }

  @Patch()
  @ApiOperation({ summary: 'Update appearance, language, units, and AI preferences' })
  update(@Req() req: any, @Body() dto: UpdateSettingsDto) { return this.service.update(req.user.id, dto); }

  @Post('password')
  @ApiOperation({ summary: 'Change password and revoke all existing access tokens' })
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) { return this.service.changePassword(req.user.id, dto); }

  @Post('connections/google/link-ticket')
  @ApiOperation({ summary: 'Start a short-lived authenticated Google account-link flow' })
  createGoogleLinkTicket(@Req() req: any) { return this.service.createGoogleLinkTicket(req.user.id); }

  @Delete('connections/google')
  @ApiOperation({ summary: 'Disconnect Google after password re-authentication' })
  disconnectGoogle(@Req() req: any, @Body() dto: DisconnectGoogleDto) { return this.service.disconnectGoogle(req.user.id, dto); }

  @Get('export')
  @ApiOperation({ summary: 'Export personal account and farm data as JSON' })
  async export(@Req() req: any, @Res() res: Response) {
    const data = await this.service.exportData(req.user.id);
    const filename = `agrisense-data-${req.user.id}-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(data, null, 2));
  }
}
