export interface NotificationItem {
  id: number;
  type: string;
  iconType: string;
  title: string;
  desc: string;
  time: string;
  color: string;
  bg: string;
  border: string;
  read: boolean;
}

export const mockNotifications: NotificationItem[] = [
  { id: 1, type: 'weather', iconType: 'CloudRain', title: 'Heavy Rain Expected', desc: 'Delay irrigation for 48 hours.', time: '10m ago', color: 'text-info', bg: 'bg-info/10', border: 'border-info/30', read: false },
  { id: 2, type: 'market', iconType: 'TrendingDown', title: 'Tomato Price Drop', desc: 'Prices dropped by ₹250. AI suggests storing.', time: '1h ago', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', read: false },
  { id: 3, type: 'disease', iconType: 'AlertTriangle', title: 'High Disease Risk', desc: 'Humidity levels favor Early Blight in Farm 2.', time: '3h ago', color: 'text-error', bg: 'bg-error/10', border: 'border-error/30', read: false },
  { id: 4, type: 'govt', iconType: 'Sprout', title: 'Subsidy Available', desc: 'PM-Kisan next installment is processing for your ID.', time: '5h ago', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', read: true },
  { id: 5, type: 'ai', iconType: 'Cpu', title: 'Weekly AI Report', desc: 'Your farm efficiency score increased by 4% this week.', time: '12h ago', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30', read: true },
  { id: 6, type: 'system', iconType: 'CheckCircle2', title: 'Harvest Complete', desc: 'Wheat harvest logged successfully.', time: '1d ago', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', read: true },
];

export const notificationsService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockNotifications;
  }
};
