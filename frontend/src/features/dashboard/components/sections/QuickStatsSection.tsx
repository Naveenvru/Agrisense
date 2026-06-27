import { useState, useEffect } from 'react';

import { QuickStatCard } from '@/components/cards/QuickStatCard';
import { QuickStatSkeleton } from '@/components/cards/skeletons/QuickStatSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { CloudRain, Map, TrendingUp, CheckSquare } from 'lucide-react';

export function QuickStatsSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this might be a single endpoint, but we simulate it by waiting for a little bit.
      await new Promise(resolve => setTimeout(resolve, 500));
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
        <QuickStatCard title="Current Weather" value="24°C" status="Partly Cloudy" icon={<CloudRain className="w-6 h-6" />} trend="neutral" />
        <QuickStatCard title="Active Farms" value="4 Fields" status="1 Needs Attention" icon={<Map className="w-6 h-6" />} trend="neutral" />
        <QuickStatCard title="Market Index" value="₹582.50" status="+1.3% vs yesterday" icon={<TrendingUp className="w-6 h-6" />} trend="up" />
        <QuickStatCard title="Today's Tasks" value="3 Pending" status="High Priority Alert" icon={<CheckSquare className="w-6 h-6" />} trend="neutral" />
      </DashboardGrid>
    </section>
  );
}
