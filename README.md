# Dorjee Fashion Factory — Storefront

Customer-facing storefront for **dorjeefashionfactory.com**. React 18 + Vite 5 +
Tailwind 3. This repo contains **only the storefront**; the Laravel API, admin CRM
and uploaded images live on their own subdomains.

## Deploy (Hostinger — Web Apps / Vite hosting)

Hostinger auto-detects Vite and runs the build for you:

- **Build command:** `npm run build`
- **Output / publish directory:** `dist`
- **Branch:** `main`

On every push to `main`, Hostinger rebuilds and redeploys to the connected domain.

## Related services

| URL | Service |
| --- | --- |
| `https://dorjeefashionfactory.com` | this storefront |
| `https://api.dorjeefashionfactory.com` | Laravel API (backend) |
| `https://admin.dorjeefashionfactory.com` | admin CRM |
| `https://img.dorjeefashionfactory.com` | uploaded images / media |

## Configuration

Production values live in [`.env.production`](.env.production) (baked into the
browser bundle at build time — nothing secret):

- `VITE_API_URL` — backend API origin
- `VITE_MEDIA_URL` — image/media origin (optional; falls back to the API origin)
- `VITE_WEB_TOKEN` — guest API token for anonymous browsing

## Local development

```bash
npm install
npm run dev        # http://localhost:5173  (talks to http://localhost:8000)
```

Local dev reads `.env` (git-ignored). Copy the values you need from
`.env.production` and point `VITE_API_URL` at your local API.
