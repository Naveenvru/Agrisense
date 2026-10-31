import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserSettings } from '../settings/user-settings.entity';
import { AiGatewayService } from './ai-gateway.service';
import { AiChatDto } from './dto/chat.dto';

@ApiTags('AI Gateway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiGatewayService, @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with AgriSense AI and retrieve verified commodity data when available' })
  async chat(@Req() req: any, @Body() dto: AiChatDto) {
    const settings = await this.settings.findOne({ where: { userId: req.user.id } });
    if (!settings?.aiAssistanceEnabled) throw new ForbiddenException('AI assistance is turned off. Enable it in Settings > AI Preferences to continue.');
    const data = await this.ai.chat(dto.prompt, dto.history, req.user.id);
    return { success: true, data };
  }
}
