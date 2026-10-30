import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}
  @Get() history(@Req() req: any) { return this.reports.history(req.user.id); }
  @Post() generate(@Req() req: any, @Body() dto: CreateReportDto) { return this.reports.generate(req.user.id, dto); }
  @Get(':id/download') async download(@Req() req: any, @Param('id') id: string, @Res() response: Response) {
    const report = await this.reports.download(req.user.id, id);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    response.send(report.content);
  }
}
