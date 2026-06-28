import { Card, CardContent } from '@/components/ui/card';
import { History, CloudRain, Tractor, TrendingUp, BrainCircuit, Activity, ArrowRight } from 'lucide-react';

export function PricePredictionPipeline() {
  
  const steps = [
    { icon: History, label: 'Historical Trends', color: 'text-text-secondary' },
    { icon: CloudRain, label: 'Weather Impact', color: 'text-info' },
    { icon: Tractor, label: 'Regional Yield', color: 'text-warning' },
    { icon: TrendingUp, label: 'Demand Analysis', color: 'text-success' },
    { icon: BrainCircuit, label: 'AI Model', color: 'text-primary' },
  ];

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">AI Prediction Pipeline</h2>
      <Card className="glass overflow-hidden border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            
            {/* Connecting line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-border/50 -translate-y-1/2 z-0" />
            
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-3 z-10 bg-primary/5 px-2 py-1 rounded-xl w-full md:w-auto relative group">
                  <div className={`p-4 rounded-full bg-background/80 border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-110 ${step.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-text-primary text-center leading-tight max-w-[80px]">
                    {step.label}
                  </span>
                  
                  {/* Mobile connecting arrow */}
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-border md:hidden mt-2" />
                  )}
                </div>
              );
            })}
            
            {/* Final Output */}
            <div className="hidden md:block">
              <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
            </div>
            
            <div className="z-10 bg-primary border-2 border-primary/30 p-4 rounded-xl text-primary-foreground shadow-lg flex flex-col items-center w-full md:w-auto group hover:bg-primary/90 transition-colors">
              <Activity className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">Predicted</span>
              <span className="text-xl font-bold">Price</span>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
