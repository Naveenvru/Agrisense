import { GreetingData, RecommendationData } from '@/types/dashboard/Recommendation';
import { FarmData } from '@/types/dashboard/Farm';
import { WeatherData } from '@/types/dashboard/Weather';
import { MarketData } from '@/types/dashboard/Market';
import { TaskData } from '@/types/dashboard/Task';
import { ActivityData } from '@/types/dashboard/Activity';

import {
  MOCK_GREETING_DATA,
  MOCK_RECOMMENDATION_DATA,
  MOCK_FARMS_DATA,
  MOCK_WEATHER_DATA,
  MOCK_MARKET_DATA,
  MOCK_TASKS_DATA,
  MOCK_ACTIVITY_DATA
} from '../mocks/dashboard.mock';

/**
 * Service to fetch dashboard data.
 * In Sprint 2, this uses mock data and simulates network latency.
 * Later, this will be swapped with actual API calls (e.g., apiClient.get('/api/dashboard/...'))
 */
class DashboardService {
  private simulateLatency<T>(data: T, ms: number = 800): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), ms);
    });
  }

  async getGreeting(): Promise<GreetingData> {
    return this.simulateLatency(MOCK_GREETING_DATA, 400);
  }

  async getRecommendation(): Promise<RecommendationData> {
    return this.simulateLatency(MOCK_RECOMMENDATION_DATA, 600);
  }

  async getFarms(): Promise<FarmData[]> {
    return this.simulateLatency(MOCK_FARMS_DATA, 1000);
  }

  async getWeather(): Promise<WeatherData> {
    return this.simulateLatency(MOCK_WEATHER_DATA, 700);
  }

  async getMarket(): Promise<MarketData[]> {
    return this.simulateLatency(MOCK_MARKET_DATA, 900);
  }

  async getTasks(): Promise<TaskData[]> {
    return this.simulateLatency(MOCK_TASKS_DATA, 500);
  }

  async getActivity(): Promise<ActivityData[]> {
    return this.simulateLatency(MOCK_ACTIVITY_DATA, 600);
  }
}

export const dashboardService = new DashboardService();
