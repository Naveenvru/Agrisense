import { useState, useRef, useEffect } from 'react';
import { User, Settings, Bell, HelpCircle, Moon, LogOut, ChevronDown, MapPin, Phone, Mail, FileText, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useModal } from '@/components/providers/ModalProvider';

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { openModal } = useModal();

  const userName = user?.name || "Naveen";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userEmail = user?.email || "naveen@example.com";

  const handleComingSoon = (feature: string) => {
    setIsOpen(false);
    openModal({
      type: 'coming_soon',
      title: 'Coming Soon',
      message: `${feature} is currently in development and will be available in the next release.`
    });
  };

  const handleNav = (route: string) => {
    setIsOpen(false);
    navigate(route);
  };

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

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 border-l border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md transition-all group"
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30 group-hover:bg-primary/30 transition-colors">
          {userInitials}
        </div>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          
          {/* Header section */}
          <div className="p-5 border-b border-border bg-surface/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/30 shadow-inner">
                {userInitials}
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-lg leading-tight">{userName}</h3>
                <p className="text-xs font-medium text-success mb-1">PRO Subscriber</p>
                <p className="text-[10px] text-text-secondary font-mono tracking-wider">ID: AGR-{user?.id?.substring(0,4) || '8472'}-X</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-3.5 h-3.5" />
                <span>Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary col-span-2">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{userEmail}</span>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border bg-background">
            <div className="p-3 text-center">
              <p className="text-xs text-text-secondary font-medium mb-0.5">Total Farms</p>
              <p className="text-lg font-bold text-text-primary">3</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-text-secondary font-medium mb-0.5">Total Area</p>
              <p className="text-lg font-bold text-primary">12.5 Ac</p>
            </div>
          </div>

          {/* Action Links */}
          <div className="p-2 space-y-1 bg-surface/30">
            <button onClick={() => handleNav(ROUTES.PROFILE)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <User className="w-4 h-4 text-primary" /> My Profile
            </button>
            <button onClick={() => handleNav(ROUTES.SETTINGS)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <Settings className="w-4 h-4 text-secondary" /> Account Settings
            </button>
            <button onClick={() => handleNav(ROUTES.NOTIFICATIONS)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <Bell className="w-4 h-4 text-warning" /> Notifications
            </button>
            <button onClick={() => handleNav(ROUTES.HELP)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <HelpCircle className="w-4 h-4 text-info" /> Help & Support
            </button>
            <div className="h-px bg-border my-1 mx-2"></div>
            <button onClick={() => handleComingSoon('Privacy Policy')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <FileText className="w-4 h-4" /> Privacy
            </button>
            <button onClick={() => handleComingSoon('About AgriSense')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <Info className="w-4 h-4" /> About
            </button>
            <button onClick={() => handleComingSoon('Dark Mode Toggle')} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-left">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4" /> Dark Mode
              </div>
              <div className="w-7 h-4 bg-primary/20 rounded-full relative flex items-center">
                <div className="w-3 h-3 bg-primary rounded-full absolute right-0.5 shadow-sm"></div>
              </div>
            </button>
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-border bg-background">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/80 hover:text-error hover:bg-error/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
