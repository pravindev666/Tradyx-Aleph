# Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All Python scripts validated (`python scripts/validate_production.py`)
- [ ] No console errors in browser
- [ ] All environment variables configured
- [ ] `.env.example` updated with all required variables

### Data Generation
- [ ] All Python scripts run successfully (`python scripts/run_all.py`)
- [ ] `dashboard.json` exists in `public/data/`
- [ ] Data validation passes (`python scripts/validate_production.py`)
- [ ] Spot price and VIX values are correct (from yfinance)

### Security
- [ ] All API keys and secrets in environment variables (not in code)
- [ ] AdSense IDs configured correctly
- [ ] CSP headers configured
- [ ] Security headers enabled in `next.config.js`
- [ ] `.gitignore` excludes sensitive files

### Performance
- [ ] Next.js build succeeds (`npm run build`)
- [ ] Bundle size is reasonable
- [ ] Images optimized
- [ ] Fonts optimized (Arteks font loaded correctly)

### SEO & Metadata
- [ ] Meta tags configured in `app/layout.tsx`
- [ ] `sitemap.ts` configured
- [ ] `robots.txt` configured
- [ ] Schema markup added
- [ ] OpenGraph tags configured

### Legal & Compliance
- [ ] Disclaimer modal implemented
- [ ] Privacy Policy page created
- [ ] Terms of Use page created
- [ ] Cookie Notice page created
- [ ] Consent banner implemented (Google Consent Mode v2)
- [ ] `ads.txt` file created

## GitHub Actions

### Workflows
- [ ] `.github/workflows/deploy.yml` configured
- [ ] `.github/workflows/data-update.yml` configured
- [ ] `.github/workflows/ci.yml` configured
- [ ] GitHub secrets configured (VERCEL_TOKEN, etc.)

### Secrets Required
- [ ] `VERCEL_TOKEN` - Vercel deployment token
- [ ] `VERCEL_ORG_ID` - Vercel organization ID
- [ ] `VERCEL_PROJECT_ID` - Vercel project ID

## Vercel Deployment

### Configuration
- [ ] Repository connected to Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Framework: Next.js

### Domain & SSL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] HTTPS redirect enabled

## Post-Deployment

### Verification
- [ ] Production URL loads correctly
- [ ] All tiles display data
- [ ] Refresh button works
- [ ] Dark/light mode toggle works
- [ ] Mobile responsiveness verified
- [ ] All links work (Privacy, Terms, etc.)

### Monitoring
- [ ] Error tracking set up (if applicable)
- [ ] Analytics configured (if applicable)
- [ ] Uptime monitoring configured
- [ ] Data update workflow running

### Documentation
- [ ] README.md updated
- [ ] DEPLOYMENT.md created
- [ ] API documentation (if applicable)
- [ ] Changelog maintained

## Rollback Plan

- [ ] Know how to revert to previous deployment
- [ ] Backup strategy in place
- [ ] Rollback procedure documented

## Support

- [ ] Support email configured (support@tradyx.in)
- [ ] Error reporting mechanism in place
- [ ] Contact information visible

---

**Last Updated**: 2025-11-07
**Version**: 1.0.0

