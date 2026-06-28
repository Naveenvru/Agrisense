import { Card, CardContent } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

export function EmptyCalendarState({ title = 'No Data', description = 'Nothing to display here.' }) {
  return (
    <Card className="glass border-dashed border-border/50 bg-background/30 h-full">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center opacity-60 min-h-[200px] h-full">
        <Inbox className="w-10 h-10 mb-4 text-text-secondary" />
        <h4 className="font-heading font-semibold text-lg text-text-primary mb-1">{title}</h4>
        <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SkeletonCalendar() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="h-48 bg-muted rounded-2xl animate-pulse" />
      
      {/* Toolbar Skeleton */}
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-24 bg-muted rounded-xl animate-pulse" />
          <div className="h-24 bg-muted rounded-xl animate-pulse" />
          <div className="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
