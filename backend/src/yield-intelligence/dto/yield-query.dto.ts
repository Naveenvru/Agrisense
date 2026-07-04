import { IsIn, IsOptional, IsString, IsNumberString } from 'class-validator';

export class RegionalQueryDto {
  @IsString()
  @IsIn(['village', 'taluk', 'district', 'state'])
  level: 'village' | 'taluk' | 'district' | 'state';

  @IsString()
  name: string;
}

export class AnalyticsQueryDto {
  @IsOptional()
  @IsString()
  regionLevel?: string;

  @IsOptional()
  @IsString()
  regionName?: string;

  @IsOptional()
  @IsString()
  periodType?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export class HistoryQueryDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
