import { CropStage, HealthStatus } from './crop';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export type SoilType = 'Clay' | 'Sandy' | 'Silty' | 'Peaty' | 'Chalky' | 'Loamy' | 'Unknown';
export type IrrigationType = 'Drip' | 'Sprinkler' | 'Surface' | 'Manual' | 'Rainfed' | 'Unknown';

export interface LandParcel {
  id: string;
  farmId: string;
  name: string;
  area: number; // in hectares
  gpsCoordinates?: GpsCoordinates;
  currentCrop?: string;
  cropVariety?: string;
  growthStage?: CropStage;
  healthStatus: HealthStatus;
  irrigationType: IrrigationType;
  soilType: SoilType;
}
