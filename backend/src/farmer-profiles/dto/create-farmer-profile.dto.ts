import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFarmerProfileDto {
  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  village?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  totalLandArea?: number;

  @IsString()
  @IsOptional()
  primarySoilType?: string;

  @IsString()
  @IsOptional()
  primaryIrrigationType?: string;
}
