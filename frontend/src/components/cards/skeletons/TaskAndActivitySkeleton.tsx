import { Skeleton } from '@/components/ui/skeleton';

export function TaskCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-xl bg-surface/30">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="flex gap-4 relative pl-4 border-l border-border pb-6 last:pb-0">
      <div className="absolute -left-[17px] top-0 p-2 bg-background border border-border rounded-full">
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>
      <div className="space-y-2 w-full">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full max-w-[280px]" />
      </div>
    </div>
  );
}
