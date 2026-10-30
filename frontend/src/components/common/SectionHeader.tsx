import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h2 className="text-xl font-heading font-semibold text-text-primary">{t(title)}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{t(subtitle)}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
