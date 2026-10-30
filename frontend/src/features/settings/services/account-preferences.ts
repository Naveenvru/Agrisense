import i18n from '@/i18n';

export type AccountPreferences = {
  theme: 'system' | 'light' | 'dark';
  accentTheme: 'farm' | 'ocean' | 'sunrise';
  units: 'metric' | 'imperial';
  language: string;
  aiAssistanceEnabled: boolean;
  personalizedRecommendationsEnabled: boolean;
};

export const DEFAULT_ACCOUNT_PREFERENCES: AccountPreferences = {
  theme: 'system',
  accentTheme: 'farm',
  units: 'metric',
  language: 'en',
  aiAssistanceEnabled: false,
  personalizedRecommendationsEnabled: false,
};

export const APP_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', locale: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', locale: 'te-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', locale: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', locale: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', locale: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', locale: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', locale: 'ur-IN' },
] as const;

/** Languages with reviewed app-wide UI catalogs. Keep selectors honest about fallback-only locales. */
export const APP_TRANSLATION_LANGUAGES = ['en', 'hi', 'kn'] as const;

export function applyAccountPreferences(value?: Partial<AccountPreferences> | null) {
  const preferences = { ...DEFAULT_ACCOUNT_PREFERENCES, ...value };
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.dataset.theme = preferences.theme === 'system' ? systemTheme : preferences.theme;
  root.dataset.accent = preferences.accentTheme;
  const hasAppTranslations = APP_TRANSLATION_LANGUAGES.includes(preferences.language as typeof APP_TRANSLATION_LANGUAGES[number]);
  const effectiveLanguage = hasAppTranslations ? preferences.language : 'en';
  const language = APP_LANGUAGES.find((item) => item.code === effectiveLanguage);
  root.lang = language?.locale || 'en-IN';
  root.dir = effectiveLanguage === 'ur' ? 'rtl' : 'ltr';
  // Keep the visible React interface in sync with the persisted account language.
  void i18n.changeLanguage(effectiveLanguage);
  localStorage.setItem('account-preferences', JSON.stringify(preferences));
}

export function getAccountPreferencesFromStorage(): AccountPreferences {
  try {
    return { ...DEFAULT_ACCOUNT_PREFERENCES, ...JSON.parse(localStorage.getItem('account-preferences') || '{}') };
  } catch {
    return DEFAULT_ACCOUNT_PREFERENCES;
  }
}

export function getCurrentLocale() {
  const language = getAccountPreferencesFromStorage().language;
  return APP_LANGUAGES.find((item) => item.code === language)?.locale || 'en-IN';
}

export function formatTemperature(celsius: number, units = getAccountPreferencesFromStorage().units) {
  if (units === 'imperial') return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  return `${Math.round(celsius)}°C`;
}

export function formatAreaFromAcres(acres: number, units = getAccountPreferencesFromStorage().units) {
  if (units === 'imperial') return `${Number(acres.toFixed(2))} ac`;
  return `${Number((acres * 0.404685642).toFixed(2))} ha`;
}

export function getAreaUnit(units = getAccountPreferencesFromStorage().units) {
  return units === 'imperial' ? 'ac' : 'ha';
}

export function formatYieldFromKg(kg: number, units = getAccountPreferencesFromStorage().units) {
  if (units === 'imperial') return { value: Number((kg * 2.20462262).toFixed(1)), unit: 'lb' };
  return { value: kg, unit: 'kg' };
}

export function formatRainfallMm(mm: number, units = getAccountPreferencesFromStorage().units) {
  return units === 'imperial' ? `${(mm / 25.4).toFixed(2)} in` : `${mm} mm`;
}

export function formatWindSpeedKmh(kmh: number, units = getAccountPreferencesFromStorage().units) {
  return units === 'imperial' ? `${(kmh / 1.609344).toFixed(1)} mph` : `${kmh} km/h`;
}

export function formatWindSpeedMs(ms: number, units = getAccountPreferencesFromStorage().units) {
  return units === 'imperial' ? `${(ms * 2.236936).toFixed(1)} mph` : `${ms} m/s`;
}

export function formatPressureHpa(hpa: number, units = getAccountPreferencesFromStorage().units) {
  return units === 'imperial' ? `${(hpa * 0.029529983).toFixed(2)} inHg` : `${hpa} hPa`;
}


