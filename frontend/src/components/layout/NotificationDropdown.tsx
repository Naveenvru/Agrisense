import { useState, useRef, useEffect } from 'react';
import { Bell, CloudRain, TrendingDown, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, type: 'weather', icon: CloudRain, title: 'Heavy Rain Expected', desc: 'Delay irrigation for 48 hours.', time: '10m ago', color: 'text-info', bg: 'bg-info/10', border: 'border-info/30', read: false },
    { id: 2, type: 'market', icon: TrendingDown, title: 'Tomato Price Drop', desc: 'Prices dropped by ₹250. AI suggests storing.', time: '1h ago', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', read: false },
    { id: 3, type: 'disease', icon: AlertTriangle, title: 'High Disease Risk', desc: 'Humidity levels favor Early Blight in Farm 2.', time: '3h ago', color: 'text-error', bg: 'bg-error/10', border: 'border-error/30', read: false },
    { id: 4, type: 'system', icon: CheckCircle2, title: 'Harvest Complete', desc: 'Wheat harvest logged successfully.', time: '1d ago', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', read: true },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative hover:bg-primary/5 transition-colors rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-text-secondary" />
        <span className="absolute top-1.5 right-2 w-2 h-2 bg-error rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-border bg-surface/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text-primary">Notifications</h3>
              <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold">3 New</span>
            </div>
            <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-background">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div key={notif.id} className={`p-4 border-b border-border/50 hover:bg-surface/50 transition-colors cursor-pointer flex gap-3 relative ${!notif.read ? 'bg-primary/5' : ''}`}>
                  {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"></div>}
                  <div className={`p-2 rounded-xl shrink-0 h-fit ${notif.bg} ${notif.color} border ${notif.border}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${!notif.read ? 'text-text-primary' : 'text-text-secondary'}`}>{notif.title}</h4>
                      <span className="text-[10px] font-medium text-text-secondary">{notif.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-snug">{notif.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border bg-surface/50">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors">
              View all notifications <ChevronRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
