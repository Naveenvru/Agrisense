import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { WeatherData } from '@/types/dashboard/Weather';
import { WeatherCard } from '@/components/cards/WeatherCard';
import { WeatherCardSkeleton } from '@/components/cards/skeletons/WeatherCardSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CloudOff } from 'lucide-react';

export function WeatherSection() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getWeather();
      setWeather(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section className="h-full flex flex-col">
      <SectionHeader title="Weather Summary" />
      <div className="flex-1">
        {isLoading ? (
          <WeatherCardSkeleton />
        ) : error ? (
          <ErrorState className="h-full" title="Weather Unavailable" message={error.message} onRetry={loadData} />
        ) : !weather ? (
          <EmptyState 
            icon={<CloudOff className="w-10 h-10" />}
            title="No Farm Location"
            description="Add a land parcel with GPS coordinates to load live weather observations."
          />
        ) : (
          <WeatherCard weather={weather} />
        )}
      </div>
    </section>
  );
}
