import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNavigation() {
  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5 text-text-secondary" />
        </Button>
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm border border-primary/30">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
