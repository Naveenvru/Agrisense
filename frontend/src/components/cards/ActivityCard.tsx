import { ActivityData } from '@/types/dashboard/Activity';
import { CloudRain, TrendingUp, Sparkles, Tractor, ShieldCheck, Activity } from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityData;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'weather': return <CloudRain className="w-4 h-4 text-secondary" />;
      case 'market': return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'prediction': return <Sparkles className="w-4 h-4 text-ai" />;
      case 'harvest': return <Tractor className="w-4 h-4 text-warning" />;
      case 'auth': return <ShieldCheck className="w-4 h-4 text-primary" />;
      default: return <Activity className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="flex gap-4 relative pl-4 border-l border-border pb-6 last:pb-0">
      <div className="absolute -left-[17px] top-0 p-2 bg-background border border-border rounded-full">
        {getIcon()}
      </div>
      <div>
        <div className="text-xs text-text-secondary mb-1">{activity.time}</div>
        <p className="text-sm text-text-primary">{activity.description}</p>
      </div>
    </div>
  );
}
