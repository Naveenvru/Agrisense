import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserSettings } from '../settings/user-settings.entity';
import { AiGatewayService } from './ai-gateway.service';
import { AiChatDto } from './dto/chat.dto';
import { AiMlServiceClient, ForecastRequestDto } from './ai-ml-service.client';

@ApiTags('AI Gateway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly ai: AiGatewayService,
    private readonly aiMlClient: AiMlServiceClient,
    @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check status of AI Gateway and FastAPI ML microservice' })
  async getHealth() {
    return this.aiMlClient.checkHealth();
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with AgriSense AI and retrieve verified commodity data when available' })
  async chat(@Req() req: any, @Body() dto: AiChatDto) {
    const settings = await this.settings.findOne({ where: { userId: req.user.id } });
    if (settings && settings.aiAssistanceEnabled === false) throw new ForbiddenException('AI assistance is turned off. Enable it in Settings > AI Preferences to continue.');
    const data = await this.aiMlClient.chat(dto.prompt, dto.history);
    return { success: true, data };
  }

  @Post('forecast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve multi-horizon machine learning price forecast from Python ML service' })
  async forecast(@Req() req: any, @Body() dto: ForecastRequestDto) {
    const settings = await this.settings.findOne({ where: { userId: req.user.id } });
    if (settings && settings.aiAssistanceEnabled === false) throw new ForbiddenException('AI assistance is turned off. Enable it in Settings > AI Preferences to continue.');
    const data = await this.aiMlClient.getForecast(dto);
    return { success: true, data };
  }

  @Post('rag/query')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Query verified ICAR / agronomic documents via ChromaDB vector store' })
  async queryRag(@Req() req: any, @Body() body: { query: string; cropFilter?: string; nResults?: number }) {
    const data = await this.aiMlClient.queryRag(body.query, body.cropFilter, body.nResults);
    return { success: true, data };
  }

  @Post('disease/detect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run PyTorch foliar symptom classification and Grad-CAM on uploaded leaf' })
  async detectDisease(@Req() req: any, @Body() body: { imageBase64: string }) {
    const settings = await this.settings.findOne({ where: { userId: req.user.id } });
    if (settings && settings.aiAssistanceEnabled === false) throw new ForbiddenException('AI assistance is turned off. Enable it in Settings > AI Preferences to continue.');
    const data = await this.aiMlClient.predictDisease(body.imageBase64);
    return { success: true, data };
  }
}
