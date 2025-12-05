'use client';

import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  action?: string;
}

/**
 * Google reCAPTCHA v3 Component
 * Automatically executes on mount and provides token via callback
 */
export default function ReCaptcha({
  siteKey,
  onVerify,
  onError,
  action = 'submit',
}: ReCaptchaProps) {
  const isExecutingRef = useRef(false);
  const scriptLoadedRef = useRef(false);

  const executeRecaptcha = useCallback(async () => {
    if (!window.grecaptcha || isExecutingRef.current) {
      return;
    }

    try {
      isExecutingRef.current = true;
      const token = await window.grecaptcha.execute(siteKey, { action });
      onVerify(token);
    } catch (error: any) {
      console.error('[ReCaptcha] Error executing reCAPTCHA:', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      isExecutingRef.current = false;
    }
  }, [siteKey, action, onVerify, onError]);

  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    if (scriptLoadedRef.current) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      scriptLoadedRef.current = true;
      // Wait for grecaptcha to be ready
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          executeRecaptcha();
        });
      }
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          executeRecaptcha();
        });
      }
    };
    script.onerror = () => {
      console.error('[ReCaptcha] Failed to load reCAPTCHA script');
      onError?.(new Error('Failed to load reCAPTCHA script'));
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount as it might be used by other components
    };
  }, [siteKey, executeRecaptcha, onError]);

  // Expose execute function for manual triggering
  useEffect(() => {
    // Store execute function in component for external access if needed
    return () => {
      isExecutingRef.current = false;
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

/**
 * Hook to get reCAPTCHA token
 */
export function useReCaptcha(siteKey: string, action: string = 'submit'): () => Promise<string> {
  return useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }, [siteKey, action]);
}
