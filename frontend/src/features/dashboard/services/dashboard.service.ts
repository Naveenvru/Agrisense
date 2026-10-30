import { GreetingData, RecommendationData } from '@/types/dashboard/Recommendation';
import { FarmData } from '@/types/dashboard/Farm';
import { WeatherData } from '@/types/dashboard/Weather';
import { MarketData } from '@/types/dashboard/Market';
import { TaskData } from '@/types/dashboard/Task';
import { ActivityData } from '@/types/dashboard/Activity';
import { apiClient } from '@/lib/axios';


class DashboardService {
  async getGreeting(): Promise<GreetingData> {
    const userStr = localStorage.getItem('user');
    let name = 'Farmer';
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) name = u.name;
        else if (u.email) name = u.email.split('@')[0];
      } catch (e) {}
    }
    let location = 'Location not set';
    try {
      const { data } = await apiClient.get('/farmer-profile/me');
      const profile = data?.data || {};
      location = [profile.district, profile.state].filter(Boolean).join(', ') || location;
    } catch { /* keep the explicit unset state */ }
    return {
      userName: name,
      lastAnalysisTime: 'No saved analysis',
      location,
      weatherSummary: 'Live weather is shown when a farm parcel has a GPS location.'
    };
  }

  async getRecommendation(): Promise<RecommendationData | null> {
    return null;
  }

  async getFarms(): Promise<FarmData[]> {
      const response = await apiClient.get('/land-parcels');
      let cropResponseData: any[] = [];
      try {
        const cropResponse = await apiClient.get('/farmer-crops');
        cropResponseData = cropResponse.data?.data || [];
      } catch { /* show registered farms even when crop summaries are unavailable */ }
      const parcels = response.data?.data || [];
      const crops = cropResponseData;
      return parcels.map((p: any) => {
        const crop = crops.find((item: any) => String(item.parcelId) === String(p.id) && item.status === 'active');
        const harvestDate = crop?.expectedHarvestDate ? new Date(crop.expectedHarvestDate) : null;
        const harvestCountdownDays = harvestDate && Number.isFinite(harvestDate.getTime())
          ? Math.ceil((harvestDate.getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000)
          : null;
        return ({
        id: String(p.id),
        name: p.parcelName || `Parcel ${p.id}`,
        location: [p.additionalMetadata?.district, p.additionalMetadata?.state].filter(Boolean).join(', ') || 'Location not recorded',
        area: p.calculatedAreaHectares != null ? Number(p.calculatedAreaHectares) : Number(p.areaAcres || 0) * 0.404685642,
        crop: crop?.crop?.cropName || crop?.cropVariety || 'No crop assigned',
        growthStage: crop?.growthStage || 'Not recorded',
        status: 'Registered' as const,
        healthScore: p.additionalMetadata?.healthScore == null ? null : Number(p.additionalMetadata.healthScore),
        harvestCountdownDays,
      }); });
  }

  async getWeather(): Promise<WeatherData | null> {
    const response = await apiClient.get('/land-parcels');
    const parcel = (response.data?.data || []).find((item: any) => item.latitude != null && item.longitude != null && Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)));
    if (!parcel) return null;
    const { data } = await apiClient.get(`/weather/current/${parcel.id}`);
    return {
      temperature: data.temperature,
      condition: data.weatherDescription || data.weatherCondition,
      humidity: data.humidity,
      windSpeed: Math.round(Number(data.windSpeed) * 3.6),
      rainfallMm: data.rainfall,
      pressureHpa: data.pressure,
      impactSummary: `Observation from ${data.source} · ${new Date(data.timestamp).toLocaleString()}`,
      isAlert: false,
    };
  }

  async getMarket(): Promise<MarketData[]> {
    const { data: profileResponse } = await apiClient.get('/farmer-profile/me');
    const profile = profileResponse?.data || {};
    const { data } = await apiClient.get('/market/prices', { params: {
      district: profile.district && profile.district !== 'Default' ? profile.district : undefined,
      state: profile.state && profile.state !== 'Default' ? profile.state : undefined,
      limit: 12,
    } });
    return data.map((record: any) => ({
      commodity: record.commodity,
      currentPrice: Number(record.modalPrice),
      market: record.market,
      district: record.district,
      state: record.state,
      unit: record.unit,
      date: record.date,
      source: record.source,
    }));
  }

  async getTasks(): Promise<TaskData[]> {
      const response = await apiClient.get('/calendar');
      const events = response.data?.data || [];
      return events.map((e: any) => ({
        id: String(e.id),
        title: e.taskName || 'Untitled registered activity',
        location: e.farmerCrop?.parcel?.parcelName || 'Location not recorded',
        date: e.eventDate,
        priority: e.priority ? (e.priority[0].toUpperCase() + e.priority.slice(1)) : 'Not recorded',
        status: e.isCompleted ? 'Completed' : 'Pending'
      }));
  }

  async getActivity(): Promise<ActivityData[]> {
      const response = await apiClient.get('/calendar');
      const events = response.data?.data || [];
      const completed = events.filter((e: any) => e.isCompleted);
      return completed.map((e: any) => ({
        id: String(e.id),
        action: e.taskName,
        timestamp: e.completedAt || e.eventDate,
        user: 'You',
        type: 'task'
      }));
  }
}

export const dashboardService = new DashboardService();
