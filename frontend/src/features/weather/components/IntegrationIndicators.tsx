import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock } from 'lucide-react';

export function IntegrationIndicators() {
  
  const integrations = [
    { name: 'Weather', status: 'Active' },
    { name: 'Crop Calendar', status: 'Active' },
    { name: 'Disease Detection', status: 'Pending' },
    { name: 'Market Intelligence', status: 'Pending' },
    { name: 'Yield Prediction', status: 'Pending' },
    { name: 'AI Decision Center', status: 'Pending' }
  ];

  return (
    <Card className="glass">
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Module Integrations</h3>
        <div className="space-y-3">
          {integrations.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">{item.name}</span>
              {item.status === 'Active' ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-success/10 text-success text-xs font-bold border border-success/30">
                  <Check className="w-3 h-3" />
                  Active
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-background/50 text-text-secondary opacity-60 text-xs font-medium border border-border/50">
                  <Clock className="w-3 h-3" />
                  Pending
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
