import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { apiClient } from '@/lib/axios';
import { AccountPreferences, applyAccountPreferences, DEFAULT_ACCOUNT_PREFERENCES, getAccountPreferencesFromStorage } from '@/features/settings/services/account-preferences';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
  phoneNumber?: string;
  googleId?: string | null;
  authProvider?: string;
  preferredLanguage?: string;
  isEmailVerified?: boolean;
  preferences?: AccountPreferences;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<AccountPreferences>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const hydratePreferences = async (currentUser: User) => {
    try {
      const { data } = await apiClient.get('/settings');
      const preferences: AccountPreferences = {
        theme: data.theme || DEFAULT_ACCOUNT_PREFERENCES.theme,
        accentTheme: data.accentTheme || DEFAULT_ACCOUNT_PREFERENCES.accentTheme,
        units: data.units || DEFAULT_ACCOUNT_PREFERENCES.units,
        language: data.language || currentUser.preferredLanguage || 'en',
        aiAssistanceEnabled: Boolean(data.aiAssistanceEnabled),
        personalizedRecommendationsEnabled: Boolean(data.personalizedRecommendationsEnabled),
      };
      applyAccountPreferences(preferences);
      const hydratedUser = { ...currentUser, preferences };
      setUser(hydratedUser);
      localStorage.setItem('user', JSON.stringify(hydratedUser));
    } catch {
      applyAccountPreferences(getAccountPreferencesFromStorage());
    }
  };

  useEffect(() => {
    applyAccountPreferences(getAccountPreferencesFromStorage());
    const onSystemThemeChange = () => {
      if (getAccountPreferencesFromStorage().theme === 'system') applyAccountPreferences(getAccountPreferencesFromStorage());
    };
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', onSystemThemeChange);
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token) {
        try {
          // Verify token against backend profile endpoint
          const response = await apiClient.get('/auth/profile');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          await hydratePreferences(response.data);
        } catch (error) {
          // If token is invalid or expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else if (storedUser) {
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    };

    initializeAuth();
    return () => media.removeEventListener('change', onSystemThemeChange);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    void hydratePreferences(user);
    navigate(ROUTES.DASHBOARD);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  const updatePreferences = (prefs: Partial<AccountPreferences>) => {
    const nextPreferences = { ...getAccountPreferencesFromStorage(), ...prefs };
    applyAccountPreferences(nextPreferences);
    if (user) {
      const updatedUser = {
        ...user,
        preferences: nextPreferences,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
