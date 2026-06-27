import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/config/routes';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function OAuthCallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Typically we decode the JWT to get user info if we don't have a separate /me endpoint.
      // Assuming payload has { sub: id, email, name: email.split('@')[0] }
      // Or we can just fetch /auth/me or /users/me. But for now, we'll store the token
      // and construct a basic user object from the token payload.
      
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        login(token, {
          id: decodedPayload.sub,
          email: decodedPayload.email,
          name: decodedPayload.email.split('@')[0]
        });
        
        toast.success('Successfully logged in with Google!');
        
        // Redirect will happen automatically inside login(), but just in case:
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        console.error('Failed to parse OAuth token', error);
        toast.error('Authentication failed. Please try again.');
        navigate(ROUTES.LOGIN);
      }
    } else {
      toast.error('Authentication failed. No token received.');
      navigate(ROUTES.LOGIN);
    }
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
