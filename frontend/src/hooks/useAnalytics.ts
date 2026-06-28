import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // In a real application, this would send data to Google Analytics, Mixpanel, PostHog, etc.
    const pageView = {
      path: location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    if (import.meta.env.DEV) {
      console.log('[Analytics] Page View:', pageView);
    }
  }, [location]);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
    };
    
    if (import.meta.env.DEV) {
      console.log('[Analytics] Event:', event);
    }
  };

  return { trackEvent };
}
