import { Request, Response, NextFunction } from 'express';
import { verifyReCaptchaToken } from '../utils/recaptcha';

// In-memory store for rate limiting (in production, use Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Anti-spam middleware for form submissions
 * Implements:
 * 1. Honeypot field check
 * 2. Time-based validation (minimum time to fill form)
 * 3. Rate limiting by IP
 * 4. Google reCAPTCHA v3 verification (optional)
 */
export const antiSpamMiddleware = (options?: {
  minFormTime?: number; // Minimum time in seconds to fill form (default: 3)
  maxSubmissionsPerHour?: number; // Max submissions per hour per IP (default: 5)
  honeypotFieldName?: string; // Name of honeypot field (default: 'website')
  recaptchaSecretKey?: string; // reCAPTCHA secret key (optional)
  recaptchaMinScore?: number; // Minimum reCAPTCHA score (0.0-1.0, default: 0.5)
  requireRecaptcha?: boolean; // Require reCAPTCHA token (default: false if secret not provided)
}) => {
  const minFormTime = (options?.minFormTime || 3) * 1000; // Convert to milliseconds
  const maxSubmissions = options?.maxSubmissionsPerHour || 5;
  const honeypotField = options?.honeypotFieldName || 'website';
  const recaptchaSecret = options?.recaptchaSecretKey || process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaMinScore = options?.recaptchaMinScore || 0.5;
  const requireRecaptcha = options?.requireRecaptcha ?? !!recaptchaSecret;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 0. Verify reCAPTCHA token if enabled
      if (requireRecaptcha && recaptchaSecret) {
        const recaptchaToken = req.body.recaptchaToken;
        if (!recaptchaToken) {
          console.warn(`[AntiSpam] Missing reCAPTCHA token for IP: ${req.ip}`);
          return res.status(400).json({
            success: false,
            error: 'reCAPTCHA verification required',
          });
        }

        const verification = await verifyReCaptchaToken(recaptchaToken, recaptchaSecret);
        if (!verification.success) {
          console.warn(`[AntiSpam] reCAPTCHA verification failed for IP: ${req.ip}`, verification.error);
          return res.status(400).json({
            success: false,
            error: 'reCAPTCHA verification failed. Please try again.',
          });
        }

        if (verification.score !== undefined && verification.score < recaptchaMinScore) {
          console.warn(`[AntiSpam] reCAPTCHA score too low (${verification.score}) for IP: ${req.ip}`);
          return res.status(400).json({
            success: false,
            error: 'reCAPTCHA verification failed. Please try again.',
          });
        }
      }

      // 1. Check honeypot field (should be empty)
      if (req.body[honeypotField] && req.body[honeypotField].trim() !== '') {
        console.warn(`[AntiSpam] Honeypot triggered for IP: ${req.ip}`);
        return res.status(400).json({
          success: false,
          error: 'Invalid form submission',
        });
      }

      // 2. Check time-based validation (form start time)
      const formStartTime = req.body._formStartTime;
      if (formStartTime) {
        const timeSpent = Date.now() - parseInt(formStartTime, 10);
        if (timeSpent < minFormTime) {
          console.warn(`[AntiSpam] Form submitted too quickly (${timeSpent}ms) for IP: ${req.ip}`);
          return res.status(400).json({
            success: false,
            error: 'Form submitted too quickly. Please take your time filling out the form.',
          });
        }
      }

      // 3. Rate limiting by IP
      const clientIp = req.ip || 
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
        req.connection.remoteAddress || 
        'unknown';

      const now = Date.now();
      const rateLimitKey = `ratelimit:${clientIp}`;
      const entry = rateLimitStore.get(rateLimitKey);

      if (entry) {
        if (entry.resetTime > now) {
          // Still within rate limit window
          if (entry.count >= maxSubmissions) {
            console.warn(`[AntiSpam] Rate limit exceeded for IP: ${clientIp}`);
            return res.status(429).json({
              success: false,
              error: 'Too many submissions. Please try again later.',
            });
          }
          entry.count += 1;
        } else {
          // Reset window
          rateLimitStore.set(rateLimitKey, {
            count: 1,
            resetTime: now + 60 * 60 * 1000, // 1 hour
          });
        }
      } else {
        // First submission
        rateLimitStore.set(rateLimitKey, {
          count: 1,
          resetTime: now + 60 * 60 * 1000, // 1 hour
        });
      }

      // Remove honeypot, time tracking, and reCAPTCHA fields from body before passing to controller
      delete req.body[honeypotField];
      delete req.body._formStartTime;
      delete req.body.recaptchaToken;

      next();
    } catch (error: any) {
      console.error('[AntiSpam] Middleware error:', error);
      // On error, allow request to proceed (fail open)
      next();
    }
  };
};
