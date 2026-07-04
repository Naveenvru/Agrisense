import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { YieldIntelligenceService } from './yield-intelligence.service';
import { RegionalQueryDto, AnalyticsQueryDto, HistoryQueryDto } from './dto/yield-query.dto';

@ApiTags('Yield Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('yield-intelligence')
export class YieldIntelligenceController {
  constructor(private readonly service: YieldIntelligenceService) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all active yield assessments for the authenticated user',
    description: 'Returns the latest yield intelligence assessment for every active farmer crop belonging to the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'All assessments returned.' })
  async getSummary(@Req() req: any) {
    const assessments = await this.service.getSummary(req.user.id);
    return { data: assessments, count: assessments.length };
  }

  @Get('risk/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get yield risk analysis for a farmer crop' })
  async getRisk(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getRisk(id, req.user.id);
    return { data };
  }

  @Get('confidence/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get yield confidence for a farmer crop' })
  async getConfidence(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getConfidence(id, req.user.id);
    return { data };
  }

  @Get('loss/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get yield loss estimate for a farmer crop' })
  async getLoss(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getLoss(id, req.user.id);
    return { data };
  }

  @Get('regional')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get regional yield summary' })
  @ApiQuery({ name: 'level', required: true, enum: ['village', 'taluk', 'district', 'state'], example: 'district' })
  @ApiQuery({ name: 'name', required: true, description: 'Region name', example: 'Bengaluru Urban' })
  async getRegional(@Query() query: RegionalQueryDto) {
    const data = await this.service.getRegional(query.level, query.name);
    return { data };
  }

  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get yield analytics and trends' })
  async getAnalytics(@Query() query: AnalyticsQueryDto) {
    const limit = query.limit ? parseInt(query.limit, 10) : 12;
    const data = await this.service.getAnalytics(query.regionLevel, query.regionName, query.periodType, limit);
    return { data, count: data.length };
  }

  @Get('history/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get yield prediction history for a farmer crop' })
  async getHistory(@Param('farmerCropId') id: string, @Query() query: HistoryQueryDto, @Req() req: any) {
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const data = await this.service.getHistory(id, req.user.id, limit);
    return { data, count: data.length };
  }

  @Post('recalculate/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Force recalculate yield intelligence for a farmer crop' })
  async recalculate(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.assess(id, req.user.id);
    return { message: 'Yield intelligence recalculated successfully', data };
  }

  @Post('recalculate-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger bulk yield assessment for all active crops' })
  async recalculateAll() {
    const result = await this.service.runBulkAssessment();
    await this.service.refreshAnalytics();
    return {
      message: `Bulk assessment complete: ${result.assessed} assessed, ${result.failed} failed`,
      ...result,
    };
  }

  @Get(':farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get complete yield intelligence for a farmer crop',
    description: 'Returns full explainable yield intelligence: yield, risk, confidence, quality, loss, and recommendations.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'ID of the farmer crop', example: '1' })
  async getAssessment(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getAssessment(id, req.user.id);
    return { data };
  }
}
