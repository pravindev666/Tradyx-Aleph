# GitHub Actions: Caching & Usage Limits

## 📦 Dependency Caching

### Current Status
✅ **YES, caching is enabled** in your workflow, but it can be optimized.

### How It Works
1. **First Run**: Downloads all dependencies (~620MB TensorFlow, etc.) - takes ~1-2 minutes
2. **Subsequent Runs**: 
   - If `requirements.txt` hasn't changed → Uses cached dependencies
   - If `requirements.txt` changed → Only downloads new/changed packages
   - Cache is stored for 7 days by default

### What I Just Optimized
- Added explicit `cache-dependency-path` to point to the correct requirements.txt location
- This ensures pip cache is properly detected and used

### Cache Behavior
- **Cache Hit**: Installation takes ~10-30 seconds (just checks/installs from cache)
- **Cache Miss**: Installation takes ~1-2 minutes (downloads packages)
- **Partial Cache**: Takes ~30-60 seconds (only new packages downloaded)

---

## 📊 GitHub Actions Usage Limits

### Free Tier (Public Repositories)
- **Unlimited minutes** ✅
- **Unlimited storage** ✅
- **Free for public repos!**

### Free Tier (Private Repositories)
- **2,000 minutes/month** ⚠️
- **500 MB storage/month**
- **Billing**: $0.008 per GB storage per day if exceeded

### Pro Plan (Private Repos)
- **3,000 minutes/month**
- **1 GB storage/month**

### Enterprise Plan (Private Repos)
- **50,000 minutes/month**
- **50 GB storage/month**

### Runner Multipliers (Only for Private Repos)
- **Linux**: 1x (1 minute = 1 minute)
- **Windows**: 2x (1 minute = 2 minutes)
- **macOS**: 10x (1 minute = 10 minutes)

---

## 🔢 Your Current Usage Calculation

### Workflow Schedule
- **Frequency**: Every 15 minutes
- **Hours**: 9:15 AM - 3:30 PM IST (Market hours)
- **Days**: Monday to Friday
- **Total Runs/Day**: ~26 runs
- **Total Runs/Week**: ~130 runs
- **Total Runs/Month**: ~520 runs

### Time Per Run (From Your Logs)
- **Dependency Installation**: 1-2 minutes (with cache: ~10-30 seconds)
- **Script Execution**: ~15-20 seconds
- **Git Commit/Push**: ~2-5 seconds
- **Total**: ~1-3 minutes per run

### Monthly Usage Estimate
- **Without Cache**: 520 runs × 2 minutes = **1,040 minutes/month**
- **With Cache**: 520 runs × 1 minute = **520 minutes/month**

### Conclusion
✅ **Your usage is well within free tier limits!**
- Public repo: Unlimited ✅
- Private repo: ~520-1,040 minutes/month (well under 2,000 limit) ✅

---

## ⚡ Optimization Tips

### 1. Cache Optimization (Already Done)
- ✅ Added `cache-dependency-path` to ensure proper cache detection
- ✅ Pip cache is automatically used when available

### 2. Reduce Run Frequency (If Needed)
Currently: Every 15 minutes
- **Option 1**: Every 30 minutes → ~260 runs/month
- **Option 2**: Every 1 hour → ~130 runs/month
- **Option 3**: Only on market open/close → ~10 runs/day = ~200 runs/month

### 3. Optimize Dependencies
- Consider removing unused packages
- Use lighter alternatives if possible
- Pin exact versions to reduce cache invalidation

### 4. Monitor Usage
- Go to: Repository → Settings → Actions → Usage
- Track monthly usage
- Set up usage limits if needed

---

## 🎯 Recommendations

### For Your Use Case
1. **Keep current schedule** - It's efficient and within limits
2. **Monitor cache hits** - Should see faster installs after first run
3. **Check monthly usage** - Verify you're staying within limits
4. **Consider condensing runs** - If you want to reduce usage further

### Cache Verification
After the next workflow run, check the logs:
- Look for: "Cache restored from key: ..." (cache hit)
- Look for: "Cache saved with the key: ..." (cache saved)
- Installation time should be much faster on subsequent runs

---

## 📈 Expected Performance

### First Run (No Cache)
- Installation: ~1-2 minutes
- Scripts: ~15-20 seconds
- Total: ~2-3 minutes

### Subsequent Runs (With Cache)
- Installation: ~10-30 seconds (from cache)
- Scripts: ~15-20 seconds
- Total: ~30-60 seconds

### Savings
- **Time saved per run**: ~1-2 minutes
- **Monthly time saved**: ~520-1,040 minutes
- **Faster workflow execution**: ✅

---

## 🚨 Important Notes

1. **Cache Invalidation**: Cache is invalidated when:
   - `requirements.txt` changes
   - Python version changes
   - Cache expires (7 days of no use)

2. **Storage Usage**: 
   - Cache uses GitHub Actions storage
   - Public repos: Unlimited
   - Private repos: Counts toward 500 MB limit

3. **Cost**: 
   - Public repos: **FREE** ✅
   - Private repos: Free up to 2,000 minutes/month

---

## ✅ Summary

**Dependencies**: 
- ✅ Cached (optimized)
- ✅ Reused when available
- ✅ Faster on subsequent runs

**Usage**:
- ✅ Well within free tier limits
- ✅ ~520-1,040 minutes/month
- ✅ No cost for public repos

**Recommendation**:
- ✅ Keep current setup
- ✅ Monitor usage monthly
- ✅ Enjoy free unlimited minutes on public repos!

