export interface DashboardConfig {
  showHeroRecommendation: boolean;
  showQuickStats: boolean;
  showFarmOverview: boolean;
  showWeather: boolean;
  showMarket: boolean;
  showCalendar: boolean;
  showActivity: boolean;
  
  // Future toggles
  showExplainAI?: boolean;
  showAIPipeline?: boolean;
}

export const DASHBOARD_CONFIG: DashboardConfig = {
  showHeroRecommendation: true,
  showQuickStats: true,
  showFarmOverview: true,
  showWeather: true,
  showMarket: true,
  showCalendar: true,
  showActivity: true,
  
  showExplainAI: false,
  showAIPipeline: false,
};

// We define the exact order of sections here.
export const DASHBOARD_SECTION_ORDER = [
  'hero',
  'quickStats',
  'farmOverview',
  'weatherAndMarket', // We'll render these together in a row if both are visible
  'calendarAndActivity'
];
