'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getApiUrl } from '@/config/site';
import { getFormStartTime, createHoneypotField } from '@/lib/utils/antiSpam';
import { executeReCaptcha, isReCaptchaEnabled } from '@/lib/utils/recaptcha';

interface NewsletterFormProps {
  source?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  buttonText?: string;
  onSuccess?: () => void;
}

export default function NewsletterForm({
  source = 'website',
  className = '',
  inputClassName = '',
  buttonClassName = '',
  placeholder = 'Nhập email của bạn',
  buttonText = 'Đăng Ký',
  onSuccess,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formStartTimeRef = useRef<number | null>(null);
  const honeypotField = createHoneypotField();

  useEffect(() => {
    console.log('[NewsletterForm] Component mounted');
    console.log('[NewsletterForm] Form ref:', formRef.current);
    console.log('[NewsletterForm] Button ref:', buttonRef.current);
    
    if (buttonRef.current) {
      // Test if button is clickable
      const rect = buttonRef.current.getBoundingClientRect();
      console.log('[NewsletterForm] Button position:', rect);
      console.log('[NewsletterForm] Button visible:', rect.width > 0 && rect.height > 0);
      
      // Check for overlaying elements
      const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      console.log('[NewsletterForm] Element at button center:', elementAtPoint);
      console.log('[NewsletterForm] Is button at center?', elementAtPoint === buttonRef.current || buttonRef.current.contains(elementAtPoint));
    }

    // Track form start time on first interaction
    const handleFirstInteraction = () => {
      if (!formStartTimeRef.current) {
        formStartTimeRef.current = getFormStartTime();
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('focusin', handleFirstInteraction, { once: true });
      form.addEventListener('input', handleFirstInteraction, { once: true });
    }

    return () => {
      if (form) {
        form.removeEventListener('focusin', handleFirstInteraction);
        form.removeEventListener('input', handleFirstInteraction);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('[NewsletterForm] Form submitted, email:', email);

    if (!email.trim()) {
      console.log('[NewsletterForm] Email is empty');
      toast.error('Vui lòng nhập email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('[NewsletterForm] Email format invalid');
      toast.error('Email không hợp lệ');
      return;
    }

    setLoading(true);
    console.log('[NewsletterForm] Starting subscription...');

    try {
      // Newsletter API is on CMS backend
      // Use getApiUrl() to get the correct API URL (same as other API calls)
      const apiBaseUrl = getApiUrl();
      
      // Remove /api suffix if present, then add /api/newsletter/subscribe
      const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
      const apiUrl = `${baseUrl}/api/newsletter/subscribe`;
      
      console.log('[NewsletterForm] API Base URL:', apiBaseUrl);
      console.log('[NewsletterForm] API URL:', apiUrl);
      console.log('[NewsletterForm] Request data:', { email: email.trim(), source });
      console.log('[NewsletterForm] Window location:', typeof window !== 'undefined' ? window.location.origin : 'server-side');

      // Prepare request data with anti-spam fields
      const requestData: any = {
        email: email.trim(),
        source,
      };

      // Add honeypot field (should be empty)
      requestData[honeypotField.name] = '';

      // Add form start time for time-based validation
      if (formStartTimeRef.current) {
        requestData._formStartTime = formStartTimeRef.current.toString();
      }

      // Add reCAPTCHA token if enabled
      if (isReCaptchaEnabled()) {
        try {
          const recaptchaToken = await executeReCaptcha('newsletter_subscribe');
          if (recaptchaToken) {
            requestData.recaptchaToken = recaptchaToken;
          }
        } catch (error) {
          console.error('[NewsletterForm] reCAPTCHA error:', error);
          // Continue without reCAPTCHA if it fails (fail open)
        }
      }

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('[NewsletterForm] Response:', response.data);

      if (response.data.success) {
        toast.success(response.data.message || 'Đăng ký nhận bản tin thành công!');
        setEmail('');
        onSuccess?.();
      } else {
        toast.error(response.data.error || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      console.error('[NewsletterForm] Error:', error);
      console.error('[NewsletterForm] Error response:', error.response?.data);
      console.error('[NewsletterForm] Error status:', error.response?.status);
      
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Đăng ký thất bại. Vui lòng thử lại sau.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      console.log('[NewsletterForm] Request completed');
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('[NewsletterForm] ========== BUTTON CLICKED ==========');
    console.log('[NewsletterForm] Event:', e);
    console.log('[NewsletterForm] Event type:', e.type);
    console.log('[NewsletterForm] Current target:', e.currentTarget);
    console.log('[NewsletterForm] Email value:', email);
    
    e.preventDefault();
    e.stopPropagation();
    
    // Directly call handleSubmit
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as React.FormEvent;
    
    handleSubmit(syntheticEvent);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log('[NewsletterForm] ========== FORM SUBMIT ==========');
    console.log('[NewsletterForm] Event:', e);
    handleSubmit(e);
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleFormSubmit} 
      className={className} 
      style={{ 
        display: 'flex', 
        flexDirection: 'row',
        position: 'relative', 
        zIndex: 10,
        isolation: 'isolate',
        width: '100%',
      }}
      onClick={(e) => {
        console.log('[NewsletterForm] Form clicked:', e.target);
      }}
    >
      {/* Honeypot field - hidden from users, bots will fill it */}
      <input {...honeypotField} />
      
      <input
        type="email"
        value={email}
        onChange={(e) => {
          console.log('[NewsletterForm] Email changed:', e.target.value);
          setEmail(e.target.value);
        }}
        placeholder={placeholder}
        disabled={loading}
        className={inputClassName}
        required
        style={{ 
          flex: '1 1 auto',
          minWidth: 0,
          position: 'relative', 
          zIndex: 1,
        }}
        onKeyDown={(e) => {
          console.log('[NewsletterForm] Key pressed:', e.key);
          if (e.key === 'Enter') {
            e.preventDefault();
            console.log('[NewsletterForm] Enter pressed, submitting...');
            handleSubmit(e as any);
          }
        }}
        onClick={(e) => {
          console.log('[NewsletterForm] Input clicked');
        }}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className={buttonClassName}
        style={{ 
          cursor: loading ? 'not-allowed' : 'pointer',
          position: 'relative',
          zIndex: 10,
          pointerEvents: 'auto',
          userSelect: 'none',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          flexShrink: 0,
        }}
        onMouseDown={(e) => {
          console.log('[NewsletterForm] Button mouse down');
        }}
        onMouseUp={(e) => {
          console.log('[NewsletterForm] Button mouse up');
        }}
        onTouchStart={(e) => {
          console.log('[NewsletterForm] Button touch start');
        }}
      >
        {loading ? 'Đang xử lý...' : buttonText}
      </button>
    </form>
  );
}

