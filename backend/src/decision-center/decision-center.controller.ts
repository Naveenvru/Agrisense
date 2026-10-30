import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DecisionCenterService } from './decision-center.service';
import { DecisionQueryDto } from './dto/decision-query.dto';

@ApiTags('Decision Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('decision-center')
export class DecisionCenterController {
  constructor(private readonly decisionCenter: DecisionCenterService) {}
  @Post('query') analyze(@Req() req: any, @Body() dto: DecisionQueryDto) { return this.decisionCenter.analyze(req.user.id, dto.query); }
  @Get('history') history(@Req() req: any) { return this.decisionCenter.history(req.user.id); }
  @Get('history/:traceId') async getTrace(@Req() req: any, @Param('traceId') traceId: string) {
    const trace = await this.decisionCenter.getTrace(req.user.id, traceId);
    if (!trace) throw new NotFoundException('Decision trace not found');
    return trace;
  }
}
