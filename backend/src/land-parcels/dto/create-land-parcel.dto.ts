import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLandParcelDto {
  @IsString()
  @IsOptional()
  parcelName?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  areaAcres?: number;

  @IsString()
  @IsOptional()
  soilType?: string;

  @IsString()
  @IsOptional()
  landType?: string;

  @IsString()
  @IsOptional()
  irrigationType?: string;

  @IsLatitude()
  @Type(() => Number)
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @Type(() => Number)
  @IsOptional()
  longitude?: number;

  @IsObject()
  @IsOptional()
  additionalMetadata?: Record<string, any>;
}
