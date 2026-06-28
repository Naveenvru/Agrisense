import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Edit, Archive, Trash2, History } from 'lucide-react';

interface ActionMenuProps {
  onViewDetails: () => void;
}

export function ActionMenu({ onViewDetails }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 hover:bg-background/80" 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MoreVertical className="w-4 h-4 text-text-secondary" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-xl py-1 z-20 animate-in fade-in slide-in-from-top-2">
          <button 
            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-hover flex items-center gap-2"
            onClick={(e) => handleAction(e, onViewDetails)}
          >
            <Eye className="w-4 h-4 text-text-secondary" />
            View Details
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-hover flex items-center gap-2 opacity-50 cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
            disabled
          >
            <Edit className="w-4 h-4" />
            Edit Farm
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-hover flex items-center gap-2 opacity-50 cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
            disabled
          >
            <History className="w-4 h-4" />
            History
          </button>
          <div className="h-px bg-border my-1" />
          <button 
            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-hover flex items-center gap-2 opacity-50 cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
            disabled
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2 opacity-50 cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
            disabled
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
