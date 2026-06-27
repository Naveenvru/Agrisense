import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { MarketData } from '@/types/dashboard/Market';
import { MarketCard } from '@/components/cards/MarketCard';
import { MarketCardSkeleton } from '@/components/cards/skeletons/MarketCardSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TrendingDown } from 'lucide-react';

export function MarketSection() {
  const [marketItems, setMarketItems] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getMarket();
      setMarketItems(data);
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
      <SectionHeader title="Market Summary" />
      <div className="flex-1">
        {isLoading ? (
          <MarketCardSkeleton />
        ) : error ? (
          <ErrorState className="h-full" title="Market Unavailable" message={error.message} onRetry={loadData} />
        ) : marketItems.length === 0 ? (
          <EmptyState 
            icon={<TrendingDown className="w-10 h-10" />}
            title="No Market Data"
            description="Market feeds are currently unavailable."
          />
        ) : (
          <MarketCard marketItems={marketItems} />
        )}
      </div>
    </section>
  );
}
