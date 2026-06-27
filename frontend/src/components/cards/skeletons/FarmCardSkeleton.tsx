import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function FarmCardSkeleton() {
  return (
    <Card className="glass h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <div className="space-y-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-4 h-4 rounded-full shrink-0" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-4" />
            </div>
          ))}
        </div>
        
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
