'use client';

// Self-Hosted Analytics Tracker
// Automatically tracks pageviews and sends to CMS

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getApiUrl } from '@/config/site';

// Generate or retrieve visitor ID (stored in localStorage)
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
}

// Generate or retrieve session ID (stored in sessionStorage, expires on browser close)
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('analytics_session_start', Date.now().toString());
  }
  
  // Check if session expired (30 minutes)
  const sessionStart = parseInt(sessionStorage.getItem('analytics_session_start') || '0');
  const now = Date.now();
  if (now - sessionStart > 30 * 60 * 1000) {
    // Session expired, create new one
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
    sessionStorage.setItem('analytics_session_start', now.toString());
  }
  
  return sessionId;
}

// Extract UTM parameters from URL
function getUTMParams(searchParams: URLSearchParams | null) {
  if (!searchParams) return {};
  
  return {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
  };
}

// Send tracking data to backend
async function sendTrackingData(data: any) {
  try {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/analytics/track`;
    
    // Debug: Log tracking attempt (remove in production if needed)
    console.log('[Analytics] Tracking pageview:', {
      url,
      page_path: data.page_path,
      visitor_id: data.visitor_id?.substring(0, 20) + '...',
      apiUrl,
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // Use keepalive to ensure request completes even if user navigates away
      keepalive: true,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Analytics] Tracking failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url,
      });
    } else {
      const result = await response.json();
      console.log('[Analytics] Tracking successful:', result);
    }
  } catch (error: any) {
    // Log error for debugging
    console.error('[Analytics] Tracking error:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageStartTime = useRef<number>(Date.now());
  const lastPath = useRef<string>('');

  useEffect(() => {
    // Debug: Log component mount
    console.log('[AnalyticsTracker] Component mounted/updated:', {
      pathname,
      window: typeof window !== 'undefined',
    });

    // Track pageview
    const trackPageview = () => {
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      
      if (!visitorId || !sessionId) return;

      const utmParams = getUTMParams(searchParams);
      
      const data = {
        page_url: window.location.href,
        page_title: document.title,
        page_path: pathname,
        referrer: document.referrer || undefined,
        visitor_id: visitorId,
        session_id: sessionId,
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        ...utmParams,
      };

      sendTrackingData(data);
      
      // Update page start time
      pageStartTime.current = Date.now();
      lastPath.current = pathname;
    };

    // Track on mount and pathname change
    trackPageview();

    // Track time on page before leaving
    const handleBeforeUnload = () => {
      if (lastPath.current) {
        const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
        
        if (timeOnPage > 0) {
          const visitorId = getVisitorId();
          const sessionId = getSessionId();
          
          // Send time on page using navigator.sendBeacon (more reliable for page unload)
          const apiUrl = getApiUrl();
          const url = `${apiUrl}/analytics/track`;
          
          const data = {
            page_url: window.location.href,
            page_path: lastPath.current,
            visitor_id: visitorId,
            session_id: sessionId,
            time_on_page: timeOnPage,
          };
          
          navigator.sendBeacon(url, JSON.stringify(data));
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}

