import { useEffect, useState } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Palette, Globe, Shield, Bell, Cpu, Link, Download, HelpCircle, Smartphone } from 'lucide-react';
import { useModal } from '@/components/providers/ModalProvider';
import { apiClient } from '@/lib/axios';

type NotificationSettings = {
  whatsappEnabled: boolean; smsEnabled: boolean; inAppEnabled: boolean;
  dailyDigestEnabled: boolean; marketAlertsEnabled: boolean; weatherAlertsEnabled: boolean;
  cropRemindersEnabled: boolean; diseaseAlertsEnabled: boolean; systemNotificationsEnabled: boolean;
  deliveryTime: string; timezone: string; preferredLanguage: string;
  consent?: { whatsapp: boolean; sms: boolean };
  kannadaTemplatesVerified?: boolean;
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance');
  const { openModal } = useModal();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [notificationError, setNotificationError] = useState('');
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);

  useEffect(() => {
    if (activeTab !== 'notifications') return;
    apiClient.get('/notifications/preferences')
      .then(({ data }) => { setNotificationSettings(data); setNotificationError(''); })
      .catch(() => setNotificationError('Could not load notification preferences. Please try again.'));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'connected') return;
    apiClient.get('/auth/profile').then(({ data }) => setGoogleConnected(Boolean(data?.googleId)))
      .catch(() => setGoogleConnected(null));
  }, [activeTab]);

  const saveNotificationSettings = async (patch: Partial<NotificationSettings>) => {
    if (!notificationSettings) return;
    setNotificationSaving(true);
    setNotificationError('');
    try {
      const { data } = await apiClient.patch('/notifications/preferences', patch);
      setNotificationSettings({ ...notificationSettings, ...data });
    } catch (error: any) {
      setNotificationError(error.response?.data?.message || 'Could not save notification preferences.');
    } finally { setNotificationSaving(false); }
  };

  const setChannelConsent = async (channel: 'whatsapp' | 'sms', enabled: boolean) => {
    if (!notificationSettings) return;
    setNotificationSaving(true);
    setNotificationError('');
    try {
      const { data } = enabled
        ? await apiClient.post('/notifications/preferences/consent', { channel, consentSource: 'account-settings' })
        : await apiClient.post('/notifications/preferences/revoke', { channel });
      setNotificationSettings(data);
    } catch (error: any) {
      setNotificationError(error.response?.data?.message || 'Could not update channel consent.');
    } finally { setNotificationSaving(false); }
  };

  const toggleRow = (key: keyof NotificationSettings, title: string, description: string) => (
    <label key={key} className="flex items-center justify-between gap-4 p-4 bg-surface/50 border border-border rounded-xl">
      <span><span className="block font-bold text-text-primary">{title}</span><span className="block text-xs text-text-secondary mt-1">{description}</span></span>
      <input type="checkbox" checked={Boolean(notificationSettings?.[key])} disabled={notificationSaving}
        onChange={(event) => void saveNotificationSettings({ [key]: event.target.checked } as Partial<NotificationSettings>)}
        className="w-5 h-5 accent-primary" />
    </label>
  );

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
                  <select disabled className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm opacity-60">
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
              
              <div className="rounded-xl border border-border bg-surface/50 p-4 text-sm text-text-secondary">AI assistance preferences and processing consent are not persisted yet. No controls are active here.</div>
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
                      <p className="text-xs font-medium text-text-secondary">{googleConnected === null ? 'Status unavailable' : googleConnected ? 'Connected to Google' : 'Not connected'}</p>
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
          
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">Farmer Notifications</h3>
                <p className="text-sm text-text-secondary">Choose what you receive and when. External messages stay off until you explicitly consent to each channel.</p>
              </div>
              {notificationError && <p role="alert" className="text-sm text-red-400">{notificationError}</p>}
              {!notificationSettings && !notificationError && <p className="text-sm text-text-secondary">Loading preferences…</p>}
              {notificationSettings && <div className="space-y-6">
                <section className="space-y-3">
                  <h4 className="font-bold text-text-primary">Delivery channels</h4>
                  {(['whatsapp', 'sms'] as const).map((channel) => {
                    const consented = notificationSettings.consent?.[channel] ?? false;
                    const label = channel === 'whatsapp' ? 'WhatsApp' : 'SMS';
                    return <div key={channel} className="flex items-center justify-between gap-4 p-4 bg-surface/50 border border-border rounded-xl">
                      <div><h5 className="font-bold text-text-primary">{label}{channel === 'whatsapp' ? ' · preferred' : ' · fallback'}</h5>
                        <p className="text-xs text-text-secondary mt-1">{channel === 'sms' ? 'Used only if WhatsApp delivery fails and SMS consent is active.' : 'Attempted first when enabled and consented.'}</p>
                        <p className="text-xs text-text-secondary mt-1">{consented ? 'Consent recorded' : 'No consent recorded'}</p></div>
                      <button type="button" disabled={notificationSaving} onClick={() => void setChannelConsent(channel, !consented)}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface disabled:opacity-50">
                        {consented ? 'Revoke consent' : `Enable ${label} with consent`}
                      </button>
                    </div>;
                  })}
                  {toggleRow('inAppEnabled', 'In-app notifications', 'Show alerts inside AgriSense.')}
                </section>
                <section className="space-y-3">
                  <h4 className="font-bold text-text-primary">Notification categories</h4>
                  {toggleRow('dailyDigestEnabled', 'Daily agricultural intelligence', 'Daily digest at your local delivery time.')}
                  {toggleRow('marketAlertsEnabled', 'Regional market prices', 'Relevant regional prices and market changes.')}
                  {toggleRow('weatherAlertsEnabled', 'Weather alerts', 'Alerts based on available weather information.')}
                  {toggleRow('cropRemindersEnabled', 'Crop calendar reminders', 'Reminders for registered crop activities.')}
                  {toggleRow('diseaseAlertsEnabled', 'Disease and crop health alerts', 'Risk notices distinguish environmental indicators from confirmed diagnoses.')}
                  {toggleRow('systemNotificationsEnabled', 'System notifications', 'Important account and service updates.')}
                </section>
                <section className="space-y-3">
                  <h4 className="font-bold text-text-primary">Daily schedule and language</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="text-sm text-text-secondary">Delivery time
                      <input type="time" value={notificationSettings.deliveryTime} onChange={(e) => void saveNotificationSettings({ deliveryTime: e.target.value })} className="mt-1 block w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary" />
                    </label>
                    <label className="text-sm text-text-secondary">Timezone (IANA)
                      <input value={notificationSettings.timezone} onChange={(e) => setNotificationSettings({ ...notificationSettings, timezone: e.target.value })} onBlur={() => void saveNotificationSettings({ timezone: notificationSettings.timezone })} placeholder="Asia/Kolkata" className="mt-1 block w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary" />
                    </label>
                    <label className="text-sm text-text-secondary">Language preference
                      <select value={notificationSettings.preferredLanguage} onChange={(e) => void saveNotificationSettings({ preferredLanguage: e.target.value })} className="mt-1 block w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary">
                        <option value="en-kn">English + Kannada (default)</option><option value="en">English</option><option value="kn" disabled>Kannada (translation pending)</option>
                      </select>
                    </label>
                  </div>
                  <p className="text-xs text-text-secondary">Kannada templates are not yet verified, so messages currently use English even when bilingual is selected.</p>
                </section>
              </div>}
            </div>
          )}

          {/* Fallback for other tabs */}
          {['language', 'security', 'privacy', 'data', 'about'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
              <p className="text-sm text-text-secondary max-w-[300px] mt-2">These controls are not connected to persisted account settings yet.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
