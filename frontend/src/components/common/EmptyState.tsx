import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="glass border-dashed bg-transparent shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        {icon && <div className="mb-4 text-text-secondary opacity-80">{icon}</div>}
        <h3 className="text-lg font-heading font-medium text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm max-w-sm mb-6">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
