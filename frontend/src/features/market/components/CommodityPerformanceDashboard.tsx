import { MarketPerformanceMetrics } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Activity, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

interface CommodityPerformanceDashboardProps {
  metrics: MarketPerformanceMetrics;
}

export function CommodityPerformanceDashboard({ metrics }: CommodityPerformanceDashboardProps) {
  
  const StatItem = ({ icon: Icon, title, value, colorClass }: any) => (
    <div className="flex items-center gap-4 bg-background/50 border border-border/50 rounded-xl p-4 transition-colors hover:bg-background/80">
      <div className={`p-2.5 rounded-lg bg-background ${colorClass.split(' ')[0]} border ${colorClass.split(' ')[0].replace('text-', 'border-')}/30`}>
        <Icon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
      </div>
      <div>
        <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-0.5">{title}</div>
        <div className={`font-bold text-base leading-tight ${colorClass.split(' ')[0]}`}>{value}</div>
      </div>
    </div>
  );

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Commodity Performance</h2>
      
      <Card className="glass">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <StatItem icon={TrendingUp} title="Highest Growth" value={metrics.highestGrowth} colorClass="text-success" />
            <StatItem icon={Activity} title="Highest Demand" value={metrics.highestDemand} colorClass="text-primary" />
            <StatItem icon={TrendingUp} title="Price Increase" value={metrics.largestPriceIncrease} colorClass="text-info" />
            
            <StatItem icon={AlertTriangle} title="Highest Risk" value={metrics.highestRisk} colorClass="text-error" />
            <StatItem icon={CheckCircle2} title="Most Profitable" value={metrics.mostProfitable} colorClass="text-success" />
            <StatItem icon={Shield} title="Most Stable" value={metrics.mostStable} colorClass="text-primary" />
            
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
