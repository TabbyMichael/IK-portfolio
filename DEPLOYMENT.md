# Deployment Guide for Ian Kibugu Portfolio

## Netlify Deployment

### Prerequisites
- Netlify account connected to your GitHub repository
- Repository pushed to GitHub

### Configuration Files

The following files are crucial for proper deployment:

#### 1. `netlify.toml` (Root directory)
Contains build settings and redirect rules for SPA routing.

#### 2. `public/_redirects` 
Backup redirect configuration for SPA routing.

#### 3. `public/404.html`
Custom 404 page that handles client-side routing gracefully.

### Environment Variables

Set the following environment variables in your Netlify dashboard:

**Required for Production:**
- `VITE_GA_TRACKING_ID` - Your Google Analytics 4 Tracking ID (e.g., G-XXXXXXXXXX)

**Optional:**
- `VITE_SENTRY_DSN` - Sentry error tracking DSN
- `VITE_ENVIRONMENT` - Set to "production" 
- `VITE_ENABLE_PERFORMANCE_MONITORING` - Set to "true" or "false"

### Build Settings

In Netlify Dashboard → Site Settings → Build & Deploy:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18.x or higher

### Common Issues and Solutions

#### 1. 404 Errors on Direct URL Access
**Problem:** Accessing `/testimonials` directly returns 404
**Solution:** Ensure `_redirects` file is in `public/` directory and contains:
```
/*    /index.html   200
```

#### 2. Environment Variables Not Working
**Problem:** Analytics or other features not working in production
**Solution:** 
- Ensure environment variables are set in Netlify dashboard
- Remember to prefix client-side variables with `VITE_`
- Redeploy after adding environment variables

#### 3. Build Failures
**Problem:** Build fails during deployment
**Solution:**
- Check build logs in Netlify
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### SEO Configuration

The site includes:
- Dynamic sitemap generation (`public/sitemap.xml`)
- Robots.txt configuration (`public/robots.txt`)
- Meta tags and OpenGraph data
- JSON-LD structured data

### Performance Monitoring

Production deployment includes:
- Core Web Vitals tracking
- Error monitoring with Sentry
- Google Analytics integration
- Performance dashboard (development only)

### Security Headers

The `netlify.toml` file includes security headers:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- And more...

### Manual Deployment Steps

1. **Prepare for deployment:**
   ```bash
   npm run build
   ```

2. **Test locally:**
   ```bash
   npm run preview
   ```

3. **Deploy to Netlify:**
   - Push changes to main branch
   - Netlify will auto-deploy
   - Check deployment logs for any issues

### Post-Deployment Checklist

- [ ] All routes work correctly (including direct URL access)
- [ ] Contact form submissions are received
- [ ] Google Analytics is tracking correctly
- [ ] Images load properly
- [ ] Performance metrics are being collected
- [ ] All links work correctly
- [ ] Mobile responsiveness is maintained

### Monitoring and Maintenance

- Check Netlify analytics for traffic patterns
- Monitor Core Web Vitals in production
- Review error logs in Sentry dashboard
- Update dependencies regularly
- Monitor Google PageSpeed Insights scores

---

For questions or issues, refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)