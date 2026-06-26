import { IsOptional, IsString, IsDateString, IsInt, Min, Max, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryMarketDto {
  @ApiPropertyOptional({ description: 'Commodity name filter', example: 'Rice' })
  @IsOptional()
  @IsString()
  commodity?: string;

  @ApiPropertyOptional({ description: 'Market name filter', example: 'Bengaluru APMC' })
  @IsOptional()
  @IsString()
  market?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)', example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)', example: '2026-06-26' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Maximum results (1–500)', example: 100, default: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;
}

export class QueryTrendsDto extends QueryMarketDto {
  @ApiPropertyOptional({ description: 'Trend period', enum: ['daily', 'weekly', 'monthly'], example: 'weekly' })
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly'])
  period?: string;
}

export class PriceStatsDto {
  @ApiPropertyOptional({ description: 'Commodity name', example: 'Rice' })
  @IsOptional()
  @IsString()
  commodity?: string;

  @ApiPropertyOptional({ description: 'Market name', example: 'Bengaluru APMC' })
  @IsOptional()
  @IsString()
  market?: string;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)', example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)', example: '2026-06-26' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
