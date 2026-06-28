import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickStatCardProps {
  title: string;
  value: string;
  status: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function QuickStatCard({ title, value, status, icon, trend = 'neutral' }: QuickStatCardProps) {
  return (
    <Card className="glass hover-card h-full">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="p-3 bg-surface/80 rounded-xl text-primary shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h3 className="text-2xl font-heading font-bold text-text-primary mb-1">{value}</h3>
          <p className={`text-xs ${
            trend === 'up' ? 'text-primary' : 
            trend === 'down' ? 'text-error' : 
            'text-text-secondary'
          }`}>
            {status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
