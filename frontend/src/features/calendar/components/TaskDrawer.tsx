import { useEffect } from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { X, MapPin, CheckCircle2, CalendarDays, Copy, ArrowRight, History } from 'lucide-react';
import { AccordionSection } from '../../farm/components/ui/AccordionSection';
import { PriorityBadge, StatusBadge, getCropColor } from './ui/badges';
import { WeatherImpactPanel } from './WeatherImpactPanel';
import { AiRecommendationCard } from './AiRecommendationCard';

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDrawer({ task, isOpen, onClose }: TaskDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const cropColor = getCropColor(task.crop);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md md:max-w-xl h-full bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-text-primary tracking-tight">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-hover">
            <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
          </Button>
        </div>

        {/* Action Bar (Productivity Features - UI Only) */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-border/50 bg-background/50">
          <Button size="sm" variant="outline" className="gap-2" disabled>
            <CheckCircle2 className="w-4 h-4 text-success" />
            Mark Complete
          </Button>
          <Button size="sm" variant="outline" className="gap-2" disabled>
            <CalendarDays className="w-4 h-4" />
            Postpone
          </Button>
          <Button size="sm" variant="outline" className="gap-2" disabled>
            <Copy className="w-4 h-4" />
            Duplicate
          </Button>
          <Button size="sm" variant="outline" className="gap-2 ml-auto" disabled>
            View Farm
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-surface/30">
          
          {/* Task Details */}
          <AccordionSection title="Task Details" defaultOpen>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-secondary mb-1">Type</p>
                <p className="font-medium text-text-primary">{task.type}</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Estimated Duration</p>
                <p className="font-medium text-text-primary">{task.estimatedDuration}</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Scheduled Date</p>
                <p className="font-medium text-text-primary">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(task.date))}</p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Time</p>
                <p className="font-medium text-text-primary">{task.time}</p>
              </div>
            </div>
          </AccordionSection>

          {/* Farm Information */}
          <AccordionSection title="Farm Context" defaultOpen>
            <div className="bg-background/50 rounded-xl p-4 border border-border flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Farm & Parcel</span>
                <div className="flex items-center gap-1.5 font-medium text-text-primary text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  {task.farmName} <span className="text-text-secondary font-normal mx-1">›</span> {task.parcelName}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">Target Crop</span>
                <span className={`px-2.5 py-1 rounded-full bg-${cropColor}/10 text-${cropColor} text-xs font-bold`}>
                  {task.crop}
                </span>
              </div>
            </div>
          </AccordionSection>

          {/* Weather Impact */}
          {task.weatherImpact && (
            <AccordionSection title="Weather Impact" defaultOpen>
              <WeatherImpactPanel impacts={[task.weatherImpact]} />
            </AccordionSection>
          )}

          {/* AI Recommendation */}
          {task.aiRecommendation && (
            <AccordionSection title="AI Recommendation" defaultOpen>
              <AiRecommendationCard recommendation={task.aiRecommendation} />
            </AccordionSection>
          )}

          {/* Equipment */}
          <AccordionSection title="Required Equipment">
            {task.requiredEquipment.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-text-primary">
                {task.requiredEquipment.map((eq, i) => (
                  <li key={i}>{eq}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary italic">No specific equipment required.</p>
            )}
          </AccordionSection>

          {/* Notes */}
          <AccordionSection title="Notes">
            {task.notes ? (
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{task.notes}</p>
            ) : (
              <p className="text-sm text-text-secondary italic">No additional notes provided.</p>
            )}
          </AccordionSection>

          {/* History Placeholder */}
          <AccordionSection title="Execution History">
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
              <History className="w-6 h-6 text-text-secondary" />
              <div>
                <p className="font-medium text-text-primary text-sm">No History Available</p>
                <p className="text-xs text-text-secondary mt-1">Activity logs will appear here once the task is started.</p>
              </div>
            </div>
          </AccordionSection>

        </div>
      </div>
    </div>
  );
}
