# How to Know if Adsterra is Not Serving Ads

## 🔍 Quick Diagnosis Checklist

### ✅ Step 1: Check Browser Console (5 seconds)

1. Open your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these indicators:

#### 🟢 Adsterra IS Serving Ads (Code Working)
```
✅ Scripts load successfully (200 status)
✅ No CORS errors
✅ No script blocking errors
✅ [Ad Debug] Script loaded successfully messages
```

#### 🔴 Adsterra NOT Serving Ads (Inventory Issue)
```
⚠️ Scripts load (200 status) but no ads appear
⚠️ Console shows: "Ad not available" or similar
⚠️ Network requests succeed but iframe is empty
⚠️ No errors, just empty ad spaces
```

#### 🟡 Code Issue (Fix Needed)
```
❌ Scripts fail to load (404, CORS, blocked)
❌ CSP violations in console
❌ Script errors
❌ Container not found errors
```

---

## 📊 Step 2: Check Network Tab (1 minute)

1. Press **F12** → **Network** tab
2. Filter by **JS** or search for **"highperformanceformat"**
3. Look for these requests:

### ✅ Good Signs (Adsterra Working)
```
Request URL: https://www.highperformanceformat.com/[adKey]/invoke.js
Status: 200 OK
Size: ~5-50 KB
Type: script
```

### ⚠️ Adsterra Not Serving Ads (But Code Works)
```
Request URL: https://www.highperformanceformat.com/[adKey]/invoke.js
Status: 200 OK
Size: ~1-5 KB (small = no ad content)
Type: script
Response: Script loads but creates empty iframe
```

### ❌ Code Issue
```
Request URL: https://www.highperformanceformat.com/[adKey]/invoke.js
Status: 404 (Not Found)
Status: CORS error
Status: Blocked by CSP
Status: Failed to load
```

---

## 🎯 Step 3: Check Adsterra Dashboard (2 minutes)

### Login to Adsterra
1. Go to [Adsterra Dashboard](https://publishers.adsterra.com/)
2. Login with your account
3. Navigate to **"Zones"** or **"Ad Units"**

### Check Each Ad Key Status

Verify all 4 ad keys:

| Ad Key | Size | Status Should Be |
|--------|------|------------------|
| `b4903cf5635d652e019f9cf30ea1cd88` | 728x90 | ✅ Active, Approved |
| `d8c93074244d311adc394f3a309c3118` | 468x60 | ✅ Active, Approved |
| `2f370fd28cbdeb2108926fba77c70947` | 300x250 | ✅ Active, Approved |
| `35bb5972176687c2571d4f6e436e1f71` | 320x50 | ✅ Active, Approved |

### Key Indicators:

#### ✅ Adsterra IS Serving Ads
- **Status**: Active/Approved
- **Impressions**: > 0 (ads being shown)
- **Revenue**: > $0 (earning from ads)
- **Fill Rate**: > 0% (ads being served)

#### ⚠️ Adsterra NOT Serving Ads
- **Status**: Active but **No Impressions**
- **Fill Rate**: 0% (no ads available)
- **Revenue**: $0.00
- **Message**: "Waiting for ads" or "No campaigns available"

#### ❌ Ad Keys Not Set Up
- **Status**: Pending/Rejected/Inactive
- **Message**: "Not approved" or "Inactive"
- **Action Needed**: Contact Adsterra support

---

## 🧪 Step 4: Test with HTML File (2 minutes)

### Test Your Ad Keys Directly

1. Open the test file: `/public/adsterra-test.html` in your browser
2. Or create a simple test:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Adsterra Test</title>
</head>
<body>
    <h1>Testing Ad Key: b4903cf5635d652e019f9cf30ea1cd88</h1>
    <div style="border: 2px solid red; min-height: 90px; width: 728px;">
        <script type="text/javascript">
            atOptions = {
                'key' : 'b4903cf5635d652e019f9cf30ea1cd88',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
            };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/b4903cf5635d652e019f9cf30ea1cd88/invoke.js"></script>
    </div>
</body>
</html>
```

### Results:

#### ✅ Ad Shows = Adsterra Serving Ads
- You see an ad in the red box
- Ad loads within 2-3 seconds
- **Conclusion**: Code issue on your site, not Adsterra

#### ⚠️ Empty Box = Adsterra Not Serving Ads
- Red box stays empty
- No errors in console
- Script loads (200 status) but no ad
- **Conclusion**: Adsterra has no ads for this key/location/time

---

## 🔬 Step 5: Check iframe Content (Advanced)

### Inspect the Ad Container

1. Right-click on empty ad space → **Inspect**
2. Look for `<iframe>` elements
3. Check iframe content:

#### ✅ Adsterra Serving Ads
```html
<iframe src="https://delivery.adsterra.net/..." width="728" height="90">
  <!-- Ad content visible -->
</iframe>
```

#### ⚠️ Adsterra Not Serving Ads
```html
<iframe src="about:blank" width="728" height="90">
  <!-- Empty iframe -->
</iframe>
```
OR
```html
<!-- No iframe created at all -->
<div id="hpf-ad-...">
  <script>...</script>
  <!-- Scripts loaded but no iframe -->
</div>
```

---

## 📈 Step 6: Check Adsterra Statistics

### In Adsterra Dashboard:

1. Go to **"Statistics"** or **"Reports"**
2. Check **"Impressions"** for each ad key
3. Check **"Fill Rate"** percentage

### What to Look For:

#### ✅ Ads Being Served
- **Impressions**: Increasing daily
- **Fill Rate**: 10-90% (varies by location/time)
- **Revenue**: > $0.00
- **CTR**: 0.1% - 5%

#### ⚠️ No Ads Available
- **Impressions**: 0 or very low
- **Fill Rate**: 0%
- **Revenue**: $0.00
- **Message**: "No campaigns available"

---

## 🎯 Quick Decision Tree

```
Start
  ↓
Are scripts loading? (Network tab shows 200 status)
  ↓ NO → Code Issue (Fix CSP, check network)
  ↓ YES
  ↓
Are scripts executing? (Console shows no errors)
  ↓ NO → Code Issue (Check script loading)
  ↓ YES
  ↓
Are iframes being created? (Inspect element shows iframe)
  ↓ NO → Adsterra Not Serving Ads
  ↓ YES
  ↓
Are iframes empty? (iframe src="about:blank" or empty)
  ↓ YES → Adsterra Not Serving Ads ✅
  ↓ NO
  ↓
Ads are showing! ✅
```

---

## 🔍 Common Scenarios

### Scenario 1: All Ads Empty
**Possible Causes**:
- ❌ Ad keys not approved
- ❌ New account (takes 24-48 hours)
- ❌ Geographic location (no ads in your region)
- ❌ Time of day (low inventory)

**Solution**: 
- Check Adsterra dashboard
- Wait 24-48 hours
- Contact Adsterra support

### Scenario 2: Some Ads Show, Others Don't
**Possible Causes**:
- ✅ Normal behavior (inventory varies by size)
- ⚠️ Some ad keys not approved
- ⚠️ Different fill rates per ad size

**Solution**: 
- Check which ad keys are approved
- Verify fill rates in dashboard
- This is normal - not all slots will always have ads

### Scenario 3: Ads Show Then Disappear
**Possible Causes**:
- ❌ Code issue (React re-rendering)
- ❌ CSS hiding ads
- ❌ Ad blocker removing ads

**Solution**: 
- Check React re-renders
- Verify CSS isn't hiding ads
- Test with ad blocker disabled

### Scenario 4: Console Errors
**Possible Causes**:
- ❌ CSP blocking scripts
- ❌ CORS errors
- ❌ Network issues
- ❌ Invalid ad keys

**Solution**: 
- Check CSP headers
- Verify ad keys are correct
- Check network connectivity

---

## ✅ Quick Test Script

Paste this in browser console to test all ads:

```javascript
// Test all 4 ad keys
const adKeys = [
  { key: 'b4903cf5635d652e019f9cf30ea1cd88', size: '728x90' },
  { key: 'd8c93074244d311adc394f3a309c3118', size: '468x60' },
  { key: '2f370fd28cbdeb2108926fba77c70947', size: '300x250' },
  { key: '35bb5972176687c2571d4f6e436e1f71', size: '320x50' }
];

adKeys.forEach(({ key, size }) => {
  const testDiv = document.createElement('div');
  testDiv.style.cssText = 'border: 2px solid red; margin: 20px; padding: 10px;';
  testDiv.innerHTML = `
    <h3>Testing ${size}</h3>
    <div id="test-${key}">
      <script>
        atOptions = { 'key' : '${key}', 'format' : 'iframe', 'height' : ${size.split('x')[1]}, 'width' : ${size.split('x')[0]}, 'params' : {} };
      </script>
      <script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
    </div>
  `;
  document.body.appendChild(testDiv);
  
  // Check after 3 seconds
  setTimeout(() => {
    const iframe = testDiv.querySelector('iframe');
    if (iframe && iframe.src !== 'about:blank') {
      console.log(`✅ ${size}: Ad loaded`);
    } else {
      console.log(`⚠️ ${size}: No ad (Adsterra may not have inventory)`);
    }
  }, 3000);
});
```

---

## 📞 When to Contact Adsterra Support

Contact support if:
1. ✅ All ad keys are approved but **0 impressions** after 48 hours
2. ✅ Scripts load but **fill rate is 0%**
3. ✅ Account shows **"No campaigns available"**
4. ✅ Ad keys show **"Pending" or "Rejected"** status

**Adsterra Support**:
- Email: support@adsterra.com
- Dashboard: Submit ticket in support section
- Include: Ad keys, account details, screenshots

---

## 🎯 Summary

### ✅ Adsterra IS Serving Ads If:
- Scripts load (200 status)
- Iframes created with content
- Impressions > 0 in dashboard
- Fill rate > 0%

### ⚠️ Adsterra NOT Serving Ads If:
- Scripts load but iframes empty
- Fill rate = 0%
- Impressions = 0
- No errors, just empty spaces

### ❌ Code Issue If:
- Scripts fail to load (404, CORS)
- CSP violations
- Container not found errors
- Script execution errors

---

**Remember**: Empty ad spaces are **NORMAL** if Adsterra has no inventory. This doesn't mean your code is broken - it just means no ads are available at that moment for your location/time/ad size.

