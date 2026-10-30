import { Farm, LandParcel, CropSummary, FarmDashboardSummaryStats, TimelineEvent } from '../types';
import { apiClient } from '@/lib/axios';
import { getAccountPreferencesFromStorage } from '@/features/settings/services/account-preferences';

const farmArea = (acres: unknown) => {
  if (!Number.isFinite(Number(acres))) return 0;
  return getAccountPreferencesFromStorage().units === 'imperial' ? Number(Number(acres).toFixed(2)) : Number((Number(acres) * 0.404685642).toFixed(2));
};
const cropName = (crop: any) => crop?.crop?.cropName || crop?.cropVariety || undefined;
const hasCoordinates = (latitude: unknown, longitude: unknown) => latitude !== null && latitude !== undefined && latitude !== '' && longitude !== null && longitude !== undefined && longitude !== '' && Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));

export interface FarmCropCycle {
  id: string;
  parcelId: string;
  cropId: string;
  cropName: string;
  variety?: string;
  sowingDate?: string | null;
  expectedHarvestDate?: string | null;
  status: 'active' | 'harvested' | 'failed';
}

export interface CropConditionRecord {
  id: string;
  farmerCropId: string;
  observedAt: string;
  conditionLabel: string;
  growthStage?: string | null;
  soilMoisturePercent?: number | string | null;
  airTemperatureC?: number | string | null;
  rainfallMm?: number | string | null;
  irrigationStatus?: string | null;
  symptomsAndSigns?: string | null;
  notes?: string | null;
}

export class FarmService {
  private static async loadParcels() {
    const { data } = await apiClient.get('/land-parcels');
    return data?.data || [];
  }
  private static async loadCrops() {
    const { data } = await apiClient.get('/farmer-crops');
    return data?.data || [];
  }

  static async getCropCatalog() {
    const response = await apiClient.get('/crops', { params: { limit: 100 } });
    return response.data?.data || [];
  }

  static async assignCropsToParcel(parcelId: string, cropIds: string[]) {
    const existing = await this.loadCrops();
    const linkedIds = new Set(existing.filter((crop: any) => String(crop.parcelId) === String(parcelId)).map((crop: any) => String(crop.cropId)));
    const assigned: any[] = [];
    for (const cropId of cropIds.filter((id) => !linkedIds.has(String(id)))) {
      const response = await apiClient.post('/farmer-crops', { parcelId, cropId });
      assigned.push(response.data?.data);
    }
    return assigned;
  }

  static async getCropCycles(parcelId: string): Promise<FarmCropCycle[]> {
    const crops = await this.loadCrops();
    return crops.filter((crop: any) => String(crop.parcelId) === String(parcelId)).map((crop: any) => ({
      id: String(crop.id), parcelId: String(crop.parcelId), cropId: String(crop.cropId),
      cropName: crop.crop?.cropName || crop.cropVariety || 'Crop', variety: crop.cropVariety || undefined,
      sowingDate: crop.sowingDate || null, expectedHarvestDate: crop.expectedHarvestDate || null,
      status: crop.status || 'active',
    }));
  }

  static async createCropCycle(input: { parcelId: string; cropId: string; cropVariety?: string; sowingDate: string; expectedHarvestDate?: string }): Promise<{ crop: FarmCropCycle; calendarCount: number; calendarError?: string }> {
    const response = await apiClient.post('/farmer-crops', input);
    const created = response.data?.data || response.data;
    const crop: FarmCropCycle = {
      id: String(created.id), parcelId: String(created.parcelId), cropId: String(created.cropId),
      cropName: created.crop?.cropName || created.cropVariety || 'Crop', variety: created.cropVariety || undefined,
      sowingDate: created.sowingDate || null, expectedHarvestDate: created.expectedHarvestDate || null,
      status: created.status || 'active',
    };
    const calendarCount = Number(response.data?.calendar?.eventsGenerated || 0);
    return {
      crop,
      calendarCount,
      calendarError: response.data?.calendar?.warning
        ? `Crop saved. ${response.data.calendar.warning}`
        : calendarCount === 0 ? 'Crop saved. No calendar tasks were added because no verified template is configured for this crop yet.' : undefined,
    };
  }

  static async deleteCropCycle(id: string) {
    await apiClient.delete(`/farmer-crops/${id}`);
  }

  static async regenerateCropCalendar(id: string) {
    const response = await apiClient.post(`/farmer-crops/${id}/calendar/regenerate`);
    return response.data?.data || response.data;
  }

  static async updateCropCycle(id: string, patch: Record<string, unknown>) {
    const response = await apiClient.put(`/farmer-crops/${id}`, patch);
    return response.data?.data || response.data;
  }

  static async getCropCalendar(farmerCropId: string) {
    const response = await apiClient.get(`/calendar/crop-cycles/${farmerCropId}/events`);
    return response.data?.data || [];
  }

  static async getCropConditions(farmerCropId: string): Promise<CropConditionRecord[]> {
    const response = await apiClient.get(`/farmer-crops/${farmerCropId}/conditions`);
    return (response.data?.data || []).map((record: any) => ({
      ...record,
      id: String(record.id || record._id),
      farmerCropId: String(record.farmerCropId),
      observedAt: record.observedAt,
    }));
  }

  static async createCropCondition(farmerCropId: string, observation: Record<string, unknown>) {
    const response = await apiClient.post(`/farmer-crops/${farmerCropId}/conditions`, observation);
    return { observation: response.data?.data as CropConditionRecord, calendar: response.data?.calendar };
  }

  static async getFarms(): Promise<Farm[]> {
    // Parcel records are the source of truth for farms. A crop endpoint outage must not
    // hide farms that were successfully created.
    const parcels = await this.loadParcels();
    let crops: any[] = [];
    try { crops = await this.loadCrops(); } catch { /* crop details are optional for the farm list */ }
    return parcels.map((p: any) => {
      const current = crops.find((item: any) => String(item.parcelId) === String(p.id) && item.status === 'active');
      return {
        id: String(p.id), name: p.parcelName || `Parcel ${p.id}`,
        ownerId: '', ownerName: 'You',
        location: [p.village, p.taluk, p.district, p.state].filter(Boolean).join(', ') || [p.additionalMetadata?.district, p.additionalMetadata?.state].filter(Boolean).join(', ') || 'Location not recorded',
        gpsCoordinates: hasCoordinates(p.centroidLatitude ?? p.latitude, p.centroidLongitude ?? p.longitude) ? { latitude: Number(p.centroidLatitude ?? p.latitude), longitude: Number(p.centroidLongitude ?? p.longitude) } : undefined,
        boundaryGeoJson: p.boundaryGeoJson?.type === 'Polygon' ? p.boundaryGeoJson : undefined,
        locationAccuracy: p.locationAccuracy,
        calculatedAreaAcres: p.calculatedAreaAcres == null ? undefined : Number(p.calculatedAreaAcres),
        totalArea: farmArea(p.calculatedAreaAcres ?? p.areaAcres), status: 'Active', overallHealthStatus: 'Unknown',
        currentCrop: cropName(current), cropVariety: current?.cropVariety || undefined,
        lastUpdated: p.updatedAt || p.createdAt || '',
      } as Farm;
    });
  }

  static async getFarmDashboard(): Promise<FarmDashboardSummaryStats> {
    const farms = await this.getFarms();
    const [cropsResult, eventsResult] = await Promise.allSettled([this.loadCrops(), apiClient.get('/calendar')]);
    const crops = cropsResult.status === 'fulfilled' ? cropsResult.value : [];
    const events = eventsResult.status === 'fulfilled' ? eventsResult.value.data?.data || [] : [];
    const now = new Date();
    const harvests = events.filter((event: any) => {
      const date = new Date(event.eventDate);
      return /harvest/i.test(event.taskName || '') && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }).length;
    return {
      totalFarms: farms.length,
      totalLandArea: Number(farms.reduce((acc, farm) => acc + farm.totalArea, 0).toFixed(2)),
      areaUnit: getAccountPreferencesFromStorage().units === 'imperial' ? 'ac' : 'ha',
      totalActiveParcels: farms.length,
      activeCrops: crops.filter((crop: any) => crop.status === 'active').length,
      harvestsThisMonth: harvests,
      healthyFarmsPercentage: null,
    };
  }

  static async getFarmById(id: string): Promise<Farm | undefined> {
    const response = await apiClient.get(`/land-parcels/${id}`);
    let crops: any[] = [];
    try { crops = await this.loadCrops(); } catch { /* farm details still open without crop metadata */ }
    const p = response.data?.data;
    if (!p) return undefined;
    const current = crops.find((item: any) => String(item.parcelId) === String(p.id) && item.status === 'active');
    return {
      id: String(p.id), name: p.parcelName || `Parcel ${p.id}`, ownerId: '', ownerName: 'You',
      location: [p.village, p.taluk, p.district, p.state].filter(Boolean).join(', ') || [p.additionalMetadata?.district, p.additionalMetadata?.state].filter(Boolean).join(', ') || 'Location not recorded',
      gpsCoordinates: hasCoordinates(p.centroidLatitude ?? p.latitude, p.centroidLongitude ?? p.longitude) ? { latitude: Number(p.centroidLatitude ?? p.latitude), longitude: Number(p.centroidLongitude ?? p.longitude) } : undefined,
      boundaryGeoJson: p.boundaryGeoJson?.type === 'Polygon' ? p.boundaryGeoJson : undefined,
      locationAccuracy: p.locationAccuracy,
      calculatedAreaAcres: p.calculatedAreaAcres == null ? undefined : Number(p.calculatedAreaAcres),
      totalArea: farmArea(p.calculatedAreaAcres ?? p.areaAcres), status: 'Active', overallHealthStatus: 'Unknown',
      currentCrop: cropName(current), cropVariety: current?.cropVariety || undefined,
      lastUpdated: p.updatedAt || p.createdAt || '',
    };
  }

  static async getParcels(farmId?: string): Promise<LandParcel[]> {
    const parcels = await this.loadParcels();
    const mapped = parcels.map((p: any) => ({
      id: String(p.id), farmId: String(p.id), name: p.parcelName || `Parcel ${p.id}`,
      area: farmArea(p.calculatedAreaAcres ?? p.areaAcres),
      soilType: p.soilType || 'Unknown', irrigationType: p.irrigationType || 'Unknown',
      currentCrop: p.additionalMetadata?.crop || undefined,
      gpsCoordinates: hasCoordinates(p.latitude, p.longitude) ? { latitude: Number(p.latitude), longitude: Number(p.longitude) } : undefined,
      healthStatus: 'Unknown',
    } as LandParcel));
    return farmId ? mapped.filter((parcel: LandParcel) => parcel.farmId === farmId) : mapped;
  }

  static async getSpatialParcels(): Promise<Array<{ id: string; label: string; detail: string; boundary?: { type: 'Polygon'; coordinates: number[][][]; id?: string; label?: string; detail?: string }; point?: [number, number] }>> {
    const parcels = await this.loadParcels();
    let crops: any[] = [];
    try { crops = await this.loadCrops(); } catch { /* parcel boundaries and locations do not depend on crops */ }
    return parcels.map((parcel: any) => {
      const crop = crops.find((item: any) => String(item.parcelId) === String(parcel.id) && item.status === 'active');
      const cropLabel = crop?.crop?.cropName || crop?.cropVariety;
      const area = Number(parcel.calculatedAreaAcres ?? parcel.areaAcres);
      const location = [parcel.village, parcel.district, parcel.state].filter(Boolean).join(', ');
      const detail = [Number.isFinite(area) ? `${area.toFixed(2)} acres (${(area * 0.404685642).toFixed(2)} ha)` : null, parcel.soilType, parcel.irrigationType, cropLabel ? `Crop: ${cropLabel}` : null, location].filter(Boolean).join(' · ');
      const rawBoundary = parcel.boundaryGeoJson;
      const boundary = rawBoundary?.type === 'Polygon' ? { ...rawBoundary, id: String(parcel.id), label: parcel.parcelName || `Parcel ${parcel.id}`, detail } : undefined;
      const latitude = Number(parcel.centroidLatitude ?? parcel.latitude);
      const longitude = Number(parcel.centroidLongitude ?? parcel.longitude);
      return { id: String(parcel.id), label: parcel.parcelName || `Parcel ${parcel.id}`, detail, boundary, point: hasCoordinates(parcel.centroidLatitude ?? parcel.latitude, parcel.centroidLongitude ?? parcel.longitude) ? [latitude, longitude] as [number, number] : undefined };
    });
  }

  static async getVegetation(parcelId: string) {
    const response = await apiClient.get(`/vegetation/parcels/${parcelId}`);
    return response.data?.data;
  }

  static async requestVegetation(parcelId: string, dateFrom: string, dateTo: string, maxCloudCoverage = 30) {
    const response = await apiClient.post(`/vegetation/parcels/${parcelId}/jobs`, { dateFrom, dateTo, maxCloudCoverage });
    return response.data?.data;
  }

  static async retryVegetationJob(jobId: string) {
    const response = await apiClient.post(`/vegetation/jobs/${jobId}/retry`);
    return response.data?.data;
  }

  static async updateParcel(parcelId: string, parcelData: Record<string, any>) {
    const response = await apiClient.put(`/land-parcels/${parcelId}`, parcelData);
    return response.data?.data || response.data;
  }

  static async deleteParcel(parcelId: string) {
    await apiClient.delete(`/land-parcels/${parcelId}`);
  }

  static async createParcel(parcelData: {
    parcelName: string; areaAcres?: number; soilType?: string; landType?: string;
    irrigationType?: string; latitude?: number; longitude?: number; additionalMetadata?: Record<string, any>;
    boundaryGeoJson?: { type: 'Polygon'; coordinates: number[][][] }; locationAccuracy?: 'boundary' | 'gps' | 'approximate';
    village?: string; taluk?: string; district?: string; state?: string; pinCode?: string; description?: string;
    landProfile?: Record<string, any>;
  }): Promise<any> {
    const response = await apiClient.post('/land-parcels', parcelData);
    return response.data?.data || response.data;
  }

  static async previewBoundary(boundaryGeoJson: { type: 'Polygon'; coordinates: number[][][] }): Promise<{
    areaSqm: number; areaAcres: number; areaHectares: number; centroid: { latitude: number; longitude: number };
  }> {
    const response = await apiClient.post('/land-parcels/area-preview', { boundaryGeoJson });
    return response.data?.data;
  }

  static async getCropSummaries(): Promise<CropSummary[]> {
    const [crops, parcels] = await Promise.all([this.loadCrops(), this.loadParcels()]);
    const parcelsById = new Map<string, any>(parcels.map((p: any) => [String(p.id), p]));
    return crops.map((crop: any) => ({
      id: String(crop.id), parcelId: String(crop.parcelId), name: cropName(crop), variety: crop.cropVariety || undefined,
      plantingDate: crop.sowingDate || null, expectedHarvestDate: crop.expectedHarvestDate || null,
      estimatedYield: crop.estimatedYieldKg === null ? null : Number(crop.estimatedYieldKg) * (getAccountPreferencesFromStorage().units === 'imperial' ? 2.20462262 : 1),
      yieldUnit: getAccountPreferencesFromStorage().units === 'imperial' ? 'lb' : 'kg', area: farmArea(parcelsById.get(String(crop.parcelId))?.areaAcres),
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
