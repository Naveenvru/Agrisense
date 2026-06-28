import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="glass border-dashed border-border/60 shadow-none bg-background/40">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary max-w-sm mb-6">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
