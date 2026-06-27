import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MarketCardSkeleton() {
  return (
    <Card className="glass h-full">
      <CardContent className="p-0">
        <div className="p-6 pb-4 border-b border-border">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 px-6 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="space-y-2 text-right flex flex-col items-end">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
