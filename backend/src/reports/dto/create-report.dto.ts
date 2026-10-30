import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsIn(['farm_performance', 'market_intelligence', 'weather', 'crop_activity', 'ai_analysis']) reportType: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}
