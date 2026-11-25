const env = import.meta.env;

// Accept both VITE_API_URL and API_URL (see envPrefix in vite.config.js).
export const ENV = {
  API_URL: (env.VITE_API_URL || env.API_URL || 'http://localhost:8000').replace(/\/$/, ''),
  // Uploaded images/media are served from the API origin. (Intentionally NOT
  // configurable via VITE_MEDIA_URL — a stale img.* build-env override on the
  // host used to break product images, so media always follows the API domain.)
  MEDIA_URL: (env.VITE_API_URL || env.API_URL || 'http://localhost:8000').replace(/\/$/, ''),
  WEB_TOKEN: env.VITE_WEB_TOKEN || env.WEB_TOKEN || '',
  RAZORPAY_KEY: env.VITE_RAZORPAY_KEY || env.RAZORPAY_KEY || '',
  RECAPTCHA_SITE_KEY: env.VITE_RECAPTCHA_SITE_KEY || env.RECAPTCHA_SITE_KEY || '',
};
