const env = import.meta.env;

// Accept both VITE_API_URL and API_URL (see envPrefix in vite.config.js).
export const ENV = {
  API_URL: (env.VITE_API_URL || env.API_URL || 'http://localhost:8000').replace(/\/$/, ''),
  // Where uploaded images/media are served from. Defaults to the API origin, so
  // a separate image subdomain (e.g. img.dorjeefashionfactory.com) is optional —
  // set VITE_MEDIA_URL to use one, leave it unset to serve images off the API.
  MEDIA_URL: (env.VITE_MEDIA_URL || env.MEDIA_URL || env.VITE_API_URL || env.API_URL || 'http://localhost:8000').replace(/\/$/, ''),
  WEB_TOKEN: env.VITE_WEB_TOKEN || env.WEB_TOKEN || '',
  RAZORPAY_KEY: env.VITE_RAZORPAY_KEY || env.RAZORPAY_KEY || '',
  RECAPTCHA_SITE_KEY: env.VITE_RECAPTCHA_SITE_KEY || env.RECAPTCHA_SITE_KEY || '',
};
