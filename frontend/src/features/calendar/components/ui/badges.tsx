import { TaskPriority, TaskStatus, CropType } from '../../types';

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  let colorClass = '';
  
  switch (priority) {
    case 'Critical':
      colorClass = 'bg-error/15 text-error border-error/30';
      break;
    case 'High':
      colorClass = 'bg-warning/15 text-warning border-warning/30';
      break;
    case 'Medium':
      colorClass = 'bg-info/15 text-info border-info/30';
      break;
    case 'Low':
      colorClass = 'bg-secondary/15 text-secondary border-secondary/30';
      break;
  }
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {priority} Priority
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  let colorClass = '';
  
  switch (status) {
    case 'Completed':
      colorClass = 'bg-success/15 text-success border-success/30';
      break;
    case 'In Progress':
      colorClass = 'bg-primary/15 text-primary border-primary/30';
      break;
    case 'Overdue':
      colorClass = 'bg-error/15 text-error border-error/30';
      break;
    case 'Pending':
      colorClass = 'bg-warning/15 text-warning border-warning/30';
      break;
    case 'Cancelled':
      colorClass = 'bg-muted text-text-secondary border-border';
      break;
  }
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
}

export function getCropColor(crop: CropType): string {
  switch (crop) {
    case 'Tomato':
      return 'success'; // Green
    case 'Paddy':
      return 'info';    // Blue
    case 'Onion':
      return 'warning'; // Orange/Yellow
    case 'Wheat':
      return 'primary'; // Using primary for another color
    default:
      return 'secondary';
  }
}
