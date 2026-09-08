import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { QuickStatCard } from '@/components/cards/QuickStatCard';
import { QuickStatSkeleton } from '@/components/cards/skeletons/QuickStatSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { CloudRain, Map, TrendingUp, CheckSquare } from 'lucide-react';

export function QuickStatsSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [farmsCount, setFarmsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [farms, tasks] = await Promise.all([
        dashboardService.getFarms(),
        dashboardService.getTasks()
      ]);
      setFarmsCount(farms.length);
      setTasksCount(tasks.filter(t => t.status !== 'Completed').length);
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
        <QuickStatCard 
          title="Active Farms" 
          value={`${farmsCount} ${farmsCount === 1 ? 'Field' : 'Fields'}`} 
          status={farmsCount === 0 ? 'No fields connected' : 'All systems healthy'} 
          icon={<Map className="w-6 h-6" />} 
          trend="neutral" 
        />
        <QuickStatCard title="Market Index" value="₹582.50" status="+1.3% vs yesterday" icon={<TrendingUp className="w-6 h-6" />} trend="up" />
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
