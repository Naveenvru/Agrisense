import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DrawerSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  iconColor?: string;
}

export function DrawerSection({ title, icon: Icon, children, iconColor = 'text-ai' }: DrawerSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h4 className="text-sm font-heading font-semibold text-text-primary uppercase tracking-wider">{title}</h4>
      </div>
      <div className="bg-surface/50 border border-border rounded-xl p-4">
        {children}
      </div>
    </div>
  );
}
