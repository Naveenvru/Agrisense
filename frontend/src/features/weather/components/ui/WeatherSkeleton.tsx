import { Card, CardContent } from '@/components/ui/card';
import { CloudOff } from 'lucide-react';

export function EmptyWeatherState({ title = 'No Data Available', description = 'Weather information is currently unavailable.' }) {
  return (
    <Card className="glass border-dashed border-border/50 bg-background/30 h-full">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center opacity-60 min-h-[200px] h-full">
        <CloudOff className="w-10 h-10 mb-4 text-text-secondary" />
        <h4 className="font-heading font-semibold text-lg text-text-primary mb-1">{title}</h4>
        <p className="text-sm text-text-secondary max-w-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <div className="h-48 bg-muted rounded-2xl animate-pulse" />
      
      {/* Dashboard Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-48 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
