import { Card, CardContent } from '@/components/ui/card';
import { Truck, Link, Globe } from 'lucide-react';

export function FutureMarketplacePlaceholders() {
  
  const placeholders = [
    { icon: Link, name: 'Blockchain Marketplace', desc: 'Direct peer-to-peer selling' },
    { icon: Truck, name: 'Logistics Optimization', desc: 'Find nearest transport' },
    { icon: Globe, name: 'Export Opportunities', desc: 'International market matching' }
  ];

  return (
    <Card className="glass">
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Future Capabilities</h3>
        <div className="space-y-3">
          {placeholders.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/30 hover:bg-background/50 transition-colors opacity-80">
                <div className="p-2 rounded-lg bg-surface text-text-secondary">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-primary">{item.name}</h4>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
                <div className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-border text-text-secondary bg-surface">
                  Pending
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
