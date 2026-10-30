import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GeminiService } from './gemini.service';
import { GeneratePromptDto } from './dto/generate-prompt.dto';
import { ExplainContextDto } from './dto/explain-context.dto';
import { AnalyzeDiseaseDto } from './dto/analyze-disease.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from '../settings/user-settings.entity';

@ApiTags('Gemini AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>,
  ) {}

  private async requireAiConsent(userId: string) {
    const settings = await this.settings.findOne({ where: { userId } });
    if (!settings?.aiAssistanceEnabled) {
      throw new ForbiddenException('AI assistance is turned off. Enable it in Settings > AI Preferences to continue.');
    }
  }

  private async contextUserId(userId: string) {
    const settings = await this.settings.findOne({ where: { userId } });
    return settings?.personalizedRecommendationsEnabled ? userId : undefined;
  }

  @ApiOperation({ summary: 'Send message / prompt to Gemini AI' })
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Req() req: any, @Body() dto: GeneratePromptDto) {
    await this.requireAiConsent(req.user.id);
    // The farmer has explicitly asked a question while AI assistance is enabled; include
    // their registered fields, crop cycles, calendar tasks, and manual observations.
    const result = await this.geminiService.generateResponse(dto, req.user.id);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Generate prompt (alias for chat)' })
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Req() req: any, @Body() dto: GeneratePromptDto) {
    await this.requireAiConsent(req.user.id);
    const result = await this.geminiService.generateResponse(dto, req.user.id);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Explain structured AgriSense agricultural context using Gemini AI' })
  @Post('explain')
  @HttpCode(HttpStatus.OK)
  async explain(@Req() req: any, @Body() dto: ExplainContextDto) {
    await this.requireAiConsent(req.user.id);
    const result = await this.geminiService.explainContext(dto, await this.contextUserId(req.user.id));
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Analyze crop leaf/plant image for disease detection using Gemini AI' })
  @Post('analyze-disease')
  @HttpCode(HttpStatus.OK)
  async analyzeDisease(@Req() req: any, @Body() dto: AnalyzeDiseaseDto) {
    await this.requireAiConsent(req.user.id);
    const result = await this.geminiService.analyzeDiseaseImage(dto, await this.contextUserId(req.user.id));
    return {
      success: true,
      data: result,
    };
  }
}

