import { HarvestIntelligence } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Tractor, TrendingDown, Scale, BrainCircuit } from 'lucide-react';

interface HarvestIntelligenceCardProps {
  data: HarvestIntelligence;
}

export function HarvestIntelligenceCard({ data }: HarvestIntelligenceCardProps) {
  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Harvest Market Impact</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Yield Context */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass h-full">
            <CardContent className="p-5 flex flex-col justify-center h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Tractor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">Yield Analysis</h3>
                  <p className="text-xs text-text-secondary">Your Farm vs Region</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary font-medium">Your Farm Yield</span>
                    <span className="font-bold text-text-primary">{data.farmYield} Tons</span>
                  </div>
                  <div className="w-full bg-border/50 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary font-medium">Regional Yield</span>
                    <span className="font-bold text-text-primary">{data.regionalYield} Tons</span>
                  </div>
                  <div className="w-full bg-border/50 rounded-full h-2">
                    <div className="bg-info h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center/Right: Market Supply & Impact */}
        <div className="lg:col-span-2">
          <Card className="glass h-full border-warning/30 bg-warning/5">
            <CardContent className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                
                {/* Supply Pressure */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-warning font-bold text-sm uppercase tracking-wider mb-2">
                    <Scale className="w-4 h-4" />
                    Supply Pressure
                  </div>
                  
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-bold text-text-primary">{data.expectedIncomingSupply} <span className="text-base text-text-secondary font-normal">Tons</span></div>
                    <div className="text-sm font-medium text-warning bg-warning/10 px-2 py-1 rounded mb-1 border border-warning/20 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> Incoming
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary">Expected to hit the market in the next 24 hours.</p>
                </div>

                {/* Price Impact */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-error font-bold text-sm uppercase tracking-wider mb-2">
                    <TrendingDown className="w-4 h-4" />
                    Price Impact
                  </div>
                  
                  <p className="text-base font-semibold text-text-primary leading-snug">
                    {data.expectedPriceImpact}
                  </p>
                </div>
                
              </div>

              {/* Recommendation */}
              <div className="bg-background/80 rounded-xl p-4 border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 text-primary rounded-lg">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-text-primary text-sm">
                    {data.aiRecommendation}
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-sm shrink-0 hover:bg-primary/90 transition-colors">
                  Schedule Harvest
                </button>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}
