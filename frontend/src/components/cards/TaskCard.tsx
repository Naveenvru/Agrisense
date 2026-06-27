import { TaskData } from '@/types/dashboard/Task';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

interface TaskCardProps {
  task: TaskData;
}

export function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority: TaskData['priority']) => {
    switch (priority) {
      case 'High': return 'bg-error/20 text-error border-error/50';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/50';
      case 'Low': return 'bg-primary/20 text-primary border-primary/20';
      default: return 'bg-surface text-text-secondary';
    }
  };

  return (
    <div className="p-4 border border-border rounded-xl bg-surface/30 hover:bg-surface/60 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-text-primary">{task.title}</h4>
        <Badge variant="outline" className={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {task.date}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {task.location}
        </div>
      </div>
    </div>
  );
}
