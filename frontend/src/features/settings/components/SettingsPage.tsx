import { useState } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Palette, Globe, Shield, Bell, Cpu, Link, Download, HelpCircle, Smartphone } from 'lucide-react';
import { useModal } from '@/components/providers/ModalProvider';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');
  const { openModal } = useModal();

  const handleComingSoon = (feature: string) => {
    openModal({
      type: 'coming_soon',
      title: 'Coming Soon',
      message: `${feature} configuration is not yet available.`
    });
  };

  const tabs = [
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'language', icon: Globe, label: 'Language & Units' },
    { id: 'ai', icon: Cpu, label: 'AI Preferences' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'connected', icon: Link, label: 'Connected Accounts' },
    { id: 'data', icon: Download, label: 'Data Export' },
    { id: 'about', icon: HelpCircle, label: 'About' },
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 pb-20">
      <SectionHeader title="Account Settings" subtitle="Configure your workspace and preferences." />

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 glass rounded-xl p-2 h-fit flex lg:flex-col gap-1 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass rounded-xl p-6 min-h-[400px]">
          
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Appearance</h3>
                <p className="text-sm text-text-secondary mb-6">Customize how AgriSense looks on your device.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary">Theme</h4>
                    <p className="text-xs text-text-secondary">Select your preferred color theme.</p>
                  </div>
                  <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary/50 focus:outline-none">
                    <option>System Default</option>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">AI Preferences</h3>
                <p className="text-sm text-text-secondary mb-6">Tune how the smart assistant interacts with you.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary">Recommendation Frequency</h4>
                    <p className="text-xs text-text-secondary">How often AI should send push notifications.</p>
                  </div>
                  <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary/50 focus:outline-none">
                    <option>Standard</option>
                    <option>High (Aggressive)</option>
                    <option>Low (Quiet)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary">Confidence Threshold</h4>
                    <p className="text-xs text-text-secondary">Only show predictions above this certainty.</p>
                  </div>
                  <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:border-primary/50 focus:outline-none">
                    <option>Balanced (70%)</option>
                    <option>Strict (85%)</option>
                    <option>Loose (50%)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-xl">
                  <div>
                    <h4 className="font-bold text-text-primary">Enable Experimental AI</h4>
                    <p className="text-xs text-text-secondary">Get access to beta computer vision models.</p>
                  </div>
                  <div className="w-10 h-5 bg-primary/20 rounded-full relative flex items-center cursor-pointer">
                    <div className="w-4 h-4 bg-primary rounded-full absolute right-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connected' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Connected Accounts</h3>
                <p className="text-sm text-text-secondary mb-6">Manage third-party integrations.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Google</h4>
                      <p className="text-xs text-success font-medium">Connected</p>
                    </div>
                  </div>
                  <button onClick={() => handleComingSoon('Google Account Management')} className="text-xs font-bold text-text-secondary bg-background border border-border px-3 py-1.5 rounded-lg hover:bg-surface transition-colors">Manage</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-surface/50 border border-border rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md text-white">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Aadhaar Portal (Coming Soon)</h4>
                      <p className="text-xs text-text-secondary">Verify identity for subsidies.</p>
                    </div>
                  </div>
                  <button onClick={() => handleComingSoon('Aadhaar Portal Connection')} className="text-xs font-bold text-text-secondary bg-background border border-border px-3 py-1.5 rounded-lg cursor-not-allowed">Connect</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Fallback for other tabs */}
          {['language', 'notifications', 'security', 'privacy', 'data', 'about'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
              <p className="text-sm text-text-secondary max-w-[300px] mt-2">These settings are currently managed by the global configuration profile.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
