import { Badge } from '@/components/ui/badge';
import { HealthStatus, CropStage } from '../../types';
import { Leaf, MapPin, Target, Activity, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export function HealthBadge({ status }: { status: HealthStatus }) {
  let colorClass = '';
  let Icon = Activity;

  switch (status) {
    case 'Healthy':
      colorClass = 'bg-primary/20 text-primary hover:bg-primary/30';
      Icon = CheckCircle2;
      break;
    case 'Medium Risk':
      colorClass = 'bg-warning/20 text-warning hover:bg-warning/30 border-warning/50';
      Icon = AlertTriangle;
      break;
    case 'Needs Attention':
      colorClass = 'bg-warning/20 text-warning hover:bg-warning/30 border-warning/50';
      Icon = AlertTriangle;
      break;
    case 'Critical':
      colorClass = 'bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/50';
      Icon = XCircle;
      break;
  }

  return (
    <Badge variant="outline" className={`gap-1.5 ${colorClass}`}>
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
}

export function GrowthStageBadge({ stage }: { stage: CropStage }) {
  let colorClass = 'bg-secondary/20 text-secondary hover:bg-secondary/30';
  let Icon = Leaf;

  if (stage === 'Harvest Ready') {
    colorClass = 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/50';
    Icon = Target;
  } else if (stage === 'Completed') {
    colorClass = 'bg-muted text-muted-foreground';
    Icon = CheckCircle2;
  }

  return (
    <Badge variant="outline" className={`gap-1.5 ${colorClass}`}>
      <Icon className="w-3 h-3" />
      {stage}
    </Badge>
  );
}

export function AreaBadge({ area }: { area: number }) {
  return (
    <Badge variant="outline" className="gap-1.5 bg-background text-text-secondary border-border">
      <Target className="w-3 h-3" />
      {area} ha
    </Badge>
  );
}

export function GpsStatusBadge({ available }: { available: boolean }) {
  return (
    <Badge variant="outline" className={`gap-1.5 ${available ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground'}`}>
      <MapPin className="w-3 h-3" />
      {available ? 'GPS Active' : 'No GPS'}
    </Badge>
  );
}

export function HarvestCountdown({ dateString }: { dateString: string }) {
  const harvestDate = new Date(dateString);
  const now = new Date();
  
  // Need to mock current date as July 1, 2026 for the mock dates to make sense, but we can just do real math.
  // We'll calculate days difference.
  const diffTime = harvestDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let text = '';
  let colorClass = 'text-text-secondary bg-background border-border';
  
  if (diffDays < 0) {
    text = 'Harvest Completed';
    colorClass = 'text-muted-foreground bg-muted';
  } else if (diffDays === 0) {
    text = 'Harvest Today';
    colorClass = 'text-primary bg-primary/10 border-primary/20';
  } else if (diffDays === 1) {
    text = 'Harvest Tomorrow';
    colorClass = 'text-primary bg-primary/10 border-primary/20';
  } else if (diffDays <= 7) {
    text = `Harvest in ${diffDays} Days`;
    colorClass = 'text-warning bg-warning/10 border-warning/20';
  } else {
    text = `Harvest in ${diffDays} Days`;
  }

  return (
    <Badge variant="outline" className={`gap-1.5 ${colorClass}`}>
      <Clock className="w-3 h-3" />
      {text}
    </Badge>
  );
}

export function StatusIndicator({ status }: { status: 'Healthy' | 'Warning' | 'Critical' | 'Completed' }) {
  const colors = {
    Healthy: 'bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    Warning: 'bg-warning shadow-[0_0_8px_rgba(234,179,8,0.5)]',
    Critical: 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    Completed: 'bg-muted',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
      <span className="text-sm font-medium text-text-primary">{status}</span>
    </div>
  );
}
