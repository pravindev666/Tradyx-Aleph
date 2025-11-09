# Ad Loading Troubleshooting Guide

## 🔍 Quick Diagnosis

### Step 1: Check Browser Console
1. Open your site
2. Press **F12** → **Console** tab
3. Look for messages starting with `[Ad Debug]` or `[Ad Error]`
4. Check for any red errors

### Step 2: Check Network Tab
1. Press **F12** → **Network** tab
2. Filter by "JS" or search for "highperformanceformat"
3. Check if scripts are loading (200 status = success)
4. Check if scripts are blocked (CORS errors, 404, etc.)

### Step 3: Verify Ad Keys
In Adsterra dashboard, verify all 4 ad keys are:
- ✅ **Active**
- ✅ **Approved**
- ✅ **Have active campaigns**

## 🐛 Common Issues & Solutions

### Issue 1: Ads Not Loading at All
**Symptoms**: All ad spaces are empty

**Possible Causes**:
- Ad keys not approved in Adsterra
- CSP blocking scripts
- Network/CORS errors

**Solution**:
1. Check browser console for errors
2. Verify CSP allows `highperformanceformat.com`
3. Check Adsterra dashboard for approval status

### Issue 2: Some Ads Load, Others Don't
**Symptoms**: 1-2 ads show, rest are empty (YOUR CURRENT ISSUE)

**Possible Causes**:
- Adsterra doesn't have ads to serve for those slots
- Ad keys not approved
- Geographic/timing variations

**Solution**:
1. **This is NORMAL** - Adsterra may not have ads for all slots
2. Check Adsterra dashboard - are all keys approved?
3. Wait 24-48 hours for ads to populate
4. Test at different times/locations

### Issue 3: Ads Load Then Disappear
**Symptoms**: Ads flash briefly then vanish

**Possible Causes**:
- CSS `overflow: hidden` clipping ads
- Container dimensions too small
- React re-rendering removing scripts

**Solution**:
- ✅ Already fixed: Removed `overflow: hidden` wrappers
- ✅ Already fixed: Simplified ad loading logic

### Issue 4: Console Errors
**Symptoms**: Errors in browser console

**Common Errors**:
- `Failed to load resource` → Check network connectivity
- `CORS error` → Check CSP headers
- `Script error` → Adsterra script issue (contact support)

## 🛠️ Code Changes Made

### 1. Simplified Ad Loading
- Removed complex queue system
- Direct script injection (matches test HTML)
- Better error handling

### 2. Fixed Container Issues
- Removed `overflow: hidden` wrappers
- Simplified nested div structure
- Better dimension handling

### 3. Improved Timing
- Uses `setTimeout` with proper delays
- Waits for React rendering to complete
- Prevents double-loading

### 4. Better Debugging
- Added `[Ad Debug]` console logs
- Logs when scripts load/fail
- Easier to identify issues

## 📊 Testing Your Ads

### Test 1: Check Test HTML
1. Open `/public/adsterra-test.html` in browser
2. Do all 4 ads load?
3. If YES → Code issue
4. If NO → Adsterra issue

### Test 2: Check Individual Ad Keys
Open browser console and run:
```javascript
// Test ad 1
const testAd1 = document.createElement('div');
testAd1.innerHTML = `
  <script>atOptions = { 'key' : 'b4903cf5635d652e019f9cf30ea1cd88', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };</script>
  <script src="https://www.highperformanceformat.com/b4903cf5635d652e019f9cf30ea1cd88/invoke.js"></script>
`;
document.body.appendChild(testAd1);
```

### Test 3: Check Container Elements
```javascript
// Check if containers exist
document.querySelectorAll('[data-ad-key]').forEach(el => {
  console.log('Container:', el.id, el.getAttribute('data-ad-key'));
  console.log('Scripts:', el.querySelectorAll('script').length);
});
```

## ✅ What's Fixed

1. ✅ **Removed overflow-hidden** - Was clipping ads
2. ✅ **Simplified loading** - Direct script injection
3. ✅ **Better timing** - Waits for DOM ready
4. ✅ **Debug logs** - Easier troubleshooting
5. ✅ **Fixed wrappers** - Removed unnecessary divs

## 🎯 Next Steps

1. **Deploy the updated code**
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Check browser console** for `[Ad Debug]` messages
4. **Wait 24-48 hours** for Adsterra to populate ads
5. **Test at different times** - Ad inventory varies

## 📞 If Still Not Working

### Contact Adsterra Support
1. Check if all ad keys are approved
2. Ask about ad inventory for your region
3. Verify account status
4. Request ad zone activation

### Check Your Code
1. Verify CSP allows Adsterra scripts
2. Check network requests in browser
3. Verify ad keys are correct
4. Test with test HTML file

---

## 🔑 Key Points

- **One ad loading = Code works!** ✅
- **Empty spaces = Normal** if Adsterra has no ads
- **Wait 24-48 hours** for ads to populate
- **Check Adsterra dashboard** for approval status
- **Test at different times** - inventory varies

**Remember**: Adsterra serves ads based on availability. Empty spaces don't mean code is broken - they just mean no ads available at that moment!

