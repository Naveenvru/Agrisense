import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarStats, Task, CropTimelineEvent, CalendarFilterState } from '../types';
import { CalendarService } from '../services/CalendarService';

import { CalendarHeader } from './CalendarHeader';
import { CalendarToolbar } from './CalendarToolbar';
import { TaskCard } from './TaskCard';
import { TimelineCard } from './TimelineCard';
import { CalendarGrid } from './CalendarGrid';
import { TaskDrawer } from './TaskDrawer';
import { SkeletonCalendar, EmptyCalendarState } from './ui/states';

import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CalendarPage() {
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<Task[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<CropTimelineEvent[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filters, setFilters] = useState<CalendarFilterState>({
    farm: 'all', crop: 'all', priority: 'all', status: 'all', taskType: 'all', search: ''
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statsData, today, upcoming, events, timeline] = await Promise.all([
          CalendarService.getStats(),
          CalendarService.getTodayTasks(),
          CalendarService.getUpcomingTasks(),
          CalendarService.getCalendarEvents('2026-05-01', '2026-07-31'), // Mock range
          CalendarService.getCropTimeline('Tomato') // Mock crop
        ]);

        setStats(statsData);
        setTodayTasks(today);
        setUpcomingTasks(upcoming);
        setCalendarEvents(events);
        setTimelineEvents(timeline);
      } catch (e) {
        console.error("Failed to load calendar data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filterTasks = useCallback((tasks: Task[]) => {
    return tasks.filter(t => {
      if (filters.status !== 'all' && t.status !== filters.status) return false;
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
      if (filters.crop !== 'all' && t.crop !== filters.crop) return false;
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return t.title.toLowerCase().includes(query) || 
               t.farmName.toLowerCase().includes(query) || 
               t.crop.toLowerCase().includes(query);
      }
      return true;
    });
  }, [filters]);

  const filteredTodayTasks = useMemo(() => filterTasks(todayTasks), [todayTasks, filterTasks]);
  const filteredUpcomingTasks = useMemo(() => filterTasks(upcomingTasks), [upcomingTasks, filterTasks]);
  const filteredEvents = useMemo(() => filterTasks(calendarEvents), [calendarEvents, filterTasks]);

  if (isLoading) {
    return <SkeletonCalendar />;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Smart Hero Section */}
      {stats && <CalendarHeader stats={stats} />}

      {/* Toolbar */}
      <CalendarToolbar 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Main Content (Left / Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Tasks */}
          <section>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
              Action Required Today
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{filteredTodayTasks.length}</span>
            </h2>
            
            {filteredTodayTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTodayTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onClick={setSelectedTask} 
                    isSelected={selectedTask?.id === task.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyCalendarState title="No Tasks Today" description="You are all caught up for today! Check upcoming activities." />
            )}
          </section>

          {/* Upcoming Activities */}
          <section>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Upcoming Activities</h2>
            {filteredUpcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredUpcomingTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onClick={setSelectedTask} 
                    isSelected={selectedTask?.id === task.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyCalendarState title="No Upcoming Tasks" description="Your schedule is clear for the coming days." />
            )}
          </section>

          {/* Calendar Grid View */}
          <section>
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Calendar Schedule</h2>
            <div className="h-auto">
              <CalendarGrid tasks={filteredEvents} viewMode={viewMode} />
            </div>
          </section>

        </div>

        {/* Sidebar (Right / Span 1) */}
        <div className="space-y-6 lg:sticky lg:top-6">
          
          {/* Crop Timeline */}
          <div className="min-h-[400px]">
            {timelineEvents.length > 0 ? (
              <TimelineCard events={timelineEvents} />
            ) : (
              <EmptyCalendarState title="No Timeline" description="Select a crop to view its timeline." />
            )}
          </div>

          {/* Notifications Placeholder */}
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-warning" />
                <h3 className="font-heading font-semibold text-text-primary">Upcoming Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning-foreground font-medium">
                  Tomato Harvest expected in 5 days
                </div>
                <div className="text-sm p-3 rounded-lg bg-info/10 border border-info/20 text-info-foreground font-medium">
                  Rain forecast: 12mm tomorrow
                </div>
                <div className="text-sm p-3 rounded-lg bg-error/10 border border-error/20 text-error-foreground font-medium">
                  Onion Market Price dropped by 5%
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>

      {/* Task Details Drawer */}
      <TaskDrawer 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />

    </div>
  );
}
