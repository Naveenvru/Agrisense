import { Task } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2, Sprout } from 'lucide-react';
import { PriorityBadge, StatusBadge, getCropColor } from './ui/badges';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isSelected?: boolean;
}

export function TaskCard({ task, onClick, isSelected }: TaskCardProps) {
  // Priority left border color
  const priorityColor = {
    Critical: 'border-l-error',
    High: 'border-l-warning',
    Medium: 'border-l-info',
    Low: 'border-l-secondary'
  }[task.priority];

  // Priority Icon
  const PriorityIcon = {
    Critical: ShieldAlert,
    High: AlertTriangle,
    Medium: AlertCircle,
    Low: CheckCircle2
  }[task.priority];

  const priorityIconColor = {
    Critical: 'text-error',
    High: 'text-warning',
    Medium: 'text-info',
    Low: 'text-secondary'
  }[task.priority];

  const cropColor = getCropColor(task.crop);

  return (
    <Card 
      className={`glass cursor-pointer transition-all border-l-4 ${priorityColor} ${
        isSelected ? 'bg-primary/5 shadow-md border-y-primary/30 border-r-primary/30' : 'hover:bg-background/80 hover:shadow-md'
      }`}
      onClick={() => onClick(task)}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-start">
            <PriorityIcon className={`w-4 h-4 mt-0.5 ${priorityIconColor}`} />
            <div>
              <h4 className="font-heading font-semibold text-text-primary leading-tight">{task.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-text-secondary">{task.type}</span>
                <span className="text-text-secondary/30">•</span>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <Clock className="w-3 h-3" />
                  {task.time} ({task.estimatedDuration})
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Farm Context */}
        <div className="bg-background/50 rounded-lg p-2.5 flex items-center justify-between border border-border/50">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-primary">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {task.farmName}
            <span className="text-text-secondary font-normal mx-1">›</span>
            {task.parcelName}
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium text-${cropColor}`}>
            <Sprout className="w-3.5 h-3.5" />
            {task.crop}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
