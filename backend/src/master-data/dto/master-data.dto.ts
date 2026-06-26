import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiPropertyOptional({ description: 'Search query string (prefix search)', example: 'bang' })
  @IsOptional()
  @IsString()
  q?: string;
}

export class DistrictQueryDto {
  @ApiPropertyOptional({ description: 'Filter by state ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  stateId?: string;
}

export class TalukQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  districtId?: string;
}

export class VillageQueryDto {
  @ApiPropertyOptional({ description: 'Filter by taluk ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  talukId?: string;
}

export class MandiQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  districtId?: string;
}

export class CropVarietyQueryDto {
  @ApiPropertyOptional({ description: 'Filter by commodity ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  commodityId?: string;
}
