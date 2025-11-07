# 📢 Complete AdSense Integration Guide

## Step-by-Step: Get Ads on Your Website

---

## Part 1: Get AdSense Approval

### Step 1: Apply for Google AdSense
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click **"Get Started"**
3. Sign in with your Google account
4. Enter your website URL: `https://your-domain.vercel.app`
5. Select your country/region
6. Click **"Create account"**

### Step 2: Add Your Site
1. In AdSense dashboard, click **"Sites"** → **"Add site"**
2. Enter your website URL
3. Click **"Continue"**

### Step 3: Add AdSense Code
1. AdSense will ask you to add code to your site
2. **Skip this step** (we'll add it properly later)
3. Click **"I've added the code"** → **"Continue"**

### Step 4: Complete Application
1. Fill out payment information
2. Submit for review
3. **Wait for approval** (usually 1-7 days)

### Step 5: Get Approved ✅
Once approved, you'll receive:
- **Publisher ID**: `ca-pub-XXXXXXXXXXXXXXX` (starts with `ca-pub-`)
- Access to create ad units

---

## Part 2: Create Ad Units

### Step 6: Create Ad Units
1. Go to AdSense dashboard → **"Ads"** → **"By ad unit"**
2. Click **"Create ad unit"**

**Create 2 ad units:**

#### Ad Unit 1: Leaderboard (728x90)
- **Name**: `Leaderboard-728x90`
- **Size**: `728x90` (Leaderboard)
- **Type**: Display ads
- **Click "Create"**
- **Copy the Ad Unit ID** (looks like: `1234567890`)

#### Ad Unit 2: Rectangle (300x250)
- **Name**: `Rectangle-300x250`
- **Size**: `300x250` (Medium Rectangle)
- **Type**: Display ads
- **Click "Create"**
- **Copy the Ad Unit ID** (looks like: `0987654321`)

### Step 7: Get Your Publisher ID
1. Go to AdSense dashboard → **"Account"** → **"Account information"**
2. Find **"Publisher ID"**: `ca-pub-XXXXXXXXXXXXXXX`
3. **Copy this ID**

---

## Part 3: Update Your Code

### Step 8: Update Publisher ID

**File 1: `app/layout.tsx`**
Find these 2 lines (around line 138 and 146):
```typescript
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX"
```
and
```typescript
src="https://fundingchoicesmessages.google.com/i/ca-pub-XXXXXXXXXXXXXXX?ers=1"
```

**Replace `ca-pub-XXXXXXXXXXXXXXX`** with your actual Publisher ID:
```typescript
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ACTUAL-ID"
```

**File 2: `components/AdSlot.tsx`**
Find line 62:
```typescript
data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
```

**Replace with:**
```typescript
data-ad-client="ca-pub-YOUR-ACTUAL-ID"
```

**File 3: `public/ads.txt`**
Replace the content with:
```
google.com, pub-YOUR-ACTUAL-ID, DIRECT, f08c47fec0942fa0
```
(Remove the `ca-pub-` prefix, just use `pub-`)

### Step 9: Update Ad Slot IDs

**File: `components/dashboard/OptionsDashboard.tsx`**

Find all `<AdSlot>` components and update the `slot` prop:

**Example 1: Leaderboard (728x90)**
```tsx
<AdSlot 
  slot="YOUR-728x90-SLOT-ID"  // Replace with your Leaderboard ad unit ID
  style={{ width: '728px', height: '90px', margin: '0 auto' }}
/>
```

**Example 2: Rectangle (300x250)**
```tsx
<AdSlot 
  slot="YOUR-300x250-SLOT-ID"  // Replace with your Rectangle ad unit ID
  style={{ width: '300px', height: '250px' }}
/>
```

**File: `components/dashboard/AdSidebar.tsx`**
Update the default slot:
```tsx
<AdSlot 
  slot="YOUR-300x250-SLOT-ID"  // Replace with your Rectangle ad unit ID
/>
```

### Step 10: Update Environment Variables

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add/Update:
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-YOUR-ACTUAL-ID`
   - `NEXT_PUBLIC_ADSENSE_SLOT_728x90` = `YOUR-728x90-SLOT-ID`
   - `NEXT_PUBLIC_ADSENSE_SLOT_300x250` = `YOUR-300x250-SLOT-ID`

**Or in `.env.local` (for local testing):**
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-YOUR-ACTUAL-ID
NEXT_PUBLIC_ADSENSE_SLOT_728x90=YOUR-728x90-SLOT-ID
NEXT_PUBLIC_ADSENSE_SLOT_300x250=YOUR-300x250-SLOT-ID
```

---

## Part 4: Deploy & Test

### Step 11: Deploy Changes
1. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: integrate AdSense ads"
   git push origin main
   ```
2. Vercel will auto-deploy
3. Wait for deployment to complete

### Step 12: Verify ads.txt
1. Visit: `https://your-domain.vercel.app/ads.txt`
2. Should show:
   ```
   google.com, pub-YOUR-ACTUAL-ID, DIRECT, f08c47fec0942fa0
   ```
3. If not accessible, check Vercel deployment

### Step 13: Test Ads
1. Visit your website
2. Accept cookies (if consent banner appears)
3. Wait 30-60 seconds for ads to load
4. Check if ads appear in:
   - Below expiry countdown (728x90)
   - In sidebar (300x250)

### Step 14: Check AdSense Dashboard
1. Go to AdSense dashboard → **"Ads"** → **"Overview"**
2. Check if impressions are being recorded
3. Wait 24-48 hours for data to populate

---

## Part 5: Troubleshooting

### Ads Not Showing?

**1. Check AdSense Approval**
- Make sure your site is approved
- Check AdSense dashboard for any warnings

**2. Check Code**
- Verify Publisher ID is correct (no typos)
- Verify Ad Slot IDs are correct
- Check browser console for errors

**3. Check Consent**
- Make sure user accepted cookies
- Check if Consent Mode is working:
  ```javascript
  // In browser console
  dataLayer
  ```

**4. Check ads.txt**
- Visit `https://your-domain.com/ads.txt`
- Should be accessible and show correct Publisher ID

**5. Wait for Propagation**
- AdSense can take 24-48 hours to start serving ads
- New sites may show blank spaces initially

**6. Check AdSense Policy**
- Make sure your site complies with AdSense policies
- Check for any policy violations in dashboard

### Common Issues

**Issue: "AdSense code not found"**
- Solution: Make sure `app/layout.tsx` has the AdSense script tag

**Issue: "Invalid publisher ID"**
- Solution: Double-check Publisher ID format: `ca-pub-` followed by numbers

**Issue: "No ads available"**
- Solution: Normal for new sites. Wait 24-48 hours. AdSense needs time to match ads.

**Issue: "Blank ad spaces"**
- Solution: This is normal initially. AdSense will start serving ads once it has inventory.

---

## Part 6: Best Practices

### ✅ Do's
- **Place ads naturally** in content flow
- **Use responsive ad units** (already configured)
- **Respect user consent** (already implemented)
- **Monitor AdSense dashboard** regularly
- **Follow AdSense policies** strictly

### ❌ Don'ts
- **Don't click your own ads** (will get banned)
- **Don't ask others to click** (violates policy)
- **Don't place ads too close together** (minimum spacing required)
- **Don't use misleading labels** (e.g., "Click here" near ads)
- **Don't exceed 3 ad units per page** (policy limit)

### 📊 Ad Placement Tips
- **Above the fold**: Higher revenue potential
- **Between content**: Better user experience
- **Sidebar**: Good for desktop users
- **Mobile**: Use responsive units (already configured)

---

## Part 7: Monitor Performance

### Check AdSense Dashboard
1. **Overview**: See earnings, impressions, clicks
2. **Ads**: See which ad units perform best
3. **Sites**: Verify your site is active
4. **Payments**: Set up payment method

### Key Metrics
- **RPM** (Revenue per 1000 impressions)
- **CTR** (Click-through rate)
- **CPC** (Cost per click)
- **Impressions**: How many times ads were shown

---

## Quick Checklist

Before going live:
- [ ] AdSense account approved
- [ ] Publisher ID copied
- [ ] Ad units created (728x90 and 300x250)
- [ ] Publisher ID updated in `app/layout.tsx` (2 places)
- [ ] Publisher ID updated in `components/AdSlot.tsx`
- [ ] Publisher ID updated in `public/ads.txt`
- [ ] Ad Slot IDs updated in `OptionsDashboard.tsx`
- [ ] Ad Slot IDs updated in `AdSidebar.tsx`
- [ ] Environment variables set in Vercel
- [ ] Changes deployed to production
- [ ] `ads.txt` accessible at `/ads.txt`
- [ ] Ads appear on website (may take 24-48 hours)
- [ ] Consent banner working
- [ ] No console errors

---

## Support

**AdSense Help:**
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Troubleshooting Guide](https://support.google.com/adsense/topic/1319754)

**Your Code:**
- All AdSense code is already integrated
- Just replace the placeholders with your actual IDs
- Everything else is automated

---

## Summary

1. ✅ **Get AdSense approval** (1-7 days)
2. ✅ **Create ad units** (728x90 and 300x250)
3. ✅ **Get Publisher ID** and **Ad Slot IDs**
4. ✅ **Replace placeholders** in code
5. ✅ **Deploy** to production
6. ✅ **Wait 24-48 hours** for ads to start serving
7. ✅ **Monitor** in AdSense dashboard

**That's it! Your ads will start showing once AdSense approves and starts serving ads to your site.** 🎉

