import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function WeatherCardSkeleton() {
  return (
    <Card className="glass h-full">
      <CardContent className="p-6">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-end gap-2">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-6 w-24 mb-1" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-2 items-center">
              <Skeleton className="w-4 h-4 rounded-full shrink-0" />
              <div className="space-y-1 w-full">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
        
        <Skeleton className="h-16 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
