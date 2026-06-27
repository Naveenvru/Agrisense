import { DASHBOARD_CONFIG, DASHBOARD_SECTION_ORDER } from '@/config/dashboard';
import { HeroRecommendationSection } from './sections/HeroRecommendationSection';
import { QuickStatsSection } from './sections/QuickStatsSection';
import { FarmOverviewSection } from './sections/FarmOverviewSection';
import { WeatherSection } from './sections/WeatherSection';
import { MarketSection } from './sections/MarketSection';
import { CalendarSection } from './sections/CalendarSection';
import { ActivitySection } from './sections/ActivitySection';

export function DashboardPage() {
  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'hero':
        return DASHBOARD_CONFIG.showHeroRecommendation ? <HeroRecommendationSection key={sectionName} /> : null;
      case 'quickStats':
        return DASHBOARD_CONFIG.showQuickStats ? <QuickStatsSection key={sectionName} /> : null;
      case 'farmOverview':
        return DASHBOARD_CONFIG.showFarmOverview ? <FarmOverviewSection key={sectionName} /> : null;
      case 'weatherAndMarket':
        if (!DASHBOARD_CONFIG.showWeather && !DASHBOARD_CONFIG.showMarket) return null;
        return (
          <div key={sectionName} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DASHBOARD_CONFIG.showWeather && <WeatherSection />}
            {DASHBOARD_CONFIG.showMarket && <MarketSection />}
          </div>
        );
      case 'calendarAndActivity':
        if (!DASHBOARD_CONFIG.showCalendar && !DASHBOARD_CONFIG.showActivity) return null;
        return (
          <div key={sectionName} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DASHBOARD_CONFIG.showCalendar && <CalendarSection />}
            {DASHBOARD_CONFIG.showActivity && <ActivitySection />}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {DASHBOARD_SECTION_ORDER.map(renderSection)}
    </div>
  );
}
