import { useState, useEffect } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { HelpCircle, MessageSquare, Bug, PlaySquare, FileText, Phone } from 'lucide-react';
import { helpService, HelpOption } from '@/services/mock/help.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/components/providers/ModalProvider';

export function HelpPage() {
  const [options, setOptions] = useState<HelpOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal } = useModal();

  useEffect(() => {
    helpService.getHelpOptions().then(data => {
      setOptions(data);
      setIsLoading(false);
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'HelpCircle': return HelpCircle;
      case 'MessageSquare': return MessageSquare;
      case 'Bug': return Bug;
      case 'PlaySquare': return PlaySquare;
      case 'FileText': return FileText;
      case 'Phone': return Phone;
      default: return HelpCircle;
    }
  };

  const handleClick = (opt: HelpOption) => {
    if (opt.isExternal) {
      window.open('tel:1551');
      return;
    }
    openModal({
      type: 'coming_soon',
      title: opt.title,
      message: `${opt.title} portal is currently under maintenance. Please check back later.`
    });
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 pb-20">
      <SectionHeader title="Help & Support" subtitle="Get assistance and learn how to use AgriSense." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 flex flex-col items-center">
              <Skeleton className="w-16 h-16 rounded-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))
        ) : (
          options.map((opt) => {
            const Icon = getIcon(opt.iconType);
            return (
              <div 
                key={opt.id} 
                onClick={() => handleClick(opt)}
                className={`glass hover-card rounded-xl p-6 flex flex-col items-center text-center cursor-pointer group ${opt.isExternal ? 'border-error/30 relative overflow-hidden' : ''}`}
              >
                {opt.isExternal && <div className="absolute inset-0 bg-error/5 group-hover:bg-error/10 transition-colors"></div>}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${opt.isExternal ? 'animate-pulse relative z-10' : 'group-hover:scale-110 transition-transform'} ${opt.bg} ${opt.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={`font-bold text-text-primary text-lg mb-2 ${opt.isExternal ? 'relative z-10' : ''}`}>{opt.title}</h3>
                <p className={`text-sm text-text-secondary ${opt.isExternal ? 'relative z-10' : ''}`}>{opt.desc}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
