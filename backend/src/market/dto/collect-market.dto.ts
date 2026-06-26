import { IsOptional, IsString, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CollectMarketDto {
  @ApiPropertyOptional({ description: 'Filter by commodity name', example: 'Rice' })
  @IsOptional()
  @IsString()
  commodity?: string;

  @ApiPropertyOptional({ description: 'Filter by market name', example: 'Bengaluru APMC' })
  @IsOptional()
  @IsString()
  market?: string;

  @ApiPropertyOptional({ description: 'Filter by state', example: 'Karnataka' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by district', example: 'Bengaluru Urban' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ description: 'Collection date (ISO 8601)', example: '2026-06-26' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Maximum records to collect (1–200)', example: 50, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}
