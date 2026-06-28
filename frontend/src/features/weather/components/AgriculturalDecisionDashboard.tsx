import { AgriculturalDecision } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Wind, Tractor, Leaf, ShieldAlert, Activity } from 'lucide-react';

interface AgriculturalDecisionDashboardProps {
  decisions: AgriculturalDecision[];
}

export function AgriculturalDecisionDashboard({ decisions }: AgriculturalDecisionDashboardProps) {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'Irrigation Decision': return Droplets;
      case 'Spraying Window': return Wind;
      case 'Harvest Window': return Tractor;
      case 'Fertilizer Window': return Leaf;
      case 'Disease Risk': return ShieldAlert;
      case 'Water Stress': return Activity;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Safe': return 'text-success bg-success/10 border-success/30';
      case 'Caution': return 'text-warning bg-warning/10 border-warning/30';
      case 'High Risk': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'Critical': return 'text-error bg-error/10 border-error/30';
      default: return 'text-secondary bg-secondary/10 border-secondary/30';
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Agricultural Decision Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decisions.map((decision, idx) => {
          const Icon = getIcon(decision.type);
          const colorClass = getStatusColor(decision.status);
          
          return (
            <Card key={idx} className="glass hover:bg-background/80 transition-colors">
              <CardContent className="p-4 md:p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 text-text-primary font-semibold">
                    <div className={`p-1.5 rounded-md ${colorClass.replace('border-', '').replace('text-', 'bg-').replace('/10', '/20')}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {decision.type}
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold border ${colorClass}`}>
                    {decision.status}
                  </div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">Recommended Action</span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {decision.confidence}% Conf
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text-primary">{decision.recommendedAction}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
