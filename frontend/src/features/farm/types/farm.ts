import { LandParcel, GpsCoordinates } from './parcel';
import { HealthStatus, CropStage } from './crop';

export interface Farmer {
  id: string;
  name: string;
  contactNumber?: string;
}

export type FarmStatus = 'Active' | 'Inactive';

export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  location: string;
  totalArea: number; // in hectares
  gpsCoordinates?: GpsCoordinates;
  status: FarmStatus;
  healthScore: number; // 0-100
  overallHealthStatus: HealthStatus;
  
  // Aggregate data for the Farm Card
  currentCrop?: string;
  cropVariety?: string;
  growthStage?: CropStage;
  expectedHarvestDate?: string;
  
  lastUpdated: string;
  
  // Nested relation
  parcels?: LandParcel[];
}
