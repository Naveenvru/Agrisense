import { Farm, LandParcel, CropSummary, FarmDashboardSummaryStats, TimelineEvent } from '../types';
import { apiClient } from '@/lib/axios';

const hectares = (acres: unknown) => Number.isFinite(Number(acres)) ? Number((Number(acres) * 0.404685642).toFixed(2)) : 0;
const cropName = (crop: any) => crop?.crop?.cropName || crop?.cropVariety || undefined;

export class FarmService {
  private static async loadParcels() {
    const { data } = await apiClient.get('/land-parcels');
    return data?.data || [];
  }
  private static async loadCrops() {
    const { data } = await apiClient.get('/farmer-crops');
    return data?.data || [];
  }

  static async getFarms(): Promise<Farm[]> {
    const [parcels, crops] = await Promise.all([this.loadParcels(), this.loadCrops()]);
    return parcels.map((p: any) => {
      const current = crops.find((item: any) => String(item.parcelId) === String(p.id) && item.status === 'active');
      return {
        id: String(p.id), name: p.parcelName || `Parcel ${p.id}`,
        ownerId: '', ownerName: 'You',
        location: [p.additionalMetadata?.district, p.additionalMetadata?.state].filter(Boolean).join(', ') || 'Location not recorded',
        totalArea: hectares(p.areaAcres), status: 'Active', overallHealthStatus: 'Unknown',
        currentCrop: cropName(current), cropVariety: current?.cropVariety || undefined,
        lastUpdated: p.updatedAt || p.createdAt || '',
      } as Farm;
    });
  }

  static async getFarmDashboard(): Promise<FarmDashboardSummaryStats> {
    const [farms, crops, eventsResponse] = await Promise.all([this.getFarms(), this.loadCrops(), apiClient.get('/calendar')]);
    const events = eventsResponse.data?.data || [];
    const now = new Date();
    const harvests = events.filter((event: any) => {
      const date = new Date(event.eventDate);
      return /harvest/i.test(event.taskName || '') && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }).length;
    return {
      totalFarms: farms.length,
      totalLandArea: Number(farms.reduce((acc, farm) => acc + farm.totalArea, 0).toFixed(2)),
      totalActiveParcels: farms.length,
      activeCrops: crops.filter((crop: any) => crop.status === 'active').length,
      harvestsThisMonth: harvests,
      healthyFarmsPercentage: null,
    };
  }

  static async getFarmById(id: string): Promise<Farm | undefined> {
    const [response, crops] = await Promise.all([apiClient.get(`/land-parcels/${id}`), this.loadCrops()]);
    const p = response.data?.data;
    if (!p) return undefined;
    const current = crops.find((item: any) => String(item.parcelId) === String(p.id) && item.status === 'active');
    return {
      id: String(p.id), name: p.parcelName || `Parcel ${p.id}`, ownerId: '', ownerName: 'You',
      location: [p.additionalMetadata?.district, p.additionalMetadata?.state].filter(Boolean).join(', ') || 'Location not recorded',
      totalArea: hectares(p.areaAcres), status: 'Active', overallHealthStatus: 'Unknown',
      currentCrop: cropName(current), cropVariety: current?.cropVariety || undefined,
      lastUpdated: p.updatedAt || p.createdAt || '',
    };
  }

  static async getParcels(farmId?: string): Promise<LandParcel[]> {
    const parcels = await this.loadParcels();
    const mapped = parcels.map((p: any) => ({
      id: String(p.id), farmId: String(p.id), name: p.parcelName || `Parcel ${p.id}`,
      area: hectares(p.areaAcres),
      soilType: p.soilType || 'Unknown', irrigationType: p.irrigationType || 'Unknown',
      currentCrop: p.additionalMetadata?.crop || undefined,
      gpsCoordinates: Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)) ? { latitude: Number(p.latitude), longitude: Number(p.longitude) } : undefined,
      healthStatus: 'Unknown',
    } as LandParcel));
    return farmId ? mapped.filter((parcel: LandParcel) => parcel.farmId === farmId) : mapped;
  }

  static async createParcel(parcelData: {
    parcelName: string; areaAcres: number; soilType?: string; landType?: string;
    irrigationType?: string; latitude?: number; longitude?: number; additionalMetadata?: Record<string, any>;
  }): Promise<any> {
    const response = await apiClient.post('/land-parcels', parcelData);
    return response.data?.data || response.data;
  }

  static async getCropSummaries(): Promise<CropSummary[]> {
    const [crops, parcels] = await Promise.all([this.loadCrops(), this.loadParcels()]);
    const parcelsById = new Map<string, any>(parcels.map((p: any) => [String(p.id), p]));
    return crops.map((crop: any) => ({
      id: String(crop.id), parcelId: String(crop.parcelId), name: cropName(crop), variety: crop.cropVariety || undefined,
      plantingDate: crop.sowingDate || null, expectedHarvestDate: crop.expectedHarvestDate || null,
      estimatedYield: crop.estimatedYieldKg === null ? null : Number(crop.estimatedYieldKg),
      yieldUnit: 'kg', area: hectares(parcelsById.get(String(crop.parcelId))?.areaAcres),
      healthStatus: 'Unknown',
    }));
  }

  static async getTimelineEvents(farmId?: string): Promise<TimelineEvent[]> {
    const response = await apiClient.get('/calendar');
    const events = response.data?.data || [];
    const mapped = events.map((event: any) => {
      const parcelId = String(event.farmerCrop?.parcel?.id || '');
      return {
        id: String(event.id), farmId: parcelId, type: event.taskName,
        title: event.taskName, description: event.taskDescription || undefined,
        date: event.eventDate, isCompleted: Boolean(event.isCompleted),
        isCurrent: new Date(event.eventDate).toDateString() === new Date().toDateString(),
      } as TimelineEvent;
    });
    return farmId ? mapped.filter((event: TimelineEvent) => event.farmId === farmId) : mapped;
  }
}
