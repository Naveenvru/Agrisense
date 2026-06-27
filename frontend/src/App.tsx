import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ApplicationShell } from '@/layouts/ApplicationShell';
import { ROUTES } from '@/config/routes';

// Pages
import { LoginPage } from '@/features/auth/components/LoginPage';
import { SignupPage } from '@/features/auth/components/SignupPage';
import { OAuthCallbackPage } from '@/features/auth/components/OAuthCallbackPage';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { FarmPage } from '@/features/farm/components/FarmPage';
import { WeatherPage } from '@/features/weather/components/WeatherPage';
import { MarketPage } from '@/features/market/components/MarketPage';
import { CalendarPage } from '@/features/calendar/components/CalendarPage';
import { AiPage } from '@/features/ai/components/AiPage';
import { DiseasePage } from '@/features/disease/components/DiseasePage';
import { ReportsPage } from '@/features/reports/components/ReportsPage';
import { SettingsPage } from '@/features/settings/components/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallbackPage />} />

          {/* Protected Routes wrapped in Application Shell */}
          <Route element={<ProtectedRoute><ApplicationShell><Outlet /></ApplicationShell></ProtectedRoute>}>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.FARM} element={<FarmPage />} />
            <Route path={ROUTES.WEATHER} element={<WeatherPage />} />
            <Route path={ROUTES.MARKET} element={<MarketPage />} />
            <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
            <Route path={ROUTES.AI} element={<AiPage />} />
            <Route path={ROUTES.DISEASE} element={<DiseasePage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
