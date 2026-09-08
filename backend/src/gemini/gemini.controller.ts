import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GeminiService } from './gemini.service';
import { GeneratePromptDto } from './dto/generate-prompt.dto';
import { ExplainContextDto } from './dto/explain-context.dto';
import { AnalyzeDiseaseDto } from './dto/analyze-disease.dto';

@ApiTags('Gemini AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @ApiOperation({ summary: 'Send message / prompt to Gemini AI' })
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Req() req: any, @Body() dto: GeneratePromptDto) {
    const result = await this.geminiService.generateResponse(dto, req.user?.id);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Generate prompt (alias for chat)' })
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Req() req: any, @Body() dto: GeneratePromptDto) {
    const result = await this.geminiService.generateResponse(dto, req.user?.id);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Explain structured AgriSense agricultural context using Gemini AI' })
  @Post('explain')
  @HttpCode(HttpStatus.OK)
  async explain(@Req() req: any, @Body() dto: ExplainContextDto) {
    const result = await this.geminiService.explainContext(dto, req.user?.id);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Analyze crop leaf/plant image for disease detection using Gemini AI' })
  @Post('analyze-disease')
  @HttpCode(HttpStatus.OK)
  async analyzeDisease(@Req() req: any, @Body() dto: AnalyzeDiseaseDto) {
    const result = await this.geminiService.analyzeDiseaseImage(dto, req.user?.id);
    return {
      success: true,
      data: result,
    };
  }
}

