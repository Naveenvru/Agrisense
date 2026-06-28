import { MarketDecision } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Clock, MapPin, IndianRupee, TrendingUp, ShieldAlert } from 'lucide-react';

interface MarketDecisionDashboardProps {
  decision: MarketDecision;
}

export function MarketDecisionDashboard({ decision }: MarketDecisionDashboardProps) {
  
  const DashboardItem = ({ icon: Icon, title, value, colorClass }: any) => (
    <Card className="glass hover:bg-background/80 transition-colors">
      <CardContent className="p-4 flex items-start gap-4">
        <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-').replace('/10', '/20')}`}>
          <Icon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
        </div>
        <div>
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">{title}</div>
          <div className="font-bold text-text-primary text-base">{value}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Market Decision Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardItem 
          icon={ShoppingCart} 
          title="Sell Today?" 
          value={decision.sellToday ? 'Yes, Strong Demand' : 'No'} 
          colorClass={decision.sellToday ? 'text-success bg-success/10' : 'text-error bg-error/10'} 
        />
        <DashboardItem 
          icon={Clock} 
          title="Wait Time" 
          value={decision.waitDays === 0 ? 'Don\'t Wait' : `${decision.waitDays} Days`} 
          colorClass="text-info bg-info/10" 
        />
        <DashboardItem 
          icon={MapPin} 
          title="Best Market" 
          value={decision.bestMarket} 
          colorClass="text-primary bg-primary/10" 
        />
        <DashboardItem 
          icon={IndianRupee} 
          title="Expected Profit" 
          value={`₹${decision.expectedProfit.toLocaleString()}`} 
          colorClass="text-success bg-success/10" 
        />
        <DashboardItem 
          icon={TrendingUp} 
          title="Price Trend" 
          value={decision.trend} 
          colorClass={decision.trend === 'Bullish' ? 'text-success bg-success/10' : decision.trend === 'Stable' ? 'text-warning bg-warning/10' : 'text-error bg-error/10'} 
        />
        <DashboardItem 
          icon={ShieldAlert} 
          title="Market Risk" 
          value={decision.risk} 
          colorClass={decision.risk === 'Safe' ? 'text-success bg-success/10' : 'text-orange-500 bg-orange-500/10'} 
        />
      </div>
    </section>
  );
}
