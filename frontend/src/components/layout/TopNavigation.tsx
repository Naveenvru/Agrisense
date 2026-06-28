import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfileDropdown } from './UserProfileDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { SearchDropdown } from './SearchDropdown';

export function TopNavigation() {
  return (
    <header className="h-16 border-b border-border bg-[rgba(10,15,25,0.75)] backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
          <Menu className="w-5 h-5 text-text-secondary" />
        </Button>
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchDropdown />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <NotificationDropdown />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
