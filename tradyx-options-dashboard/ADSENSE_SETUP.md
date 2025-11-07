# AdSense & Consent Mode v2 Setup Guide

## ⚠️ IMPORTANT: Replace These Placeholders

Before deploying, you **MUST** replace the following placeholders with your actual values:

### 1. AdSense Publisher ID
Replace `ca-pub-XXXXXXXXXXXXXXX` in:
- `/app/layout.tsx` (2 places: AdSense loader and Funding Choices)
- `/components/AdSlot.tsx` (data-ad-client attribute)
- `/public/ads.txt` (publisher ID)

### 2. AdSense Slot IDs
Replace `XXXXXXXXXX` in:
- `/components/dashboard/AdSidebar.tsx` (default slot prop)
- `/components/dashboard/OptionsDashboard.tsx` (all AdSlot components)

### 3. Google Analytics ID (Optional)
If using GA4, uncomment and replace `G-XXXXXXXXXX` in:
- `/app/layout.tsx` (GA4 script section)

### 4. Domain
Replace `https://tradyx.vercel.app` with your actual domain in:
- `/app/layout.tsx` (metadataBase)
- `/app/sitemap.ts` (baseUrl)
- `/public/robots.txt` (Sitemap URL)

## Files Created/Modified

### ✅ Core Implementation
1. **`/app/layout.tsx`** - Consent Mode v2 defaults + Funding Choices CMP + AdSense loader
2. **`/components/ConsentBanner.tsx`** - Custom consent banner for non-EEA users
3. **`/components/AdSlot.tsx`** - Reusable AdSense component
4. **`/public/ads.txt`** - Required by AdSense (replace publisher ID)

### ✅ Legal Pages
5. **`/app/legal/privacy/page.tsx`** - Privacy Policy
6. **`/app/legal/cookies/page.tsx`** - Cookie Preferences (with re-open consent button)
7. **`/app/legal/terms/page.tsx`** - Terms of Use
8. **`/app/legal/disclaimer/page.tsx`** - Disclaimer

### ✅ Updated Components
9. **`/components/dashboard/OptionsDashboard.tsx`** - Added ConsentBanner, AdSlot integration, footer links
10. **`/components/dashboard/AdSidebar.tsx`** - Updated to use AdSlot component

## How It Works

### Consent Flow
1. **Page loads** → Consent Mode v2 defaults to "denied" (except security)
2. **EEA/UK users** → Google Funding Choices CMP shows TCF v2.2 consent UI
3. **Non-EEA users** → Custom ConsentBanner shows (if no consent saved)
4. **User makes choice** → Consent Mode updated via `gtag('consent', 'update', ...)`
5. **AdSense/GA4** → Respect consent and serve only allowed ads/analytics

### Ad Placement
- **728x90 Leaderboard**: Below expiry countdown, before Prediction Models
- **300x250 Rectangle**: In sidebar (AdSidebar component)
- All ads use `AdSlot` component which respects Consent Mode

## Verification Checklist

Before going live:

- [ ] Replace all `ca-pub-XXXXXXXXXXXXXXX` with your AdSense publisher ID
- [ ] Replace all `XXXXXXXXXX` slot IDs with your actual AdSense slot IDs
- [ ] Update `/public/ads.txt` with your publisher ID
- [ ] Test consent banner appears for new visitors
- [ ] Test Funding Choices appears for EEA/UK users (use VPN)
- [ ] Verify ads.txt is accessible at `https://yourdomain.com/ads.txt`
- [ ] Test cookie preferences page re-opens consent banner
- [ ] Verify all footer links work (Privacy, Cookies, Terms, Disclaimer)
- [ ] Check AdSense Policy Center for compliance
- [ ] Test ads appear only after consent is granted

## Testing Consent Mode

### In Browser Console:
```javascript
// Check current consent state
dataLayer

// Check TCF string (after CMP loads)
__tcfapi('getTCData', 2, console.log)

// Manually update consent (for testing)
gtag('consent', 'update', {
  analytics_storage: 'granted',
  ad_storage: 'granted'
});
```

## Notes

- **Funding Choices is FREE** and certified for TCF v2.2 compliance
- **Consent Mode v2** ensures ads/analytics don't fire until consent is granted
- **ads.txt is REQUIRED** by AdSense - must be at domain root
- **Legal pages are REQUIRED** for AdSense compliance
- **Footer disclosure is REQUIRED** - already added to OptionsDashboard footer

## Support

For AdSense setup issues, refer to:
- [Google AdSense Help](https://support.google.com/adsense)
- [Consent Mode v2 Documentation](https://developers.google.com/tag-platform/security/guides/consent)
- [Funding Choices Setup](https://support.google.com/adsense/answer/10197037)

