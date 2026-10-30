import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { WeatherData } from '@/types/dashboard/Weather';
import { MarketData } from '@/types/dashboard/Market';
import { QuickStatCard } from '@/components/cards/QuickStatCard';
import { QuickStatSkeleton } from '@/components/cards/skeletons/QuickStatSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { CloudRain, Map, TrendingUp, CheckSquare } from 'lucide-react';
import { formatTemperature, getCurrentLocale } from '@/features/settings/services/account-preferences';

export function QuickStatsSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [farmsCount, setFarmsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [market, setMarket] = useState<MarketData[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [farmsResult, tasksResult, weatherResult, marketResult] = await Promise.allSettled([
        dashboardService.getFarms(),
        dashboardService.getTasks(),
        dashboardService.getWeather(),
        dashboardService.getMarket(),
      ]);
      if (farmsResult.status === 'rejected') throw farmsResult.reason;
      setFarmsCount(farmsResult.value.length);
      setTasksCount(tasksResult.status === 'fulfilled' ? tasksResult.value.filter(t => t.status !== 'Completed').length : 0);
      setWeather(weatherResult.status === 'fulfilled' ? weatherResult.value : null);
      setMarket(marketResult.status === 'fulfilled' ? marketResult.value : []);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardGrid>
        <QuickStatSkeleton />
        <QuickStatSkeleton />
        <QuickStatSkeleton />
        <QuickStatSkeleton />
      </DashboardGrid>
    );
  }

  if (error) {
    return (
      <div className="col-span-full">
        <ErrorState title="Failed to load quick stats" onRetry={loadData} />
      </div>
    );
  }

  return (
    <section>
      <DashboardGrid>
        <QuickStatCard title="Current Weather" value={weather ? formatTemperature(weather.temperature) : 'Unavailable'} status={weather?.condition || 'Add a geolocated parcel'} icon={<CloudRain className="w-6 h-6" />} trend="neutral" />
        <QuickStatCard 
          title="Active Farms" 
          value={`${farmsCount} ${farmsCount === 1 ? 'Field' : 'Fields'}`} 
          status={farmsCount === 0 ? 'No parcels registered' : 'Registered parcels'}
          icon={<Map className="w-6 h-6" />} 
          trend="neutral" 
        />
        <QuickStatCard title="Latest Market Record" value={market[0] ? `₹${market[0].currentPrice.toLocaleString(getCurrentLocale())}` : 'No records'} status={market[0] ? `${market[0].commodity} · ${market[0].market} · ${new Date(market[0].date).toLocaleDateString(getCurrentLocale())}` : 'No prices available for this region'} icon={<TrendingUp className="w-6 h-6" />} trend="neutral" />
        <QuickStatCard 
          title="Today's Tasks" 
          value={`${tasksCount} Pending`} 
          status={tasksCount === 0 ? 'No pending tasks' : 'Scheduled Tasks'} 
          icon={<CheckSquare className="w-6 h-6" />} 
          trend="neutral" 
        />
      </DashboardGrid>
    </section>
  );
}
