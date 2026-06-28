import { Task } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarGridProps {
  tasks: Task[];
  viewMode: 'month' | 'week' | 'day';
}

export function CalendarGrid({ tasks, viewMode }: CalendarGridProps) {
  // Simple mock month view generator for demonstration
  // Real implementation would use date-fns and compute accurate grids.
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Helper to get heat dots for a specific day
  const getDotsForDay = (day: number | null) => {
    if (!day) return [];
    
    // Create date string in YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.date === dateStr);
    
    // Collect colors
    const colors = new Set<string>();
    dayTasks.forEach(t => {
      if (t.status === 'Completed') colors.add('bg-success');
      else if (t.status === 'Overdue') colors.add('bg-error');
      else if (t.status === 'In Progress') colors.add('bg-warning');
      else colors.add('bg-primary'); // Scheduled/Pending
    });
    
    return Array.from(colors);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (viewMode !== 'month') {
    return (
      <Card className="glass border-dashed border-border/50">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center opacity-60">
          <p className="text-text-primary font-medium">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View Pending</p>
          <p className="text-sm text-text-secondary mt-1">Select Month view to see the heat calendar.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text-lg text-text-primary">
            {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success" /> Completed</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-warning" /> In Progress</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-error" /> Overdue</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Scheduled</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
          {weekDays.map(d => (
            <div key={d} className="text-xs font-medium text-text-secondary pb-2">
              {d}
            </div>
          ))}
          
          {days.map((day, idx) => {
            const isToday = day === today.getDate();
            const dots = getDotsForDay(day);
            
            return (
              <div 
                key={idx} 
                className={`aspect-square flex flex-col items-center justify-center rounded-lg border relative transition-colors ${
                  !day 
                    ? 'border-transparent' 
                    : isToday
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border/40 hover:border-primary/50 text-text-primary bg-background/30'
                }`}
              >
                {day && <span>{day}</span>}
                
                {/* Heat Indicators */}
                {dots.length > 0 && (
                  <div className="absolute bottom-1.5 flex gap-1 justify-center w-full">
                    {dots.slice(0, 3).map((color, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${color}`} />
                    ))}
                    {dots.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-text-secondary" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
