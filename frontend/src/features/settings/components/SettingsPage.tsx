import { FormEvent, useEffect, useState } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Palette, Globe, Shield, Bell, Cpu, Link as LinkIcon, Download, HelpCircle, Monitor, Moon, Sun, LogOut, KeyRound, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/axios';
import { APP_LANGUAGES, APP_TRANSLATION_LANGUAGES, AccountPreferences, formatTemperature, getCurrentLocale } from '../services/account-preferences';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

type Settings = AccountPreferences & { account?: { name: string; email: string; authProvider?: string; googleId?: string | null; phoneNumber?: string | null } };
type NotificationSettings = {
  whatsappEnabled: boolean; smsEnabled: boolean; inAppEnabled: boolean;
  dailyDigestEnabled: boolean; marketAlertsEnabled: boolean; weatherAlertsEnabled: boolean;
  cropRemindersEnabled: boolean; diseaseAlertsEnabled: boolean; systemNotificationsEnabled: boolean;
  deliveryTime: string; timezone: string; preferredLanguage: string;
  consent?: { whatsapp: boolean; sms: boolean };
};

const tabs = [
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'language', icon: Globe, label: 'Language & Units' },
  { id: 'ai', icon: Cpu, label: 'AI Preferences' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'privacy', icon: Download, label: 'Privacy & Data' },
  { id: 'connected', icon: LinkIcon, label: 'Connected Accounts' },
  { id: 'about', icon: HelpCircle, label: 'About AgriSense' },
];

const themes = [
  { id: 'farm', label: 'Farm green', detail: 'Leaf green and cyan' },
  { id: 'ocean', label: 'Ocean blue', detail: 'Clear blue and teal' },
  { id: 'sunrise', label: 'Harvest amber', detail: 'Warm amber and green' },
] as const;

export function SettingsPage() {
  const { t } = useTranslation();
  const { logout, updatePreferences } = useAuth();
  const [activeTab, setActiveTab] = useState(() => new URLSearchParams(window.location.search).get('google') === 'connected' ? 'connected' : 'appearance');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);
  const [googlePassword, setGooglePassword] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    apiClient.get('/settings').then(({ data }) => {
      setSettings(data);
      setLoading(false);
    }).catch((e) => {
      setError(e.response?.data?.message || 'Could not load your account settings.');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (activeTab !== 'notifications' || notifications) return;
    apiClient.get('/notifications/preferences').then(({ data }) => setNotifications(data))
      .catch((e) => setError(e.response?.data?.message || 'Could not load notification preferences.'));
  }, [activeTab, notifications]);

  useEffect(() => {
    if (activeTab !== 'connected') return;
    apiClient.get('/auth/profile').then(({ data }) => setGoogleConnected(Boolean(data?.googleId)))
      .catch(() => setGoogleConnected(null));
  }, [activeTab]);

  const saveSettings = async (patch: Partial<AccountPreferences>) => {
    if (!settings) return;
    setSaving(true); setError('');
    try {
      const { data } = await apiClient.patch('/settings', patch);
      setSettings(data);
      const prefs: AccountPreferences = {
        theme: data.theme, accentTheme: data.accentTheme, units: data.units,
        language: data.language, aiAssistanceEnabled: data.aiAssistanceEnabled,
        personalizedRecommendationsEnabled: data.personalizedRecommendationsEnabled,
      };
      updatePreferences(prefs);
      toast.success(t('Settings saved'));
    } catch (e: any) {
      setError(e.response?.data?.message || 'Could not save this setting.');
      toast.error('Setting could not be saved');
    } finally { setSaving(false); }
  };

  const saveNotification = async (patch: Partial<NotificationSettings>) => {
    if (!notifications) return;
    setSaving(true); setError('');
    try {
      const { data } = await apiClient.patch('/notifications/preferences', patch);
      setNotifications({ ...notifications, ...data });
      toast.success(t('Notification preference saved'));
    } catch (e: any) { setError(e.response?.data?.message || 'Could not save notification preferences.'); }
    finally { setSaving(false); }
  };

  const setChannelConsent = async (channel: 'whatsapp' | 'sms', enabled: boolean) => {
    if (!notifications) return;
    setSaving(true); setError('');
    try {
      const { data } = enabled
        ? await apiClient.post('/notifications/preferences/consent', { channel, consentSource: 'account-settings' })
        : await apiClient.post('/notifications/preferences/revoke', { channel });
      setNotifications(data);
      toast.success(enabled ? `${channel === 'sms' ? 'SMS' : 'WhatsApp'} consent recorded` : `${channel === 'sms' ? 'SMS' : 'WhatsApp'} consent revoked`);
    } catch (e: any) { setError(e.response?.data?.message || 'Could not update channel consent.'); }
    finally { setSaving(false); }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (passwords.newPassword !== passwords.confirmPassword) { setError('New password and confirmation do not match.'); return; }
    if (passwords.newPassword.length < 8) { setError('Use at least 8 characters for your new password.'); return; }
    setPasswordSaving(true);
    try {
      await apiClient.post('/settings/password', { currentPassword: passwords.currentPassword || undefined, newPassword: passwords.newPassword });
      toast.success('Password saved. Sign in again on your devices.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      logout();
    } catch (e: any) { setError(e.response?.data?.message || 'Could not change the password.'); }
    finally { setPasswordSaving(false); }
  };

  const exportData = async () => {
    setExporting(true); setError('');
    try {
      const { data } = await apiClient.get('/settings/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `agrisense-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.click(); URL.revokeObjectURL(url);
      toast.success('Your data export is ready');
    } catch (e: any) { setError(e.response?.data?.message || 'Could not export account data.'); }
    finally { setExporting(false); }
  };

  const connectGoogle = async () => {
    setSaving(true); setError('');
    try {
      const { data } = await apiClient.post('/settings/connections/google/link-ticket');
      const baseUrl = (apiClient.defaults.baseURL || window.location.origin).replace(/\/+$/, '');
      window.location.assign(`${baseUrl}/auth/google/link?state=${encodeURIComponent(data.ticket)}`);
    } catch (e: any) { setSaving(false); setError(e.response?.data?.message || 'Could not start Google account linking.'); }
  };

  const disconnectGoogle = async () => {
    setSaving(true); setError('');
    try {
      await apiClient.delete('/settings/connections/google', { data: { currentPassword: googlePassword } });
      toast.success('Google disconnected. Please sign in again.');
      logout();
    } catch (e: any) { setError(e.response?.data?.message || 'Could not disconnect Google.'); }
    finally { setSaving(false); }
  };

  const saveToggle = (key: keyof AccountPreferences, title: string, description: string) => <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4">
    <span><span className="block font-semibold text-text-primary">{title}</span><span className="mt-1 block text-xs text-text-secondary">{description}</span></span>
    <input type="checkbox" checked={Boolean(settings?.[key])} disabled={saving || (key === 'personalizedRecommendationsEnabled' && !settings?.aiAssistanceEnabled)} onChange={(event) => void saveSettings({ [key]: event.target.checked } as Partial<AccountPreferences>)} className="h-5 w-5 accent-primary" />
  </label>;

  const notificationToggle = (key: keyof NotificationSettings, title: string, description: string) => <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4">
    <span><span className="block font-semibold text-text-primary">{title}</span><span className="mt-1 block text-xs text-text-secondary">{description}</span></span>
    <input type="checkbox" checked={Boolean(notifications?.[key])} disabled={saving} onChange={(event) => void saveNotification({ [key]: event.target.checked } as Partial<NotificationSettings>)} className="h-5 w-5 accent-primary" />
  </label>;

  const selectClass = 'mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary';

  return <div className="flex h-full animate-in fade-in flex-col pb-20 duration-500">
    <SectionHeader title="Account Settings" subtitle="Your preferences are saved to your AgriSense account and follow you between devices." />
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      <nav aria-label="Settings sections" className="glass flex h-fit w-full shrink-0 gap-1 overflow-x-auto rounded-xl p-2 lg:w-64 lg:flex-col">
        {tabs.map(({ id, icon: Icon, label }) => <button key={id} type="button" onClick={() => { setActiveTab(id); setError(''); }} aria-current={activeTab === id ? 'page' : undefined} className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === id ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}><Icon className="h-4 w-4 shrink-0" />{t(label)}</button>)}
      </nav>
      <main className="glass min-h-[500px] flex-1 rounded-xl p-5 md:p-7">
        {error && <div role="alert" className="mb-5 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{t(error)}</div>}
        {loading && <div className="flex items-center gap-2 py-10 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin" />{t('Loading')}…</div>}
        {!loading && !settings && <p className="py-6 text-sm text-text-secondary">Settings are unavailable. Check your connection and refresh.</p>}
        {!loading && settings && <>
        {activeTab === 'appearance' && <section className="space-y-6">
            <div><h2 className="text-xl font-bold text-text-primary">{t('Appearance')}</h2><p className="mt-1 text-sm text-text-secondary">{t('Choose how AgriSense looks on this and your other devices.')}</p></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ id: 'system', label: 'System', Icon: Monitor }, { id: 'light', label: 'Light', Icon: Sun }, { id: 'dark', label: 'Dark', Icon: Moon }].map(({ id, label, Icon }) => <button key={id} type="button" disabled={saving} onClick={() => void saveSettings({ theme: id as Settings['theme'] })} className={`rounded-xl border p-4 text-left transition-colors ${settings.theme === id ? 'border-primary bg-primary/10' : 'border-border bg-surface/50 hover:border-primary/50'}`}><Icon className="mb-3 h-5 w-5 text-primary" /><span className="block font-semibold text-text-primary">{t(label)}</span><span className="mt-1 block text-xs text-text-secondary">{id === 'system' ? t('Follow your device setting') : t('Use {{theme}} colors', { theme: id })}</span>{settings.theme === id && <Check className="mt-3 h-4 w-4 text-primary" />}</button>)}
            </div>
            <div><h3 className="mb-3 font-semibold text-text-primary">{t('Color theme')}</h3><div className="grid gap-3 sm:grid-cols-3">{themes.map((theme) => <button key={theme.id} type="button" disabled={saving} onClick={() => void saveSettings({ accentTheme: theme.id })} className={`rounded-xl border p-4 text-left ${settings.accentTheme === theme.id ? 'border-primary bg-primary/10' : 'border-border bg-surface/50 hover:border-primary/50'}`}><span className={`mb-3 block h-3 rounded-full ${theme.id === 'farm' ? 'bg-green-500' : theme.id === 'ocean' ? 'bg-sky-500' : 'bg-amber-500'}`} /><span className="font-semibold text-text-primary">{t(theme.label)}</span><span className="mt-1 block text-xs text-text-secondary">{t(theme.detail)}</span></button>)}</div></div>
          </section>}

          {activeTab === 'language' && <section className="max-w-2xl space-y-6">
            <div><h2 className="text-xl font-bold text-text-primary">{t('Language & Units')}</h2><p className="mt-1 text-sm text-text-secondary">{t('Set your preferred Indian language, number locale, and measurement system.')}</p></div>
            <label className="block text-sm font-medium text-text-secondary">{t('Preferred language')}<select className={selectClass} value={settings.language} disabled={saving} onChange={(e) => void saveSettings({ language: e.target.value })}>{APP_LANGUAGES.map((language) => { const translated = APP_TRANSLATION_LANGUAGES.includes(language.code as typeof APP_TRANSLATION_LANGUAGES[number]); return <option value={language.code} key={language.code} disabled={!translated}>{language.nativeName} · {language.name}{translated ? '' : ` (${t('UI translation pending')})`}</option>; })}</select></label>
            <label className="block text-sm font-medium text-text-secondary">{t('Measurement system')}<select className={selectClass} value={settings.units} disabled={saving} onChange={(e) => void saveSettings({ units: e.target.value as Settings['units'] })}><option value="metric">Metric · hectares, °C, kg</option><option value="imperial">Imperial · acres, °F, lb</option></select></label>
            <div className="rounded-xl border border-border bg-surface/50 p-4"><h3 className="font-semibold text-text-primary">{t('Preview')}</h3><p className="mt-2 text-sm text-text-secondary">{new Intl.NumberFormat(getCurrentLocale()).format(123456.78)} · {formatTemperature(28, settings.units)}</p></div>
          </section>}

          {activeTab === 'ai' && <section className="max-w-3xl space-y-5">
            <div><h2 className="text-xl font-bold text-text-primary">{t('AI Preferences')}</h2><p className="mt-1 text-sm text-text-secondary">{t('AI features are off until you turn them on. When enabled, prompts and submitted crop images are processed by the configured AI provider.')}</p></div>
            {saveToggle('aiAssistanceEnabled', 'Allow AI assistance', 'Enables AgriSense chat, AI explanations, and crop-image assessments. You can turn this off at any time.')}
            {saveToggle('personalizedRecommendationsEnabled', 'Personalize recommendations', 'Allows AgriSense to use your saved farm and crop context when preparing AI recommendations. Requires AI assistance.')}
            <p className="text-xs text-text-secondary">Market Decision Center queries use stored market observations and remain available with AI assistance off.</p>
          </section>}

          {activeTab === 'notifications' && <section className="space-y-6">
            <div><h2 className="text-xl font-bold text-text-primary">{t('Notifications')}</h2><p className="mt-1 text-sm text-text-secondary">{t('Channel consent is independent. External messages are never authorized by category preferences alone.')}</p></div>
            {!notifications ? <p className="text-sm text-text-secondary">Loading notification settings…</p> : <>
              <div><h3 className="mb-3 font-semibold text-text-primary">Delivery channels</h3><div className="space-y-3">{(['whatsapp', 'sms'] as const).map((channel) => { const consented = notifications.consent?.[channel] ?? false; const label = channel === 'whatsapp' ? 'WhatsApp' : 'SMS'; return <div key={channel} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4"><div><p className="font-semibold text-text-primary">{label}{channel === 'whatsapp' ? ' · preferred' : ' · fallback'}</p><p className="mt-1 text-xs text-text-secondary">{channel === 'sms' ? 'Only used after WhatsApp fails, with separate SMS consent.' : 'Attempted first when enabled and consented.'}</p><p className="mt-1 text-xs text-text-secondary">{consented ? 'Consent active' : 'No consent'}</p></div><button type="button" disabled={saving} onClick={() => void setChannelConsent(channel, !consented)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-background">{consented ? `Revoke ${label} consent` : `Enable ${label} with consent`}</button></div>; })}{notificationToggle('inAppEnabled', 'In-app notifications', 'Show alerts inside AgriSense.')}</div></div>
              <div><h3 className="mb-3 font-semibold text-text-primary">Notification categories</h3><div className="space-y-3">{notificationToggle('dailyDigestEnabled', 'Daily agricultural intelligence', 'Daily digest at your local delivery time.')}{notificationToggle('marketAlertsEnabled', 'Regional market prices', 'Market information for your selected region.')}{notificationToggle('weatherAlertsEnabled', 'Weather alerts', 'Weather notices based on available observations.')}{notificationToggle('cropRemindersEnabled', 'Crop calendar reminders', 'Reminders for registered crop activities.')}{notificationToggle('diseaseAlertsEnabled', 'Disease and crop health alerts', 'Crop health notices based on available evidence.')}{notificationToggle('systemNotificationsEnabled', 'System notifications', 'Important account and service updates.')}</div></div>
              <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-text-secondary">Daily delivery time<input className={selectClass} type="time" value={notifications.deliveryTime} disabled={saving} onChange={(e) => void saveNotification({ deliveryTime: e.target.value })} /></label><label className="text-sm text-text-secondary">Time zone (IANA)<input className={selectClass} value={notifications.timezone} onChange={(e) => setNotifications({ ...notifications, timezone: e.target.value })} onBlur={() => void saveNotification({ timezone: notifications.timezone })} placeholder="Asia/Kolkata" /></label></div>
              <p className="text-xs text-text-secondary">Default is 08:00 Asia/Kolkata. Kannada message templates remain disabled until translation review is complete.</p>
            </>}
          </section>}

          {activeTab === 'security' && <section className="max-w-2xl space-y-6">
            <div><h2 className="text-xl font-bold text-text-primary">{t('Security')}</h2><p className="mt-1 text-sm text-text-secondary">{t('Manage your password and sign-in sessions.')}</p></div>
            <form onSubmit={(event) => void changePassword(event)} className="space-y-3 rounded-xl border border-border bg-surface/50 p-4">
              <h3 className="font-semibold text-text-primary">{settings.account?.authProvider === 'google' ? 'Add an AgriSense password' : 'Change password'}</h3>
              {settings.account?.authProvider !== 'google' && <label className="block text-sm text-text-secondary">Current password<input className={selectClass} type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label>}
              <label className="block text-sm text-text-secondary">New password<input className={selectClass} type="password" autoComplete="new-password" minLength={8} required value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label>
              <label className="block text-sm text-text-secondary">Confirm new password<input className={selectClass} type="password" autoComplete="new-password" minLength={8} required value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} /></label>
              <button type="submit" disabled={passwordSaving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}{settings.account?.authProvider === 'google' ? 'Add password' : 'Change password'}</button>
              <p className="text-xs text-text-secondary">Changing your password signs out all existing sessions, including this device.</p>
            </form>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"><div><h3 className="font-semibold text-text-primary">Sign out this device</h3><p className="mt-1 text-xs text-text-secondary">Remove the saved sign-in token from this browser.</p></div><button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-primary"><LogOut className="h-4 w-4" />Sign out</button></div>
          </section>}

          {activeTab === 'privacy' && <section className="max-w-3xl space-y-6">
            <div><h2 className="text-xl font-bold text-text-primary">{t('Privacy & Data')}</h2><p className="mt-1 text-sm text-text-secondary">{t('Review what is saved to your account and download a copy.')}</p></div>
            <div className="rounded-xl border border-border bg-surface/50 p-4"><h3 className="font-semibold text-text-primary">Your account data</h3><p className="mt-2 text-sm text-text-secondary">Your export includes account/profile details, registered parcels and crops, calendar events, notification preferences and consent history, decision traces, and report metadata. Password hashes and generated PDF file bytes are excluded.</p><button type="button" disabled={exporting} onClick={() => void exportData()} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Download my data</button></div>
            <div className="rounded-xl border border-border p-4"><h3 className="font-semibold text-text-primary">Data processing</h3><p className="mt-2 text-sm text-text-secondary">AI processing is separately controlled in AI Preferences. AgriSense does not currently send product analytics to a third-party analytics service. Account deletion requests are handled by support so farm records are not removed accidentally.</p></div>
          </section>}

          {activeTab === 'connected' && <section className="max-w-2xl space-y-5">
            <div><h2 className="text-xl font-bold text-text-primary">{t('Connected Accounts')}</h2><p className="mt-1 text-sm text-text-secondary">{t('See which identity providers are linked to this AgriSense account.')}</p></div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg font-bold text-blue-600">G</div><div><p className="font-semibold text-text-primary">Google</p><p className="text-xs text-text-secondary">{googleConnected === null ? 'Could not check connection status' : googleConnected ? 'Connected to this account' : 'Not linked to this account'}</p></div></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${googleConnected ? 'bg-primary/10 text-primary' : 'bg-surface text-text-secondary'}`}>{googleConnected ? 'Connected' : googleConnected === null ? 'Unavailable' : 'Not connected'}</span></div>
            {googleConnected === false && <button type="button" disabled={saving} onClick={() => void connectGoogle()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? 'Connecting…' : 'Connect Google'}</button>}
            {googleConnected && settings.account?.authProvider !== 'google' && <div className="max-w-md space-y-3 rounded-xl border border-border bg-surface/50 p-4"><h3 className="font-semibold text-text-primary">Disconnect Google</h3><label className="block text-sm text-text-secondary">Confirm your AgriSense password<input className={selectClass} type="password" autoComplete="current-password" value={googlePassword} onChange={(e) => setGooglePassword(e.target.value)} /></label><button type="button" disabled={saving || !googlePassword} onClick={() => void disconnectGoogle()} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary disabled:opacity-50">Disconnect Google</button></div>}
            {googleConnected && settings.account?.authProvider === 'google' && <p className="rounded-lg border border-border bg-surface/50 p-3 text-xs text-text-secondary">This account relies on Google sign-in. Add an AgriSense password before disconnecting Google to avoid losing account access.</p>}
            <p className="text-xs text-text-secondary">Linking uses a single-use, ten-minute account ticket. Disconnecting requires your AgriSense password and signs out all existing sessions.</p>
          </section>}

          {activeTab === 'about' && <section className="max-w-2xl space-y-5">
            <div><h2 className="text-xl font-bold text-text-primary">{t('About AgriSense')}</h2><p className="mt-1 text-sm text-text-secondary">{t('Agricultural intelligence for your farm.')}</p></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-surface/50 p-4"><p className="text-xs uppercase tracking-wide text-text-secondary">Application</p><p className="mt-1 font-semibold text-text-primary">AgriSense Farmer Platform</p></div><div className="rounded-xl border border-border bg-surface/50 p-4"><p className="text-xs uppercase tracking-wide text-text-secondary">Build</p><p className="mt-1 font-semibold text-text-primary">{import.meta.env.VITE_APP_VERSION || 'Development'}</p></div><div className="rounded-xl border border-border bg-surface/50 p-4"><p className="text-xs uppercase tracking-wide text-text-secondary">Your locale</p><p className="mt-1 font-semibold text-text-primary">{getCurrentLocale()}</p></div><div className="rounded-xl border border-border bg-surface/50 p-4"><p className="text-xs uppercase tracking-wide text-text-secondary">Support context</p><p className="mt-1 font-semibold text-text-primary">{settings.account?.email || 'Signed-in account'}</p></div></div>
            <p className="text-xs leading-relaxed text-text-secondary">Agricultural outputs depend on source data and may be incomplete. Verify important crop, weather, and market decisions with local agricultural experts and official sources.</p>
          </section>}
        </>}
      </main>
    </div>
  </div>;
}
