// Category listings all live under /shop/<slug> — no collision with the site's
// own pages, and one listing component renders them all. Keep in step with the
// routes in App.jsx.
export const categoryPath = (slug) => `/shop/${String(slug || '').toLowerCase()}`;
export const productPath = (slug) => `/product/${String(slug || '').toLowerCase()}`;
