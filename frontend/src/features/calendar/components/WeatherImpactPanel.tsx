import { WeatherImpact } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, Wind, Sun, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';

interface WeatherImpactPanelProps {
  impacts?: WeatherImpact[];
}

export function WeatherImpactPanel({ impacts = [] }: WeatherImpactPanelProps) {
  if (impacts.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px]">
          <div className="p-3 bg-info/10 rounded-full">
            <Sun className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-text-primary font-medium">Optimal Conditions</p>
            <p className="text-sm text-text-secondary mt-1">No significant weather impacts expected today.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (condition: string) => {
    switch (condition) {
      case 'Rain': return CloudRain;
      case 'Wind': return Wind;
      case 'Heat': return Sun;
      case 'Frost': return ThermometerSnowflake;
      default: return CheckCircle2;
    }
  };

  const getColorClass = (effect: string) => {
    switch (effect) {
      case 'Delay': return 'text-error bg-error/10 border-error/20';
      case 'Accelerate': return 'text-warning bg-warning/10 border-warning/20';
      case 'Modify': return 'text-info bg-info/10 border-info/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  return (
    <Card className="glass">
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold text-lg text-text-primary mb-4">Weather Impact</h3>
        <div className="space-y-3">
          {impacts.map((impact, i) => {
            const Icon = getIcon(impact.condition);
            return (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                <div className={`p-2 rounded-md h-fit ${getColorClass(impact.effect).replace('border-', '')}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-text-primary">{impact.condition} Warning</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getColorClass(impact.effect)}`}>
                      {impact.effect}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">{impact.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
