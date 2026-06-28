import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/routes';
import { Loader } from '@/components/common/Loader';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (!isLoading) {
      trackEvent('auth_check', { allowed: isAuthenticated, path: window.location.pathname });
    }
  }, [isLoading, isAuthenticated, trackEvent]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
