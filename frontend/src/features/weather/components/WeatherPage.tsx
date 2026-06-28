import { useState, useEffect } from 'react';
import { WeatherService } from '../services/WeatherService';
import { 
  WeatherData, AiWeatherRecommendation, HourlyForecast, DailyForecast, 
  WeatherRisk, FarmWeatherImpact, WeatherAlert, HistoricalWeatherPoint,
  AgriculturalDecision, CropWeatherImpact, WeatherImpactMatrixItem 
} from '../types';

import { WeatherHero } from './WeatherHero';
import { AgriculturalDecisionDashboard } from './AgriculturalDecisionDashboard';
import { AiRecommendationHero } from './AiRecommendationHero';
import { CurrentWeatherGrid } from './CurrentWeatherGrid';
import { ForecastTimeline } from './ForecastTimeline';
import { FarmImpactsSection } from './FarmImpactsSection';
import { WeatherImpactMatrix } from './WeatherImpactMatrix';
import { WeeklyForecastCard } from './WeeklyForecastCard';
import { RiskCard } from './RiskCard';
import { AlertBanner } from './AlertBanner';
import { WeatherChart } from './WeatherChart';
import { WeatherMapCard } from './WeatherMapCard';
import { IntegrationIndicators } from './IntegrationIndicators';
import { WeatherDrawer } from './WeatherDrawer';
import { WeatherSkeleton } from './ui/WeatherSkeleton';

export function WeatherPage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [aiRec, setAiRec] = useState<AiWeatherRecommendation | null>(null);
  const [decisions, setDecisions] = useState<AgriculturalDecision[]>([]);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [weekly, setWeekly] = useState<DailyForecast[]>([]);
  const [risks, setRisks] = useState<WeatherRisk[]>([]);
  const [farmImpacts, setFarmImpacts] = useState<FarmWeatherImpact[]>([]);
  const [cropImpacts, setCropImpacts] = useState<CropWeatherImpact[]>([]);
  const [matrix, setMatrix] = useState<WeatherImpactMatrixItem[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [historical, setHistorical] = useState<HistoricalWeatherPoint[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          weather, ai, dec, hrly, wkly, rsk, farmImp, cropImp, mat, alrts, hist
        ] = await Promise.all([
          WeatherService.getCurrentWeather(),
          WeatherService.getAiRecommendation(),
          WeatherService.getAgriculturalDecisions(),
          WeatherService.getHourlyForecast(),
          WeatherService.getWeeklyForecast(),
          WeatherService.getWeatherRisks(),
          WeatherService.getFarmImpacts(),
          WeatherService.getCropImpacts(),
          WeatherService.getImpactMatrix(),
          WeatherService.getWeatherAlerts(),
          WeatherService.getHistoricalWeather()
        ]);

        setCurrentWeather(weather);
        setAiRec(ai);
        setDecisions(dec);
        setHourly(hrly);
        setWeekly(wkly);
        setRisks(rsk);
        setFarmImpacts(farmImp);
        setCropImpacts(cropImp);
        setMatrix(mat);
        setAlerts(alrts);
        setHistorical(hist);
      } catch (e) {
        console.error("Failed to load weather data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !currentWeather || !aiRec) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* 1. Alerts */}
      <AlertBanner alerts={alerts} />
      
      {/* 2. Hero Section */}
      <WeatherHero 
        weather={currentWeather} 
        aiConfidence={aiRec.confidence} 
        overallRisk={aiRec.priority} 
      />

      {/* 3. AI Recommendation */}
      <AiRecommendationHero recommendation={aiRec} />

      {/* 4. Agricultural Decision Dashboard */}
      <AgriculturalDecisionDashboard decisions={decisions} />

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Main Content (Left / Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Current Weather Grid */}
          <CurrentWeatherGrid weather={currentWeather} />
          
          {/* Hourly Forecast Timeline */}
          <ForecastTimeline forecast={hourly} />

          {/* Weekly Forecast (Moved from sidebar to support horizontal layout) */}
          <WeeklyForecastCard forecast={weekly} onDayClick={setSelectedDay} />

          {/* Farm and Crop Impacts */}
          <FarmImpactsSection farmImpacts={farmImpacts} cropImpacts={cropImpacts} />

          {/* Impact Matrix */}
          <WeatherImpactMatrix matrix={matrix} />

          {/* Risk Dashboard */}
          <RiskCard risks={risks} />

          {/* Historical Charts */}
          <WeatherChart data={historical} />

          {/* Map Placeholder */}
          <WeatherMapCard />

        </div>

        {/* Sidebar (Right / Span 1) */}
        <div className="space-y-6 lg:sticky lg:top-6">
          
          {/* Integrations Placeholder */}
          <IntegrationIndicators />
          
        </div>
      </div>

      {/* Details Drawer */}
      <WeatherDrawer 
        day={selectedDay} 
        isOpen={!!selectedDay} 
        onClose={() => setSelectedDay(null)} 
      />

    </div>
  );
}
