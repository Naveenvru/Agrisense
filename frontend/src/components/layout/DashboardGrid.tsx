import type { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enforces the frozen responsive rules:
 * Mobile: Single-column stack (grid-cols-1)
 * Tablet: 2-column grid (md:grid-cols-2)
 * Desktop: 4-column grid (lg:grid-cols-4)
 */
export function DashboardGrid({ children, className = '' }: DashboardGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  );
}
