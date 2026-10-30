import { Badge } from '@/components/ui/badge';
import { getAreaUnit } from '@/features/settings/services/account-preferences';
import { HealthStatus, CropStage } from '../../types';
import { Leaf, MapPin, Target, Activity, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export function HealthBadge({ status }: { status: HealthStatus }) {
  let colorClass = '';
  let Icon = Activity;

  switch (status) {
    case 'Healthy':
      colorClass = 'bg-success/15 text-success hover:bg-success/25 border-success/30';
      Icon = CheckCircle2;
      break;
    case 'Medium Risk':
      colorClass = 'bg-warning/15 text-warning hover:bg-warning/25 border-warning/30';
      Icon = AlertTriangle;
      break;
    case 'Needs Attention':
      colorClass = 'bg-warning/15 text-warning hover:bg-warning/25 border-warning/30';
      Icon = AlertTriangle;
      break;
    case 'Critical':
      colorClass = 'bg-error/15 text-error hover:bg-error/25 border-error/30';
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
    colorClass = 'bg-primary/15 text-primary hover:bg-primary/25 border-primary/30';
    Icon = Target;
  } else if (stage === 'Flowering') {
    colorClass = 'bg-secondary/15 text-secondary hover:bg-secondary/25 border-secondary/30';
    Icon = Leaf;
  } else if (stage === 'Completed') {
    colorClass = 'bg-muted text-text-secondary border-border';
    Icon = CheckCircle2;
  } else {
    colorClass = 'bg-info/15 text-info hover:bg-info/25 border-info/30';
    Icon = Leaf;
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
      {area} {getAreaUnit()}
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
    colorClass = 'text-text-secondary bg-muted border-border';
  } else if (diffDays === 0) {
    text = 'Harvest Today';
    colorClass = 'text-success bg-success/10 border-success/30 font-medium';
  } else if (diffDays === 1) {
    text = 'Harvest Tomorrow';
    colorClass = 'text-success bg-success/10 border-success/30 font-medium';
  } else if (diffDays <= 7) {
    text = `Harvest in ${diffDays} Days`;
    colorClass = 'text-warning bg-warning/10 border-warning/30 font-medium';
  } else {
    text = `Harvest in ${diffDays} Days`;
    colorClass = 'text-primary bg-primary/5 border-primary/20';
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
