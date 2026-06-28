import { Link, useLocation } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '@/config/sidebar';
import { Leaf, LogOut, HelpCircle, User } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="w-64 flex flex-col h-screen border-r border-border bg-surface glass hidden md:flex">
      <div className="p-6">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Leaf className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-text-primary">AgriSense</h1>
            <p className="text-[10px] text-text-secondary">Know Before You Grow.</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-text-secondary hover:bg-hover hover:text-text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border space-y-2 mt-auto">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:bg-hover hover:text-text-primary transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Ask AgriSense</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary hover:bg-hover hover:text-text-primary transition-colors">
          <User className="w-4 h-4" />
          <span className="text-sm">Profile</span>
        </button>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-text-secondary/70 hover:text-error hover:bg-error/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
