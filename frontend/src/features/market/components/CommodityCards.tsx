import { CommodityDetail } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

interface CommodityCardsProps {
  commodities: CommodityDetail[];
  onSelect: (commodity: CommodityDetail) => void;
}

export function CommodityCards({ commodities, onSelect }: CommodityCardsProps) {
  
  const getTrendStyle = (trend: string) => {
    switch(trend) {
      case 'Bullish': return { color: 'text-success', icon: TrendingUp };
      case 'Bearish': return { color: 'text-error', icon: TrendingDown };
      default: return { color: 'text-info', icon: Minus };
    }
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'Sell Today': return 'text-success bg-success/10 border-success/30';
      case 'Wait': return 'text-warning bg-warning/10 border-warning/30';
      case 'Store': return 'text-info bg-info/10 border-info/30';
      default: return 'text-primary bg-primary/10 border-primary/30';
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Commodity Watchlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {commodities.map((commodity) => {
          const trendStyle = getTrendStyle(commodity.trend);
          const TrendIcon = trendStyle.icon;
          const actionColor = getActionColor(commodity.status);
          
          return (
            <Card 
              key={commodity.id} 
              className="glass hover:bg-background/80 transition-colors cursor-pointer group"
              onClick={() => onSelect(commodity)}
            >
              <CardContent className="p-5 flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-text-primary text-lg leading-tight">{commodity.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TrendIcon className={`w-4 h-4 ${trendStyle.color}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${trendStyle.color}`}>
                        {commodity.trend}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${actionColor}`}>
                    {commodity.status}
                  </div>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-end border-b border-border/50 pb-2">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Current</span>
                    <span className="font-bold text-xl text-text-primary">₹{commodity.currentPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-end border-b border-border/50 pb-2">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Predicted</span>
                    <span className="font-bold text-lg text-primary">₹{commodity.predictedPrice}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
                  View Intelligence
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
                
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
