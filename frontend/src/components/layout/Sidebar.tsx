import { Link, useLocation } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '@/config/sidebar';
import { Activity, CloudRain, TrendingUp, Sprout } from 'lucide-react';
import { ROUTES } from '@/config/routes';

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 flex flex-col h-screen border-r border-border bg-[rgba(12,18,30,0.85)] backdrop-blur-md hidden md:flex relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)]">
      <div className="p-6 pb-2 flex justify-center">
        <Link to={ROUTES.DASHBOARD} className="flex flex-col items-center justify-center gap-1 w-full group">
          <img 
            src="/logo.png" 
            alt="AgriSense Logo" 
            className="h-[70px] w-auto object-contain group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.6)] transition-all" 
          />
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

      <div className="p-4 border-t border-border mt-auto">
        {/* Ask AgriSense AI Card */}
        <div className="bg-[rgba(15,23,42,0.72)] backdrop-blur-md border border-border rounded-xl p-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <h3 className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
            <span className="text-primary">🌱</span> Ask AgriSense AI
          </h3>
          <p className="text-[10px] text-text-secondary mb-3">Your Smart Farming Assistant</p>
          
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Quick Actions:</p>
          <ul className="space-y-1.5 mb-4">
            <li className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}><Activity className="w-3.5 h-3.5 text-primary/70" /> Diagnose Disease</li>
            <li className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}><CloudRain className="w-3.5 h-3.5 text-info/70" /> Weather Advice</li>
            <li className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}><TrendingUp className="w-3.5 h-3.5 text-success/70" /> Market Intelligence</li>
            <li className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}><Sprout className="w-3.5 h-3.5 text-warning/70" /> Crop Planning</li>
            <li className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}><Sprout className="w-3.5 h-3.5 text-secondary/70" /> Government Schemes</li>
          </ul>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
            className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center"
          >
            Open AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
