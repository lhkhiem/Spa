/**
 * reCAPTCHA utility functions
 */

/**
 * Get reCAPTCHA site key from environment
 */
export function getReCaptchaSiteKey(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
}

/**
 * Check if reCAPTCHA is enabled
 */
export function isReCaptchaEnabled(): boolean {
  return !!getReCaptchaSiteKey();
}

/**
 * Execute reCAPTCHA and get token
 */
export async function executeReCaptcha(action: string = 'submit'): Promise<string | null> {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    return null;
  }

  const siteKey = getReCaptchaSiteKey();
  if (!siteKey) {
    return null;
  }

  try {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('[ReCaptcha] Error executing:', error);
    return null;
  }
}
