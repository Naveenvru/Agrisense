import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegionalQueryDto {
  @ApiPropertyOptional({ description: 'Region level', enum: ['village', 'taluk', 'district', 'state'], example: 'district' })
  @IsIn(['village', 'taluk', 'district', 'state'])
  @IsString()
  level: string = 'district';

  @ApiPropertyOptional({ description: 'Region name', example: 'Bengaluru Urban' })
  @IsString()
  name: string;
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ description: 'Region level for analytics', enum: ['district', 'state'], example: 'district' })
  @IsOptional()
  @IsString()
  regionLevel?: string;

  @ApiPropertyOptional({ description: 'Region name filter', example: 'Bengaluru' })
  @IsOptional()
  @IsString()
  regionName?: string;

  @ApiPropertyOptional({ description: 'Period type', enum: ['weekly', 'monthly'], example: 'monthly' })
  @IsOptional()
  @IsIn(['weekly', 'monthly'])
  periodType?: string;

  @ApiPropertyOptional({ description: 'Result limit', example: '12' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class HistoryQueryDto {
  @ApiPropertyOptional({ description: 'Maximum history entries to return', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
