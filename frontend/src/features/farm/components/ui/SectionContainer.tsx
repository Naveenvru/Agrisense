import { ReactNode } from 'react';

interface SectionContainerProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionContainer({ title, children, action }: SectionContainerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="text-lg font-heading font-semibold text-text-primary">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
