import { Controller, Get, Post, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupplyIntelligenceService } from './supply-intelligence.service';
import { AnalyticsQueryDto, RegionalQueryDto, SupplyActionQueryDto } from './dto/supply-query.dto';

@ApiTags('Supply Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('supply-intelligence')
export class SupplyIntelligenceController {
  constructor(private readonly service: SupplyIntelligenceService) {}

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active supply assessments for the authenticated user' })
  @ApiResponse({ status: 200, description: 'All assessments returned.' })
  async getSummary(@Req() req: any) {
    const assessments = await this.service.getSummary(req.user.id);
    return { data: assessments, count: assessments.length };
  }

  @Get('risk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get supply risk for one crop or the current user portfolio' })
  @ApiQuery({ name: 'cropId', required: false, description: 'Optional crop ID for a single crop risk view' })
  async getRisk(@Query() query: SupplyActionQueryDto, @Req() req: any) {
    const data = await this.service.getRisk(query.cropId, req.user.id);
    return { data };
  }

  @Get('timeline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get supply availability timeline for one crop or the current user portfolio' })
  @ApiQuery({ name: 'cropId', required: false, description: 'Optional crop ID for a single crop timeline view' })
  async getTimeline(@Query() query: SupplyActionQueryDto, @Req() req: any) {
    const data = await this.service.getTimeline(query.cropId, req.user.id);
    return { data };
  }

  @Get('regional')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get regional supply summary' })
  @ApiQuery({ name: 'level', required: true, enum: ['village', 'taluk', 'district', 'state'], example: 'district' })
  @ApiQuery({ name: 'name', required: true, description: 'Region name', example: 'Bengaluru Urban' })
  async getRegional(@Query() query: RegionalQueryDto) {
    const data = await this.service.getRegional(query.level, query.name);
    return { data };
  }

  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get supply analytics and trends' })
  async getAnalytics(@Query() query: AnalyticsQueryDto) {
    const limit = query.limit ? parseInt(query.limit, 10) : 12;
    const data = await this.service.getAnalytics(query.regionLevel, query.regionName, query.periodType, limit);
    return { data, count: data.length };
  }

  @Get(':cropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get complete supply intelligence for a farmer crop' })
  @ApiParam({ name: 'cropId', description: 'ID of the farmer crop', example: '1' })
  async getAssessment(@Param('cropId') id: string, @Req() req: any) {
    const data = await this.service.getAssessment(id, req.user.id);
    return { data };
  }

  @Post('recalculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recalculate supply intelligence for a crop or the current portfolio' })
  @ApiQuery({ name: 'cropId', required: false, description: 'Optional crop ID for a single crop recalculation' })
  async recalculate(@Query() query: SupplyActionQueryDto, @Req() req: any) {
    if (query.cropId) {
      const data = await this.service.assess(query.cropId, req.user.id);
      return { message: 'Supply intelligence recalculated successfully', data };
    }

    const result = await this.service.runBulkAssessment(req.user.id);
    await this.service.refreshAnalytics();
    return { message: `Bulk supply recalculation complete: ${result.assessed} assessed, ${result.failed} failed`, ...result };
  }

  @Post('recalculate-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger bulk supply assessment for all active crops' })
  async recalculateAll() {
    const result = await this.service.runBulkAssessment();
    await this.service.refreshAnalytics();
    return {
      message: `Bulk assessment complete: ${result.assessed} assessed, ${result.failed} failed`,
      ...result,
    };
  }
}