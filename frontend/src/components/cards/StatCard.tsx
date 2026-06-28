import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, description, className = '' }: StatCardProps) {
  return (
    <Card className={`glass hover-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-heading font-bold text-text-primary">{value}</span>
          {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
              {trend.isPositive ? '+' : '-'}{trend.value}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-text-secondary mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
}
