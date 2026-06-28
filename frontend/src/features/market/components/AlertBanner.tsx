import { MarketAlert } from '../types';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface AlertBannerProps {
  alerts: MarketAlert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  if (!alerts || alerts.length === 0) return null;

  const getAlertStyle = (severity: string) => {
    switch(severity) {
      case 'Information': return { bg: 'bg-info/10', border: 'border-info/30', text: 'text-info', icon: Info };
      case 'Warning': return { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: AlertTriangle };
      case 'High Risk': return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500', icon: AlertTriangle };
      case 'Critical': return { bg: 'bg-error/10', border: 'border-error/30', text: 'text-error', icon: ShieldAlert };
      default: return { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: Info };
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {alerts.map(alert => {
        const style = getAlertStyle(alert.severity);
        const Icon = style.icon;
        
        return (
          <div key={alert.id} className={`flex items-start md:items-center gap-4 p-4 rounded-xl border backdrop-blur ${style.bg} ${style.border}`}>
            <div className={`p-2 rounded-full bg-background/50 ${style.text}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                <h4 className={`font-bold ${style.text}`}>{alert.title}</h4>
                <span className="text-xs font-medium opacity-70 text-text-secondary">{alert.time}</span>
              </div>
              <p className="text-sm text-text-primary mt-1">{alert.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
