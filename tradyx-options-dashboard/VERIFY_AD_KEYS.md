# How to Verify Ad Keys Match Adsterra Dashboard

## 🎯 Critical Issue

Your test shows **0/4 ads loading** even though Adsterra dashboard shows all ads as **"Active"**. This means:
- ✅ Code is working (iframes created)
- ⚠️ Ad keys might not match OR Adsterra has no inventory

## 📋 Step-by-Step: Verify Ad Keys

### Step 1: Get Ad Keys from Adsterra Dashboard

1. **Login to Adsterra**: https://publishers.adsterra.com/
2. **Go to "Zones" or "Ad Units"**
3. **For EACH ad unit, click on it**:

#### Ad Unit 1: Banner 728x90 (ID: 27908777)
- Click on "Banner 728x90" or ID "27908777"
- Look for **"Ad Key"** or **"Zone ID"** or **"Code"**
- Copy the long string (should look like: `b4903cf5635d652e019f9cf30ea1cd88`)
- **Your current code uses**: `b4903cf5635d652e019f9cf30ea1cd88`

#### Ad Unit 2: Banner 468x60 (ID: 27908860)
- Click on "Banner 468x60" or ID "27908860"
- Copy the ad key
- **Your current code uses**: `d8c93074244d311adc394f3a309c3118`

#### Ad Unit 3: Banner 300x250 (ID: 27908843)
- Click on "Banner 300x250" or ID "27908843"
- Copy the ad key
- **Your current code uses**: `2f370fd28cbdeb2108926fba77c70947`

#### Ad Unit 4: Banner 320x50 (ID: 27908866)
- Click on "Banner 320x50" or ID "27908866"
- Copy the ad key
- **Your current code uses**: `35bb5972176687c2571d4f6e436e1f71`

### Step 2: Compare Ad Keys

Create a table like this:

| Ad Size | Adsterra Dashboard Key | Your Code Key | Match? |
|---------|----------------------|---------------|--------|
| 728x90 | [Paste from dashboard] | `b4903cf5635d652e019f9cf30ea1cd88` | ⚠️ Check |
| 468x60 | [Paste from dashboard] | `d8c93074244d311adc394f3a309c3118` | ⚠️ Check |
| 300x250 | [Paste from dashboard] | `2f370fd28cbdeb2108926fba77c70947` | ⚠️ Check |
| 320x50 | [Paste from dashboard] | `35bb5972176687c2571d4f6e436e1f71` | ⚠️ Check |

### Step 3: Update Code if Keys Don't Match

If ad keys don't match, update your code:

**File**: `tradyx-options-dashboard/components/dashboard/OptionsDashboard.tsx`

Update the ad keys to match Adsterra dashboard:

```tsx
// Ad 1: 728x90
<HighPerformanceAd 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA]"
  width={728}
  height={90}
/>

// Ad 2: 468x60
<HighPerformanceAd 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA]"
  width={468}
  height={60}
/>

// Ad 3: 300x250 (in HighPerformanceAdSidebar)
<HighPerformanceAdSidebar 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA]"
  width={300}
  height={250}
/>

// Ad 4: 320x50 (in HighPerformanceAdSidebar)
<HighPerformanceAdSidebar 
  adKey="[PASTE CORRECT KEY FROM ADSTERRA]"
  width={320}
  height={50}
/>
```

## 🔍 Check Adsterra Dashboard Statistics

### Step 1: Check Fill Rates

1. Go to **"Statistics"** or **"Reports"** in Adsterra
2. Select **"Last 7 days"** or **"Last 30 days"**
3. Check **Fill Rate** for each ad:
   - **0%** = Adsterra has no ads to serve
   - **>0%** = Ads available (but might not be showing due to other issues)

### Step 2: Check Impressions

1. In Statistics, check **Impressions**:
   - **0** = No ads serving at all
   - **>0** = Ads are serving (but might not be visible)

### Step 3: Check Revenue

1. Check **Revenue**:
   - **$0.00** = No ads serving
   - **>$0.00** = Ads are serving and earning

## 🚨 Common Issues

### Issue 1: Ad Keys Don't Match

**Symptom**: Dashboard shows "Active" but ads don't load

**Solution**: 
1. Get correct ad keys from Adsterra dashboard
2. Update code with correct keys
3. Redeploy

### Issue 2: Fill Rate = 0%

**Symptom**: Ad keys match, scripts load, but no ads

**Solution**:
- This is **NORMAL** for new accounts
- Wait 24-48 hours
- Adsterra needs time to populate ads
- Contact Adsterra support if persists after 48 hours

### Issue 3: Site Not Approved

**Symptom**: Ads marked "Active" but no impressions

**Solution**:
1. Check **"Sites"** section in Adsterra
2. Verify `tradyx-quant-gamma.vercel.app` is **approved**
3. If pending, wait for approval (24-48 hours)

### Issue 4: Geographic Restrictions

**Symptom**: Ads work in some locations, not others

**Solution**:
- This is normal
- Adsterra inventory varies by location
- Test from different locations/VPN

## 📞 Next Steps

### 1. Verify Ad Keys (CRITICAL)

**Do this first**:
1. Login to Adsterra dashboard
2. Click on each ad unit
3. Copy the actual ad key
4. Compare with your code
5. Update if different

### 2. Check Statistics

**Check these in Adsterra**:
- Fill rate for each ad
- Impressions count
- Revenue earned
- Site approval status

### 3. Contact Adsterra Support

**If ad keys match and fill rate is 0%**:

Email: support@adsterra.com

**Include**:
- Ad unit IDs: 27908777, 27908860, 27908843, 27908866
- Website: tradyx-quant-gamma.vercel.app
- Issue: Iframes created but empty, 0/4 ads loading
- Screenshots: Dashboard showing active status
- Question: Why fill rate is 0% even though ads are active?

### 4. Wait 24-48 Hours

**If this is a new account**:
- Adsterra needs time to populate ads
- Fill rates improve over time
- Check again in 24-48 hours

## ✅ Quick Checklist

- [ ] Verified ad keys match between Adsterra and code
- [ ] Checked fill rates in Adsterra dashboard
- [ ] Checked impressions count
- [ ] Verified site is approved
- [ ] Tested with ad blocker disabled
- [ ] Waited 24-48 hours (if new account)
- [ ] Contacted Adsterra support (if needed)

## 🎯 Most Likely Solution

Based on your situation (had 3 ads, now 1, test shows 0/4):

1. **Ad keys might have changed** in Adsterra dashboard
2. **Fill rate dropped to 0%** (temporary inventory issue)
3. **Site needs re-approval** after changes
4. **Geographic/timing issue** (ads available at different times)

**Action**: Verify ad keys match first, then check fill rates and contact support if needed.

