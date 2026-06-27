import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { FarmData } from '@/types/dashboard/Farm';
import { FarmCard } from '@/components/cards/FarmCard';
import { FarmCardSkeleton } from '@/components/cards/skeletons/FarmCardSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { Button } from '@/components/ui/button';
import { Map, Plus } from 'lucide-react';

export function FarmOverviewSection() {
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getFarms();
      setFarms(data);
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
    <section>
      <SectionHeader 
        title="My Farm Overview" 
        subtitle="Real-time status of your connected fields."
        action={<Button variant="outline" className="gap-2"><Map className="w-4 h-4"/> View Map</Button>}
      />
      
      {isLoading ? (
        <DashboardGrid>
          {[1, 2, 3, 4].map(i => <FarmCardSkeleton key={i} />)}
        </DashboardGrid>
      ) : error ? (
        <ErrorState title="Failed to load farms" message={error.message} onRetry={loadData} />
      ) : farms.length === 0 ? (
        <EmptyState 
          icon={<Map className="w-12 h-12" />}
          title="No Farms Connected"
          description="You haven't added any fields yet. Add your first field to get AI insights."
          action={<Button className="gap-2"><Plus className="w-4 h-4"/> Add Field</Button>}
        />
      ) : (
        <DashboardGrid>
          {farms.map(farm => <FarmCard key={farm.id} farm={farm} />)}
        </DashboardGrid>
      )}
    </section>
  );
}
