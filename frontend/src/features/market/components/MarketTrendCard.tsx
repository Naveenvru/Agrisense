import { MarketTrendAnalysis } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketTrendCardProps {
  trends: MarketTrendAnalysis[];
}

export function MarketTrendCard({ trends }: MarketTrendCardProps) {
  
  const getTrendStyle = (sentiment: string) => {
    switch(sentiment) {
      case 'Bullish': return { color: 'text-success border-success bg-success/5', icon: TrendingUp };
      case 'Bearish': return { color: 'text-error border-error bg-error/5', icon: TrendingDown };
      case 'Stable': return { color: 'text-info border-info bg-info/5', icon: Minus };
      default: return { color: 'text-primary border-primary bg-primary/5', icon: Minus };
    }
  };

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Market Sentiment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trends.map((trend, idx) => {
          const style = getTrendStyle(trend.sentiment);
          const Icon = style.icon;
          
          return (
            <Card key={idx} className={`glass border-l-4 ${style.color}`}>
              <CardContent className="p-4 flex flex-col h-full">
                
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg bg-background ${style.color.split(' ')[0]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold text-lg ${style.color.split(' ')[0]}`}>{trend.sentiment}</h3>
                </div>
                
                <p className="text-sm text-text-secondary font-medium">{trend.explanation}</p>
                
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
