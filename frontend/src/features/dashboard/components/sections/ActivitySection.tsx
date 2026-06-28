import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { ActivityData } from '@/types/dashboard/Activity';
import { ActivityCard } from '@/components/cards/ActivityCard';
import { ActivityCardSkeleton } from '@/components/cards/skeletons/TaskAndActivitySkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export function ActivitySection() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getActivity();
      setActivities(data);
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
      <SectionHeader title="Recent Activity" />
      <Card className="glass hover-card flex-1">
        <CardContent className="p-6 h-full">
          {isLoading ? (
            <div className="pt-4">
              <ActivityCardSkeleton />
              <ActivityCardSkeleton />
              <ActivityCardSkeleton />
            </div>
          ) : error ? (
            <ErrorState title="Activity Unavailable" message={error.message} onRetry={loadData} />
          ) : activities.length === 0 ? (
            <EmptyState 
              icon={<Activity className="w-8 h-8" />}
              title="No Recent Activity"
              description="Things are quiet on the farm right now."
            />
          ) : (
            <div className="pt-4">
              {activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
