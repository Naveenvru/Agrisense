import { Farm, LandParcel, CropSummary, FarmDashboardSummaryStats, TimelineEvent } from '../types';
import { apiClient } from '@/lib/axios';

export class FarmService {
  static async getFarms(): Promise<Farm[]> {
    try {
      const response = await apiClient.get('/land-parcels');
      const parcels = response.data?.data || [];
      return parcels.map((p: any) => ({
        id: String(p.id),
        name: p.parcelName || `Parcel ${p.id}`,
        ownerId: String(p.uploadedBy || '1'),
        ownerName: 'You',
        location: p.district ? `${p.district}, ${p.state || ''}` : 'Unmapped Location',
        totalArea: Number(p.areaAcres) || 0,
        status: 'Active',
        healthScore: 100,
        overallHealthStatus: 'Healthy',
        currentCrop: p.additionalMetadata?.crop || 'No Active Crop',
        growthStage: 'Vegetative',
        lastUpdated: p.updatedAt || new Date().toISOString()
      }));
    } catch (error) {
      return [];
    }
  }

  static async getFarmDashboard(): Promise<FarmDashboardSummaryStats> {
    const farms = await this.getFarms();
    const totalArea = farms.reduce((acc, f) => acc + f.totalArea, 0);

    return {
      totalFarms: farms.length,
      totalLandArea: totalArea,
      totalActiveParcels: farms.length,
      activeCrops: farms.filter(f => f.currentCrop && f.currentCrop !== 'No Active Crop').length,
      harvestsThisMonth: 0,
      healthyFarmsPercentage: farms.length > 0 ? 100 : 0
    };
  }

  static async getFarmById(id: string): Promise<Farm | undefined> {
    try {
      const response = await apiClient.get(`/land-parcels/${id}`);
      const p = response.data?.data;
      if (!p) return undefined;
      return {
        id: String(p.id),
        name: p.parcelName || `Parcel ${p.id}`,
        ownerId: String(p.uploadedBy || '1'),
        ownerName: 'You',
        location: p.district ? `${p.district}, ${p.state || ''}` : 'Unmapped Location',
        totalArea: Number(p.areaAcres) || 0,
        status: 'Active',
        healthScore: 100,
        overallHealthStatus: 'Healthy',
        currentCrop: p.additionalMetadata?.crop || 'No Active Crop',
        growthStage: 'Vegetative',
        lastUpdated: p.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      return undefined;
    }
  }

  static async getParcels(farmId?: string): Promise<LandParcel[]> {
    try {
      const response = await apiClient.get('/land-parcels');
      const parcels = response.data?.data || [];
      const mapped = parcels.map((p: any) => ({
        id: String(p.id),
        farmId: String(p.id),
        name: p.parcelName || `Parcel ${p.id}`,
        areaAcres: Number(p.areaAcres) || 0,
        soilType: p.soilType || 'Loam',
        irrigationType: p.irrigationType || 'Drip',
        currentCrop: p.additionalMetadata?.crop || 'Unplanted',
        coordinates: p.location ? `${p.location.coordinates[1]}, ${p.location.coordinates[0]}` : undefined
      }));
      return farmId ? mapped.filter((p: any) => p.farmId === farmId) : mapped;
    } catch (error) {
      return [];
    }
  }

  static async createParcel(parcelData: {
    parcelName: string;
    areaAcres: number;
    soilType?: string;
    landType?: string;
    irrigationType?: string;
    latitude?: number;
    longitude?: number;
    additionalMetadata?: Record<string, any>;
  }): Promise<any> {
    const response = await apiClient.post('/land-parcels', parcelData);
    return response.data?.data || response.data;
  }

  static async getCropSummaries(): Promise<CropSummary[]> {
    try {
      const response = await apiClient.get('/farmer-crops');
      const crops = response.data?.data || [];
      return crops.map((c: any) => ({
        id: String(c.id),
        cropName: c.cropVariety || 'Crop',
        parcelName: `Parcel ${c.parcelId}`,
        sowingDate: c.sowingDate,
        expectedHarvestDate: c.expectedHarvestDate,
        status: c.status || 'active'
      }));
    } catch (error) {
      return [];
    }
  }
  
  static async getTimelineEvents(farmId?: string): Promise<TimelineEvent[]> {
    try {
      const response = await apiClient.get('/calendar');
      const events = response.data?.data || [];
      const mapped = events.map((e: any) => ({
        id: String(e.id),
        farmId: String(e.farmerCropId || '1'),
        eventDate: e.eventDate,
        taskName: e.taskName,
        taskDescription: e.taskDescription,
        isCompleted: e.isCompleted
      }));
      return farmId ? mapped.filter((t: any) => t.farmId === farmId) : mapped;
    } catch (error) {
      return [];
    }
  }
}
