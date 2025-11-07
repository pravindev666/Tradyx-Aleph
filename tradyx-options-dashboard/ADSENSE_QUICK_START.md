# ⚡ AdSense Quick Start (5 Minutes)

## 🎯 What You Need
1. AdSense account (approved)
2. Publisher ID: `ca-pub-XXXXXXXXXXXXXXX`
3. 2 Ad Slot IDs: `1234567890` and `0987654321`

## 📝 Quick Steps

### 1. Update Publisher ID (3 files)

**File: `app/layout.tsx`** (Line ~138 and ~146)
```typescript
// Replace ca-pub-XXXXXXXXXXXXXXX with your ID
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"
```

**File: `components/AdSlot.tsx`** (Line 62)
```typescript
data-ad-client="ca-pub-YOUR-ID"
```

**File: `public/ads.txt`**
```
google.com, pub-YOUR-ID, DIRECT, f08c47fec0942fa0
```
(Remove `ca-pub-` prefix, use `pub-` only)

### 2. Update Ad Slot IDs

**File: `components/dashboard/OptionsDashboard.tsx`**
Find all `<AdSlot slot="XXXXXXXXXX">` and replace with your slot IDs

**File: `components/dashboard/AdSidebar.tsx`**
Update the default slot ID

### 3. Deploy
```bash
git add .
git commit -m "feat: add AdSense"
git push
```

### 4. Verify
- Visit: `https://your-domain.com/ads.txt` (should show your Publisher ID)
- Visit your site → Accept cookies → Wait 30 seconds → Ads should appear

## ⏰ Timeline
- **Code update**: 5 minutes
- **Deployment**: 2 minutes
- **Ads start showing**: 24-48 hours (AdSense needs time)

## ✅ Done!
Your ads will start showing once AdSense begins serving ads to your site.

---

**Need detailed steps?** See `ADSENSE_INTEGRATION_GUIDE.md`

