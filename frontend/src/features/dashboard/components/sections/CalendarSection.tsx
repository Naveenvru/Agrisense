import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { TaskData } from '@/types/dashboard/Task';
import { TaskCard } from '@/components/cards/TaskCard';
import { TaskCardSkeleton } from '@/components/cards/skeletons/TaskAndActivitySkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export function CalendarSection() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getTasks();
      setTasks(data);
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
      <SectionHeader title="Crop Calendar" />
      <Card className="glass hover-card flex-1">
        <CardContent className="p-6 h-full flex flex-col gap-4">
          {isLoading ? (
            <>
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </>
          ) : error ? (
            <ErrorState title="Calendar Unavailable" message={error.message} onRetry={loadData} />
          ) : tasks.length === 0 ? (
            <EmptyState 
              icon={<CalendarIcon className="w-8 h-8" />}
              title="No Tasks Today"
              description="Enjoy your day off! No activities scheduled."
            />
          ) : (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          )}
        </CardContent>
      </Card>
    </section>
  );
}
