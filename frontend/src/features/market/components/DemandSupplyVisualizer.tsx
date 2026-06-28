import { DemandSupplyMetrics } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface DemandSupplyVisualizerProps {
  metrics: DemandSupplyMetrics;
}

export function DemandSupplyVisualizer({ metrics }: DemandSupplyVisualizerProps) {
  
  const getPressureColor = (pressure: string) => {
    switch(pressure) {
      case 'High': return 'text-success bg-success/10 border-success/30';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/30';
      case 'Low': return 'text-error bg-error/10 border-error/30';
      default: return 'text-primary bg-primary/10 border-primary/30';
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Market Demand vs Supply</h2>
      
      <Card className="glass">
        <CardContent className="p-5 md:p-6 space-y-6">
          
          {/* Demand */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <TrendingUp className="w-5 h-5 text-success" />
                Current Demand
              </div>
              <span className="text-sm font-bold text-success">{metrics.currentDemand}%</span>
            </div>
            
            <div className="w-full bg-background border border-border/50 rounded-full h-4 overflow-hidden flex">
              {/* Blocks visual effect */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`h-full flex-1 border-r border-background/20 last:border-0 transition-all duration-500 ${
                  i < (metrics.currentDemand / 5) ? 'bg-success' : 'bg-transparent'
                }`} />
              ))}
            </div>
          </div>
          
          {/* Supply */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <TrendingDown className="w-5 h-5 text-warning" />
                Market Supply
              </div>
              <span className="text-sm font-bold text-warning">{metrics.regionalSupply}% Capacity</span>
            </div>
            
            <div className="w-full bg-background border border-border/50 rounded-full h-4 overflow-hidden flex">
              {/* Blocks visual effect */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`h-full flex-1 border-r border-background/20 last:border-0 transition-all duration-500 ${
                  i < (metrics.regionalSupply / 5) ? 'bg-warning' : 'bg-transparent'
                }`} />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary">Expected Market Pressure</span>
              <span className="text-sm text-text-secondary">Demand is heavily outpacing supply</span>
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-bold text-sm border flex items-center gap-2 ${getPressureColor(metrics.expectedMarketPressure)}`}>
              <Scale className="w-4 h-4" />
              {metrics.expectedMarketPressure} Pressure
            </div>
          </div>
          
        </CardContent>
      </Card>
    </section>
  );
}
