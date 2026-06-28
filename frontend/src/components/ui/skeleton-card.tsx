import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-xl p-6 flex flex-col gap-4", className)}>
      <div className="flex gap-4 items-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
      <Skeleton className="flex-1 w-full mt-4" />
    </div>
  );
}

export function SkeletonTable({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-xl p-6 flex flex-col gap-4", className)}>
      <Skeleton className="h-8 w-1/3 mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-xl p-6 flex flex-col gap-4", className)}>
      <Skeleton className="h-8 w-1/4 mb-4" />
      <div className="flex-1 flex items-end gap-2 h-48 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />
        ))}
      </div>
    </div>
  );
}
