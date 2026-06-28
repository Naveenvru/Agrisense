import { CropTimelineEvent } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { getCropColor } from './ui/badges';

interface TimelineCardProps {
  events: CropTimelineEvent[];
}

export function TimelineCard({ events }: TimelineCardProps) {
  if (!events || events.length === 0) return null;

  const crop = events[0].crop;
  const cropColor = getCropColor(crop);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Planting': return '🌱';
      case 'Vegetative': return '🌿';
      case 'Flowering': return '🌼';
      case 'Fruiting': return '🍅'; // Default to tomato emoji for fruiting, or standard
      case 'Harvest': return '🌾';
      default: return '📍';
    }
  };

  return (
    <Card className="glass h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text-lg text-text-primary">Crop Growth</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded bg-${cropColor}/10 text-${cropColor}`}>
            {crop} Timeline
          </span>
        </div>
        
        <div className="relative border-l-2 border-border ml-3 space-y-8 mt-4">
          {events.map((event) => {
            
            return (
              <div key={event.id} className="relative pl-6">
                {/* Timeline Node */}
                <div 
                  className={`absolute -left-[11px] top-1 rounded-full bg-background border-2 ${
                    event.isCompleted 
                      ? 'border-success text-success' 
                      : event.isCurrent 
                        ? 'border-primary text-primary' 
                        : 'border-border text-text-secondary/30'
                  }`}
                >
                  {event.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : event.isCurrent ? (
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-background rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col gap-1 ${event.isCompleted || event.isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg" role="img" aria-label={event.stage}>
                      {getStageIcon(event.stage)}
                    </span>
                    <h4 className={`font-medium ${event.isCurrent ? 'text-primary font-bold' : 'text-text-primary'}`}>
                      {event.stage}
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary font-medium">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(event.expectedDate))}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
