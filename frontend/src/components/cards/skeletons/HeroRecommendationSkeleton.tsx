import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroRecommendationSkeleton() {
  return (
    <Card className="glass overflow-hidden w-full">
      <CardContent className="p-8 flex flex-col md:flex-row gap-8">
        <div className="space-y-6 flex-1">
          <div>
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <div className="bg-surface/50 border border-primary/10 rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
          <Skeleton className="h-32 w-full md:w-48 rounded-xl" />
          <Skeleton className="h-32 w-full md:w-48 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
