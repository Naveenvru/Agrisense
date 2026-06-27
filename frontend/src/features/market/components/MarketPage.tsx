import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';


export function MarketPage() {
  const commodities = [
    { name: "Wheat", price: 210.50, trend: "+4.5%", isUp: true },
    { name: "Corn", price: 180.20, trend: "-1.2%", isUp: false },
    { name: "Soybeans", price: 450.00, trend: "+2.1%", isUp: true },
    { name: "Barley", price: 165.75, trend: "+0.5%", isUp: true }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Market Intelligence" 
        description="Real-time commodity prices and market forecasts." 
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {commodities.map((item, idx) => (
          <Card key={idx} className="glass">
            <CardContent className="p-6">
              <div className="text-text-secondary mb-2 font-medium">{item.name}</div>
              <div className="text-3xl font-heading font-bold text-text-primary mb-2">{formatCurrency(item.price)}</div>
              <div className={`flex items-center gap-1 text-sm ${item.isUp ? 'text-primary' : 'text-error'}`}>
                {item.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {item.trend}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="glass lg:col-span-4 h-96 flex items-center justify-center">
          <div className="text-center text-text-secondary">
             <LineChart className="w-16 h-16 mx-auto mb-4 opacity-50 text-primary" />
             <h3 className="text-xl font-heading font-medium text-text-primary mb-2">Detailed Charts</h3>
             <p>Advanced charting with historical data and AI predictions will appear here.</p>
           </div>
        </Card>
      </div>
    </div>
  );
}
