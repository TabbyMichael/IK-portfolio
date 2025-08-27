# Production Setup Guide

## Quick Deploy
```bash
npm install
npm install sharp --save-dev
npm run convert:images
npm run build
```

## Environment (.env)
```bash
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-dsn@sentry.io/id
VITE_ENVIRONMENT=production
VITE_SITE_URL=https://your-domain.com
```

## Features Added
- ✅ Enhanced SEO with structured data
- ✅ Full accessibility (WCAG 2.1 AA)
- ✅ Performance monitoring
- ✅ WebP image optimization
- ✅ Error tracking

## Testing
```bash
npx lighthouse http://localhost:4173
npx axe-core http://localhost:4173
```