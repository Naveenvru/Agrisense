import { TimelineEvent } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TimelineCardProps {
  events: TimelineEvent[];
}

export function TimelineCard({ events }: TimelineCardProps) {
  // Sort events by date ascending
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="glass h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">Farm Timeline</h3>
        <div className="relative border-l border-border ml-3 space-y-6">
          {sortedEvents.map((event) => {
            
            let Icon = Circle;
            let iconColorClass = 'text-text-secondary bg-background';
            if (event.isCompleted) {
              Icon = CheckCircle2;
              iconColorClass = 'text-primary bg-background';
            } else if (event.isCurrent) {
              Icon = Clock;
              iconColorClass = 'text-warning bg-background';
            }

            return (
              <div key={event.id} className="relative pl-6">
                <div className={`absolute -left-[13px] top-1 ${iconColorClass}`}>
                  <Icon className={`w-6 h-6 ${event.isCurrent ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <h4 className={`font-semibold ${event.isCompleted || event.isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {event.title}
                  </h4>
                  <p className="text-xs text-text-secondary mb-1">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(event.date))}
                  </p>
                  {event.description && (
                    <p className={`text-sm ${event.isCompleted || event.isCurrent ? 'text-text-secondary' : 'text-text-secondary/50'}`}>
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
