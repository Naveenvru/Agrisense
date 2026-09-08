import { GreetingData, RecommendationData } from '@/types/dashboard/Recommendation';
import { FarmData } from '@/types/dashboard/Farm';
import { WeatherData } from '@/types/dashboard/Weather';
import { MarketData } from '@/types/dashboard/Market';
import { TaskData } from '@/types/dashboard/Task';
import { ActivityData } from '@/types/dashboard/Activity';
import { apiClient } from '@/lib/axios';

import {
  MOCK_WEATHER_DATA,
  MOCK_MARKET_DATA,
} from '../mocks/dashboard.mock';

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
    return {
      userName: name,
      lastAnalysisTime: 'Just now',
      location: 'Karnataka, IN',
      weatherSummary: 'Select or add a location to view live weather.'
    };
  }

  async getRecommendation(): Promise<RecommendationData> {
    try {
      const response = await apiClient.get('/land-parcels');
      const parcels = response.data?.data || [];
      if (parcels.length === 0) {
        return {
          title: 'Welcome to AgriSense AI Workspace',
          description: 'Get started by creating your first land parcel and assigning crops to enable intelligent weather, market, and harvest insights.',
          confidence: 100,
          expectedProfitImpact: 'Complete Farm Intelligence',
          primaryActionText: 'Add Land Parcel',
          secondaryActionText: 'Ask AI Assistant'
        };
      }
    } catch (e) {}

    return {
      title: 'Optimal Irrigation Window Identified',
      description: 'Based on moisture sensors and weather models, schedule irrigation for Parcel 1 tomorrow morning.',
      confidence: 92,
      expectedProfitImpact: '+12% Yield Protection',
      primaryActionText: 'Apply Irrigation',
      secondaryActionText: 'View Weather Details'
    };
  }

  async getFarms(): Promise<FarmData[]> {
    try {
      const response = await apiClient.get('/land-parcels');
      const parcels = response.data?.data || [];
      return parcels.map((p: any) => ({
        id: String(p.id),
        name: p.parcelName || `Parcel ${p.id}`,
        location: p.district ? `${p.district}, ${p.state || ''}` : 'Unmapped Location',
        sizeAcres: Number(p.areaAcres) || 0,
        currentCrop: p.additionalMetadata?.crop || 'No Active Crop',
        status: p.additionalMetadata?.status || 'Active',
        healthScore: p.additionalMetadata?.healthScore || 100,
        soilMoisturePercentage: p.additionalMetadata?.soilMoisture || 0,
        nextHarvestDate: p.additionalMetadata?.harvestDate || 'N/A',
        yieldEstimateKg: p.additionalMetadata?.yieldEstimate || 0,
        imageUrl: '/images/farm-placeholder.jpg',
        riskFactors: []
      }));
    } catch (e) {
      return [];
    }
  }

  async getWeather(): Promise<WeatherData> {
    return MOCK_WEATHER_DATA;
  }

  async getMarket(): Promise<MarketData[]> {
    return MOCK_MARKET_DATA;
  }

  async getTasks(): Promise<TaskData[]> {
    try {
      const response = await apiClient.get('/calendar');
      const events = response.data?.data || [];
      return events.map((e: any) => ({
        id: String(e.id),
        title: e.taskName,
        location: 'Farm Field',
        date: e.eventDate,
        priority: (e.priority === 'high' ? 'High' : e.priority === 'low' ? 'Low' : 'Medium'),
        status: e.isCompleted ? 'Completed' : 'Pending'
      }));
    } catch (e) {
      return [];
    }
  }

  async getActivity(): Promise<ActivityData[]> {
    try {
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
    } catch (e) {
      return [];
    }
  }
}

export const dashboardService = new DashboardService();
