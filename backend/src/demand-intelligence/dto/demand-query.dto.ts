import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegionalDemandQueryDto {
  @ApiPropertyOptional({ example: 'district', description: 'Region level: village | taluk | district | state' })
  @IsOptional()
  @IsString()
  level?: 'village' | 'taluk' | 'district' | 'state';

  @ApiPropertyOptional({ example: 'Bengaluru Urban', description: 'Region name to query' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class DemandAnalyticsQueryDto {
  @ApiPropertyOptional({ example: 'district' })
  @IsOptional()
  @IsString()
  regionLevel?: string;

  @ApiPropertyOptional({ example: 'Bengaluru Urban' })
  @IsOptional()
  @IsString()
  regionName?: string;

  @ApiPropertyOptional({ example: 'monthly' })
  @IsOptional()
  @IsString()
  periodType?: string;

  @ApiPropertyOptional({ example: '12' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class DemandActionQueryDto {
  @ApiPropertyOptional({ example: '1', description: 'farmerCropId to recalculate, or omit for full portfolio' })
  @IsOptional()
  @IsString()
  farmerCropId?: string;
}
