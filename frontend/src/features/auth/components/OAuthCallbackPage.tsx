import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/routes';
import { apiClient } from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function OAuthCallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        try {
          // Temporarily set token so apiClient interceptor sends Authorization header
          localStorage.setItem('token', token);
          const response = await apiClient.get('/auth/profile');
          
          login(token, response.data);
          toast.success('Successfully logged in with Google!');
          navigate(ROUTES.DASHBOARD);
        } catch (error) {
          console.error('Failed to authenticate with OAuth token', error);
          localStorage.removeItem('token');
          toast.error('Google authentication failed. Please try again.');
          navigate(ROUTES.LOGIN);
        }
      } else {
        toast.error('Authentication failed. No token received.');
        navigate(ROUTES.LOGIN);
      }
    };

    handleOAuthCallback();
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-heading font-medium text-text-primary">
        Completing authentication...
      </h2>
      <p className="text-text-secondary mt-2">
        Please wait while we secure your connection.
      </p>
    </div>
  );
}
