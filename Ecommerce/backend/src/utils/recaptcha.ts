import axios from 'axios';

/**
 * Verify reCAPTCHA v3 token with Google
 */
export async function verifyReCaptchaToken(
  token: string,
  secretKey: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  if (!token || !secretKey) {
    return { success: false, error: 'Missing token or secret key' };
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000,
      }
    );

    const { success, score, 'error-codes': errorCodes } = response.data;

    if (!success) {
      const errors = errorCodes || ['unknown-error'];
      return {
        success: false,
        error: errors.join(', '),
      };
    }

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 = very likely a human
    // 0.0 = very likely a bot
    // Typically, scores above 0.5 are considered legitimate
    return {
      success: true,
      score: score || 0,
    };
  } catch (error: any) {
    console.error('[ReCaptcha] Verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify reCAPTCHA token',
    };
  }
}
