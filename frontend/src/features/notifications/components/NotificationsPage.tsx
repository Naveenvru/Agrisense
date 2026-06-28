import { useState, useEffect } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CloudRain, TrendingDown, AlertTriangle, CheckCircle2, Sprout, Cpu, Inbox, Search, Trash2 } from 'lucide-react';
import { notificationsService, NotificationItem } from '@/services/mock/notifications.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/components/providers/ModalProvider';
import { toast } from 'sonner';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Updates' },
    { id: 'weather', label: 'Weather' },
    { id: 'market', label: 'Market' },
    { id: 'disease', label: 'Disease' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'govt', label: 'Govt Schemes' },
    { id: 'system', label: 'System' },
    { id: 'ai', label: 'AI' },
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { openModal } = useModal();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await notificationsService.getNotifications();
        setNotifications(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: number) => {
    openModal({
      type: 'confirm',
      title: 'Delete Notification',
      message: 'Are you sure you want to delete this notification?',
      confirmText: 'Delete',
      onConfirm: () => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success('Notification deleted');
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'CloudRain': return CloudRain;
      case 'TrendingDown': return TrendingDown;
      case 'AlertTriangle': return AlertTriangle;
      case 'Sprout': return Sprout;
      case 'Cpu': return Cpu;
      case 'CheckCircle2': return CheckCircle2;
      default: return Inbox;
    }
  };

  const filtered = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || activeTab === 'unread' && !n.read || n.type === activeTab;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 pb-20">
      <SectionHeader 
        title="Notification Center" 
        subtitle="Your personalized agricultural intelligence feed." 
        action={<button onClick={handleMarkAllRead} className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Mark All Read</button>}
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="glass rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border border-border/50 rounded-lg">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <Inbox className="w-12 h-12 text-text-secondary mb-4" />
              <h3 className="text-lg font-bold text-text-primary">No notifications</h3>
              <p className="text-sm text-text-secondary">You're all caught up in this category.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(notif => {
                const Icon = getIcon(notif.iconType);
                return (
                  <div key={notif.id} className={`p-4 rounded-lg border hover:border-primary/30 transition-colors flex gap-4 relative group ${!notif.read ? 'bg-primary/5 border-primary/20' : 'bg-surface/50 border-border'}`}>
                    {!notif.read && <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r"></div>}
                    <div className={`p-3 rounded-xl shrink-0 h-fit ${notif.bg} ${notif.color} border ${notif.border}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${!notif.read ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary transition-colors'}`}>{notif.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-text-secondary">{notif.time}</span>
                          <button 
                            onClick={() => handleDelete(notif.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-text-secondary hover:text-error transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-snug">{notif.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
