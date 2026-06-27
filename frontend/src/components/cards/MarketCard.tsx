import { Card, CardContent } from '@/components/ui/card';
import { MarketData } from '@/types/dashboard/Market';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MarketCardProps {
  marketItems: MarketData[];
}

export function MarketCard({ marketItems }: MarketCardProps) {
  return (
    <Card className="glass h-full">
      <CardContent className="p-0">
        <div className="p-6 pb-4 border-b border-border">
          <h3 className="text-sm font-medium text-text-secondary">Commodity Markets</h3>
        </div>
        <div className="divide-y divide-border">
          {marketItems.map((item, idx) => (
            <div key={idx} className="p-4 px-6 flex items-center justify-between hover:bg-surface/30 transition-colors">
              <div>
                <div className="font-medium text-text-primary mb-1">{item.commodity}</div>
                <div className="text-xs text-text-secondary">AI Confidence: {item.confidenceScore}%</div>
              </div>
              <div className="text-right">
                <div className="font-heading font-medium text-text-primary">{formatCurrency(item.currentPrice)}</div>
                <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${
                  item.trend === 'up' ? 'text-primary' : 
                  item.trend === 'down' ? 'text-error' : 
                  'text-text-secondary'
                }`}>
                  {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {item.trend === 'stable' && <Minus className="w-3 h-3" />}
                  {item.trendPercentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
