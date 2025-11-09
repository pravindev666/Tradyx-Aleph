# Quick Fix Guide - Adsterra Ads Not Loading

## 🚨 Immediate Actions

### Step 1: Verify Ad Keys (5 minutes)

1. **Login to Adsterra**: https://publishers.adsterra.com/
2. **Go to "Zones" or "Ad Units"**
3. **Click on each ad unit** and copy the **Ad Key** (not the ID number)
4. **Compare with your code**:

**Your Current Ad Keys in Code**:
- 728x90: `b4903cf5635d652e019f9cf30ea1cd88`
- 468x60: `d8c93074244d311adc394f3a309c3118`
- 300x250: `2f370fd28cbdeb2108926fba77c70947`
- 320x50: `35bb5972176687c2571d4f6e436e1f71`

**Action**: If keys don't match, update code and redeploy.

### Step 2: Check Fill Rates (2 minutes)

1. Go to **"Statistics"** in Adsterra
2. Check **Fill Rate** for each ad
3. **If Fill Rate = 0%**: Adsterra has no ads (this is the issue)
4. **If Fill Rate > 0%**: Ads available but not showing (code issue)

### Step 3: Check Site Approval (1 minute)

1. Go to **"Sites"** in Adsterra
2. Verify `tradyx-quant-gamma.vercel.app` is **approved**
3. **If pending**: Wait 24-48 hours

## 🔧 If Ad Keys Don't Match

Update these files:

### File 1: `components/dashboard/OptionsDashboard.tsx`

```tsx
// Line 473 - Update ad key
<HighPerformanceAd 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA DASHBOARD]"
  width={728}
  height={90}
/>

// Line 493 - Update ad key
<HighPerformanceAd 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA DASHBOARD]"
  width={468}
  height={60}
/>
```

### File 2: `components/dashboard/OptionsDashboard.tsx`

```tsx
// Line 538 - Update ad key
<HighPerformanceAdSidebar 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA DASHBOARD]"
  width={300}
  height={250}
/>

// Line 552 - Update ad key
<HighPerformanceAdSidebar 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA DASHBOARD]"
  width={320}
  height={50}
/>
```

### File 3: `public/adsterra-test.html`

Update ad keys in test file to match.

### File 4: `public/test-ads.html`

Update ad keys in test file to match.

## 📊 What Your Test Results Mean

**Test Result**: `0/4 ads loaded - Iframe created but empty`

**This means**:
- ✅ **Code is working** (iframes created)
- ✅ **Scripts are loading** (200 status)
- ⚠️ **Adsterra not serving ads** (inventory/approval issue)

## 🎯 Most Likely Causes

### Cause 1: Ad Keys Don't Match (Most Common)
- **Symptom**: Dashboard shows "Active" but ads don't load
- **Solution**: Verify and update ad keys

### Cause 2: Fill Rate = 0% (Common)
- **Symptom**: Ad keys match, scripts load, but no ads
- **Solution**: Wait 24-48 hours or contact Adsterra support

### Cause 3: Site Not Approved
- **Symptom**: Ads active but 0 impressions
- **Solution**: Check site approval status

## 📞 Contact Adsterra Support

**If ad keys match and fill rate is still 0%**:

**Email**: support@adsterra.com

**Subject**: Ads Not Serving - Fill Rate 0%

**Message**:
```
Hello,

I have 4 ad units that show "Active" in dashboard but are not serving ads:

Ad Unit IDs:
- 27908777 (Banner 728x90)
- 27908860 (Banner 468x60)
- 27908843 (Banner 300x250)
- 27908866 (Banner 320x50)

Website: tradyx-quant-gamma.vercel.app

Issue:
- Ad keys are active in dashboard
- Scripts load successfully (200 status)
- Iframes are created but remain empty
- Fill rate is 0% for all ads
- Test HTML shows 0/4 ads loading

Previously 3 ads were working, now only 1 ad is showing.

Please check:
1. Why fill rate is 0% even though ads are active?
2. Are ad keys correct?
3. Is site approved and verified?
4. Are there any restrictions?

Thank you.
```

## ✅ Summary

**Your Code**: ✅ Working correctly (iframes created, scripts load)

**Adsterra**: ⚠️ Not serving ads (inventory/approval issue)

**Next Steps**:
1. Verify ad keys match Adsterra dashboard
2. Check fill rates and impressions
3. Verify site approval
4. Contact Adsterra support if needed
5. Wait 24-48 hours (if new account)

**Remember**: Empty iframes = Adsterra issue, NOT code issue. Your code is working correctly!

