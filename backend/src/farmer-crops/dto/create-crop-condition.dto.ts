import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCropConditionDto {
  @IsString()
  @MaxLength(120)
  conditionLabel: string;

  @IsOptional()
  @IsDateString()
  observedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  growthStage?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  soilMoisturePercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-30)
  @Max(70)
  airTemperatureC?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  rainfallMm?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  irrigationStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  symptomsAndSigns?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}
