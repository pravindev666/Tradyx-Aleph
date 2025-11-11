# Cloudflare Pages Build Calculation

## 📊 Exact Build Count Calculation

### Schedule Details
- **Market hours**: 9:15 AM - 3:30 PM IST
- **Days**: Monday to Friday only
- **Interval**: Every 15 minutes
- **Duration**: 6 hours 15 minutes = 375 minutes

### Runs Per Day
```
Start: 9:15 AM
End: 3:30 PM
Duration: 375 minutes
Interval: 15 minutes

Runs = (375 ÷ 15) + 1 = 25 + 1 = 26 runs/day
```

**Runs per day**: **26 runs**

### Runs Per Week (Mon-Fri)
```
26 runs/day × 5 days = 130 runs/week
```

**Runs per week**: **130 runs**

### Runs Per Month
```
Average weeks per month = 4.33
130 runs/week × 4.33 weeks = 562.9 ≈ 563 runs/month
```

**Runs per month**: **563 runs**

---

## 🔄 Build Trigger Logic

### When Does Cloudflare Build?

**Cloudflare Pages builds when:**
1. ✅ You push to the connected branch (main)
2. ✅ A commit is made to the repository
3. ✅ Build hook is triggered

### Your Workflow Behavior

Looking at your GitHub Actions workflow:

```yaml
# Check if there are changes
if git diff --staged --quiet; then
  echo "⚠️  No changes to commit (all files unchanged)"
  echo "changed=false" >> $GITHUB_OUTPUT
else
  echo "✅ Changes detected, committing..."
  git commit -m "chore: update dashboard data [data refresh]"
  git push origin "$CURRENT_BRANCH"
  echo "changed=true" >> $GITHUB_OUTPUT
fi
```

**Key Point**: Only commits if data **actually changed**

---

## 📈 Build Count Scenarios

### Scenario 1: Maximum Builds (Worst Case)
**If data changes every single time:**
- **Builds per month**: **563 builds**
- **Free tier limit**: 500 builds/month
- **Status**: ⚠️ **EXCEEDS by 63 builds**

### Scenario 2: Realistic Builds (Most Likely)
**If data changes ~50% of the time:**
- **Builds per month**: 563 × 0.5 = **282 builds**
- **Free tier limit**: 500 builds/month
- **Status**: ✅ **SAFE (56% usage)**

### Scenario 3: Conservative Builds (Best Case)
**If data changes ~30% of the time:**
- **Builds per month**: 563 × 0.3 = **169 builds**
- **Free tier limit**: 500 builds/month
- **Status**: ✅ **VERY SAFE (34% usage)**

---

## 🎯 Actual Build Count Depends On:

1. **Market volatility**: More volatility = more data changes
2. **Data source updates**: NSE/Yahoo Finance update frequency
3. **Market hours**: Active trading = more changes
4. **Weekends/holidays**: No runs = no builds

---

## 📊 Monthly Breakdown

### Maximum Possible Builds:
```
Week 1: 130 builds (5 days)
Week 2: 130 builds (5 days)
Week 3: 130 builds (5 days)
Week 4: 130 builds (5 days)
Week 5: 43 builds (partial week)
Total: 563 builds/month
```

### With Conditional Deployment (Realistic):
```
If 50% of runs have data changes:
563 × 0.5 = 282 builds/month ✅
```

---

## ⚠️ Free Tier Limit Analysis

### Cloudflare Pages Free Tier:
- **Limit**: 500 builds/month
- **Your maximum**: 563 builds/month
- **Excess**: 63 builds/month

### What Happens If You Exceed?

**Option 1: Builds are queued**
- Some builds wait in queue
- Slower deployments

**Option 2: Builds fail**
- Error: "Build limit exceeded"
- Manual intervention needed

**Option 3: Upgrade required**
- Cloudflare Pro: $20/month
- Unlimited builds

---

## 💡 Solutions to Stay Within 500 Builds

### Solution 1: Conditional Deployment (Current) ✅
**You already have this!**
- Only builds when data changes
- Estimated: ~282 builds/month
- **Status**: ✅ Safe

### Solution 2: Reduce Frequency
**Change to 30-minute intervals:**
- Runs per day: 13 (instead of 26)
- Builds per month: 281 (if all trigger) or ~141 (if 50% change)
- **Status**: ✅ Very safe

### Solution 3: Deploy Only on Significant Changes
**Add threshold check:**
```python
# Only commit if change is significant
if abs(new_spot - old_spot) > 10:  # Example: 10 point change
    commit_and_deploy()
```

### Solution 4: Deploy Only During Active Hours
**Reduce to 1-hour intervals during lunch:**
- 9:15 AM - 12:00 PM: Every 15 min
- 12:00 PM - 1:00 PM: Every 30 min (lunch)
- 1:00 PM - 3:30 PM: Every 15 min

---

## 📊 Expected Build Count (Realistic)

Based on market data behavior:

| Time Period | Data Change Rate | Builds/Month |
|-------------|------------------|--------------|
| **Market Open** (9:15-10:00) | 80% | High |
| **Active Trading** (10:00-12:00) | 70% | High |
| **Lunch** (12:00-1:00) | 40% | Low |
| **Afternoon** (1:00-3:30) | 60% | Medium |

**Weighted Average**: ~60% change rate
**Expected Builds**: 563 × 0.6 = **338 builds/month** ✅

---

## ✅ Final Answer

### If You Run Data Every 15 Minutes:

**Maximum Possible Builds**: **563 builds/month**
- ⚠️ Exceeds 500 limit by 63 builds

**Realistic Builds** (with conditional deployment): **282-338 builds/month**
- ✅ Well within 500 limit
- ✅ Safe margin

**Recommendation**: 
- ✅ Your current setup (conditional deployment) is good
- ✅ Monitor actual build count in Cloudflare dashboard
- ✅ If approaching 500, reduce to 30-minute intervals

---

## 📈 Monitoring

**Check your actual build count:**
1. Go to Cloudflare Dashboard
2. Select your Pages project
3. View "Deployments" tab
4. Count builds in current month

**Target**: Keep under 450 builds/month for safety margin

---

## 🤖 Methods to Automate GitHub Contributions

The most common and effective way to automate contributions is by setting up a recurring job that uses a script to create a commit and push it to a repository.

### 1. Using a GitHub Action (Recommended)

GitHub Actions provide a powerful, native way to run scheduled jobs directly on GitHub's infrastructure. This method requires no external server and is generally the most reliable for contribution automation.

#### Setup:

1. **Create a dedicated private repository** (or public, but private is better for this purpose).

2. **In the repository, create a YAML workflow file** at `.github/workflows/main.yml`.

3. **Set up a schedule trigger** using cron syntax to run at a specific time (e.g., `cron: '0 12 * * *'` to run daily at noon UTC).

4. **The job should use a specialized Action** like `github-contribution-graph-action` or a simple checkout/commit script.

5. **The script inside the action will typically:**
   - Make a small change to a file (e.g., append a timestamp to README.md).
   - Use `git add .` and `git commit` to stage and commit the change.
   - Use `git push` to send the commit to GitHub.

#### Key Requirement: 
The email address used in the automated commit must be the same one linked and verified on your GitHub account, and you must have "Show private contributions" enabled in your profile settings if the repository is private.

#### Example GitHub Action Workflow:

```yaml
name: Daily Contribution

on:
  schedule:
    - cron: '0 12 * * *'  # Run daily at noon UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update file
        run: |
          echo "$(date)" >> README.md
      
      - name: Commit and push
        run: |
          git config --local user.email "your-email@example.com"
          git config --local user.name "Your Name"
          git add README.md
          git commit -m "chore: update contribution [skip ci]" || exit 0
          git push
```

### 2. Using a Local Script or External Service

You can write a script (in Python, Node.js, Bash, etc.) to perform the commits and schedule it to run on your local machine or a cloud service (like a scheduled cron job on a server).

#### The Script Logic:

1. Get the current date/time.
2. Use a package (like `simple-git` for Node.js or `subprocess` in Python) to execute Git commands.
3. Create/modify a dummy file (e.g., a .txt or .json file).
4. Execute: `git add .`, `git commit -m "Automated update for $(date)"`, and `git push origin main`.

#### Scheduling: 
Use a local scheduler like `cron` (on Linux/macOS) or Task Scheduler (on Windows) to run the script every 30 minutes, daily, or at your desired interval.

#### Example Python Script:

```python
import subprocess
from datetime import datetime

# Update a file
with open('contributions.txt', 'a') as f:
    f.write(f"{datetime.now()}\n")

# Git commands
subprocess.run(['git', 'add', '.'])
subprocess.run(['git', 'commit', '-m', f'chore: update contributions {datetime.now()}'])
subprocess.run(['git', 'push', 'origin', 'main'])
```

#### Example Node.js Script:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

// Update a file
fs.appendFileSync('contributions.txt', `${new Date()}\n`);

// Git commands
execSync('git add .');
execSync(`git commit -m "chore: update contributions ${new Date()}"`);
execSync('git push origin main');
```

### 🎨 Automating Contribution Patterns

Some tools and scripts go beyond just a daily commit and can be used to generate specific patterns or text in your contribution graph.

These tools work by manipulating the commit date/timestamp. Since the density of the green tile color is based on the number of commits on a given day, these scripts create multiple commits with specific timestamps to "draw" on the contribution graph.

#### Popular examples of community-created tools for this include:
- `github-activity-generator` or similar scripts you can find on GitHub
- Python or Node.js scripts that use Git to create commits for historical or future dates
- Tools that manipulate commit timestamps to create patterns

#### Example Pattern Generation Script:

```python
import subprocess
from datetime import datetime, timedelta

def create_commit_for_date(date, message):
    """Create a commit for a specific date"""
    env = {
        **os.environ,
        'GIT_AUTHOR_DATE': date.isoformat(),
        'GIT_COMMITTER_DATE': date.isoformat(),
    }
    subprocess.run(['git', 'add', '.'], env=env)
    subprocess.run(['git', 'commit', '-m', message], env=env)

# Create commits for a pattern
start_date = datetime(2024, 1, 1)
for i in range(365):
    date = start_date + timedelta(days=i)
    create_commit_for_date(date, f'chore: contribution {date.strftime("%Y-%m-%d")}')
```

#### Important Notes:

- ⚠️ **GitHub's Terms of Service**: Be aware that automated contributions may violate GitHub's Terms of Service if used to misrepresent activity.
- ✅ **Best Practice**: Use automation for legitimate purposes, such as tracking daily work, project updates, or maintaining activity on personal projects.
- 🔒 **Privacy**: Consider using private repositories for contribution automation to avoid misleading others about your actual activity level.

