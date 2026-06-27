import { ROUTES } from './routes';
import { 
  LayoutDashboard, 
  Leaf, 
  CloudRain, 
  LineChart, 
  CalendarDays, 
  BrainCircuit, 
  Bug, 
  FileText, 
  Settings 
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD
  },
  {
    title: 'My Farm',
    icon: Leaf,
    href: ROUTES.FARM
  },
  {
    title: 'Crop Calendar',
    icon: CalendarDays,
    href: ROUTES.CALENDAR
  },
  {
    title: 'Weather',
    icon: CloudRain,
    href: ROUTES.WEATHER
  },
  {
    title: 'Market',
    icon: LineChart,
    href: ROUTES.MARKET
  },
  {
    title: 'AI Decision Center',
    icon: BrainCircuit,
    href: ROUTES.AI
  },
  {
    title: 'Disease Detection',
    icon: Bug,
    href: ROUTES.DISEASE
  },
  {
    title: 'Reports',
    icon: FileText,
    href: ROUTES.REPORTS
  },
  {
    title: 'Settings',
    icon: Settings,
    href: ROUTES.SETTINGS
  }
];
