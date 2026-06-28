import { WeatherRisk } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskCardProps {
  risks: WeatherRisk[];
}

export function RiskCard({ risks }: RiskCardProps) {
  
  const getRiskDetails = (level: string) => {
    switch(level) {
      case 'Safe': 
        return { color: 'text-success bg-success/10 border-success/30', icon: CheckCircle2 };
      case 'Caution': 
        return { color: 'text-warning bg-warning/10 border-warning/30', icon: AlertTriangle };
      case 'High Risk': 
        return { color: 'text-orange-500 bg-orange-500/10 border-orange-500/30', icon: AlertTriangle };
      case 'Critical': 
        return { color: 'text-error bg-error/10 border-error/30', icon: ShieldAlert };
      default: 
        return { color: 'text-secondary bg-secondary/10 border-secondary/30', icon: AlertTriangle };
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Weather Risk Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk) => {
          const { color, icon: Icon } = getRiskDetails(risk.level);
          
          return (
            <Card key={risk.id} className={`glass border-l-4 ${color.split(' ')[0].replace('text-', 'border-')}`}>
              <CardContent className="p-5 flex flex-col h-full">
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-text-primary">{risk.type}</h3>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {risk.level}
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary mb-4">{risk.description}</p>
                
                <div className="mt-auto bg-background/50 rounded-lg p-3 border border-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-text-primary">Action Required</span>
                    <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">{risk.confidence}% Conf</span>
                  </div>
                  <p className="text-sm font-medium text-text-primary">{risk.recommendation}</p>
                </div>
                
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
