import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsLatitude,
  IsLongitude,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLandParcelDto {
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

  @IsObject()
  @IsOptional()
  boundaryGeoJson?: { type: string; coordinates: unknown[] };

  @IsString()
  @IsOptional()
  village?: string;

  @IsString()
  @IsOptional()
  taluk?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  pinCode?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  landProfile?: Record<string, any>;

  @IsIn(['boundary', 'gps', 'approximate'])
  @IsOptional()
  locationAccuracy?: 'boundary' | 'gps' | 'approximate';
}
