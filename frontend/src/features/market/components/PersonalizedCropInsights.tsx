import { PersonalizedCropInsight } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, IndianRupee, MapPin, Calendar, TrendingUp } from 'lucide-react';

interface PersonalizedCropInsightsProps {
  insights: PersonalizedCropInsight[];
}

export function PersonalizedCropInsights({ insights }: PersonalizedCropInsightsProps) {
  
  const getRecColor = (rec: string) => {
    switch (rec) {
      case 'Sell Today': return 'text-success bg-success/10 border-success/30';
      case 'Store': return 'text-info bg-info/10 border-info/30';
      case 'Wait': return 'text-warning bg-warning/10 border-warning/30';
      default: return 'text-primary bg-primary/10 border-primary/30';
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-heading font-bold text-text-primary">Your Registered Crops</h2>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">Personalized</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const colorClass = getRecColor(insight.recommendation);
          
          return (
            <Card key={insight.cropId} className="glass hover:bg-background/80 transition-colors">
              <CardContent className="p-5 flex flex-col h-full">
                
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-text-primary leading-tight">{insight.cropName}</h3>
                      <div className="text-sm font-medium text-text-secondary mt-0.5">
                        Current: <span className="text-text-primary font-bold">₹{insight.currentPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-2.5 py-1 rounded-md text-xs font-bold border flex flex-col items-center justify-center text-center leading-tight ${colorClass}`}>
                    <span className="opacity-80 text-[10px] uppercase tracking-wider mb-0.5">Recommendation</span>
                    {insight.recommendation}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
                  <div>
                    <div className="text-xs text-text-secondary font-medium mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Best Date</div>
                    <div className="font-bold text-text-primary">{insight.bestSellingDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary font-medium mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Best Market</div>
                    <div className="font-bold text-text-primary truncate" title={insight.bestMarket}>{insight.bestMarket}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary font-medium mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Target Price</div>
                    <div className="font-bold text-primary">₹{insight.predictedPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-text-secondary font-medium mb-1 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-success" /> Expected Profit</div>
                    <div className="font-bold text-success">+₹{insight.expectedProfit}</div>
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-text-primary">Reason</span>
                    <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">{insight.confidence}% Conf</span>
                  </div>
                  <p className="text-sm font-medium text-text-secondary">{insight.reason}</p>
                </div>
                
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
