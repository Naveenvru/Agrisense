import { CalendarStats } from '../types';
import { useAuth } from '@/context/AuthContext';
import { Calendar, AlertTriangle, Target, CloudRain, BrainCircuit } from 'lucide-react';

interface CalendarHeaderProps {
  stats: CalendarStats;
}

export function CalendarHeader({ stats }: CalendarHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
            Good Morning, {user?.name || 'Farmer'}
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-xl">
            Today's Agricultural Plan
          </p>
        </div>

        {/* Quick Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider">Due Today</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.dueToday}</div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <AlertTriangle className="w-4 h-4 text-error" />
              <span className="text-xs font-medium uppercase tracking-wider">High Priority</span>
            </div>
            <div className="text-2xl font-bold text-error">{stats.highPriority}</div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <Target className="w-4 h-4 text-success" />
              <span className="text-xs font-medium uppercase tracking-wider">Harvests</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.upcomingHarvests}</div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <CloudRain className="w-4 h-4 text-info" />
              <span className="text-xs font-medium uppercase tracking-wider">Weather Risk</span>
            </div>
            <div className="text-sm font-semibold text-text-primary mt-auto leading-tight">{stats.weatherRisk}</div>
          </div>

          <div className="bg-background/80 backdrop-blur border border-border/50 rounded-xl p-4 flex flex-col justify-between md:col-span-1 col-span-2">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider">AI Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stats.aiPlanningStatus === 'Optimal' ? 'bg-success' : 'bg-warning'}`} />
              <div className="text-sm font-semibold text-text-primary leading-tight">{stats.aiPlanningStatus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
