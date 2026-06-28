import { Farm, LandParcel, CropSummary, FarmDashboardSummaryStats, TimelineEvent } from '../types';
import { MOCK_FARMS, MOCK_PARCELS, MOCK_CROP_SUMMARIES, MOCK_DASHBOARD_STATS, MOCK_TIMELINE_EVENTS } from '../mocks/farm.mock';

const DELAY_MS = 800; // Simulate network latency

export class FarmService {
  static async getFarmDashboard(): Promise<FarmDashboardSummaryStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DASHBOARD_STATS);
      }, DELAY_MS);
    });
  }

  static async getFarms(): Promise<Farm[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_FARMS);
      }, DELAY_MS);
    });
  }

  static async getFarmById(id: string): Promise<Farm | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const farm = MOCK_FARMS.find(f => f.id === id);
        // Include parcels in the response to mimic a detailed backend fetch
        if (farm) {
           farm.parcels = MOCK_PARCELS.filter(p => p.farmId === id);
        }
        resolve(farm);
      }, DELAY_MS);
    });
  }

  static async getParcels(farmId?: string): Promise<LandParcel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (farmId) {
          resolve(MOCK_PARCELS.filter(p => p.farmId === farmId));
        } else {
          resolve(MOCK_PARCELS);
        }
      }, DELAY_MS);
    });
  }

  static async getCropSummaries(): Promise<CropSummary[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CROP_SUMMARIES);
      }, DELAY_MS);
    });
  }
  
  static async getTimelineEvents(farmId?: string): Promise<TimelineEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (farmId) {
          resolve(MOCK_TIMELINE_EVENTS.filter(t => t.farmId === farmId));
        } else {
          resolve(MOCK_TIMELINE_EVENTS);
        }
      }, DELAY_MS);
    });
  }
}
