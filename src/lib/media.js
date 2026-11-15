import { ENV } from '../config/env';

// Image URLs are stored absolute in the database (the CRM saves them that way on
// upload, and the seeder builds them from APP_URL). If a record carries an
// origin from another environment, rewrite it to the configured API origin so
// the picture still loads, and expand root-relative paths too.
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i;

// Folders that ship inside this site's own public/ build. Their paths stay as
// written (the API knows nothing about them).
const SITE_ASSETS = /^\/(assets|img)\//i;

// Folders the API itself serves uploads from. A stored URL pointing at one of
// these but at some other host was written on a different environment — the
// file lives on this API, so the host is rewritten and the path kept.
const API_FOLDERS = /^\/(product-images|category-images|brand|brand-images|banners|custom-product-images|page-images|size-chart-images|site-content|return-videos)\//i;

export const mediaUrl = (src) => {
  if (!src || typeof src !== 'string') return src;
  const value = src.trim();
  if (!value || value === 'null') return '';
  if (LOCAL_ORIGIN.test(value)) return value.replace(LOCAL_ORIGIN, ENV.MEDIA_URL);
  if (SITE_ASSETS.test(value)) return value;
  if (value.startsWith('/')) return `${ENV.MEDIA_URL}${value}`;

  try {
    const parsed = new URL(value);
    if (API_FOLDERS.test(parsed.pathname) && parsed.origin !== ENV.MEDIA_URL) {
      return `${ENV.MEDIA_URL}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    /* not a parsable URL — leave as-is */
  }
  return value;
};
