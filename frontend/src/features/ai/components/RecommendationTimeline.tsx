import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DecisionTimelineEvent } from '../types';
import { CheckCircle2, XCircle, Clock, Circle, History } from 'lucide-react';

interface RecommendationTimelineProps {
  timeline: DecisionTimelineEvent[];
}

export function RecommendationTimeline({ timeline }: RecommendationTimelineProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'applied': 
      case 'accepted': 
        return { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10 border-primary/30' };
      case 'rejected': 
        return { icon: XCircle, color: 'text-error', bg: 'bg-error/10 border-error/30' };
      case 'upcoming': 
      case 'pending':
        return { icon: Clock, color: 'text-ai', bg: 'bg-ai/10 border-ai/30' };
      default: 
        return { icon: Circle, color: 'text-text-secondary', bg: 'bg-surface border-border' };
    }
  };

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <History className="w-5 h-5 text-secondary" /> Decision History
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative pl-3 border-l border-border space-y-6">
          {timeline.map((event) => {
            const config = getStatusConfig(event.status);
            const Icon = config.icon;
            
            return (
              <div key={event.id} className="relative pl-6">
                {/* Timeline Dot */}
                <div className={`absolute -left-[20px] top-1 w-8 h-8 rounded-full border flex items-center justify-center bg-background ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{event.title}</span>
                    <span className="text-xs text-text-secondary">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-xs text-text-secondary">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="mt-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${config.color}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
