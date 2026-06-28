import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionSection({ title, children, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card/50">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 bg-background/50 hover:bg-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-heading font-semibold text-text-primary text-base">{title}</span>
        <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
