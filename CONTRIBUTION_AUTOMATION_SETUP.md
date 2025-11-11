# 🤖 Quick Setup Guide - Contribution Automation

This is a **standalone, optional** workflow that makes automated commits to show activity on your GitHub contribution graph.

## ✅ What Was Created

1. **`.github/workflows/contribution-automation.yml`** - The workflow file
2. **`contributions-log.txt`** - File that gets updated (tracked in git)
3. **`.github/workflows/CONTRIBUTION_AUTOMATION_README.md`** - Detailed documentation

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Email (Optional)

The workflow uses GitHub's no-reply email by default. If you want to use your actual email:

1. Open `.github/workflows/contribution-automation.yml`
2. Find line: `GIT_EMAIL="${GITHUB_ACTOR}@users.noreply.github.com"`
3. Replace with: `GIT_EMAIL="your-email@example.com"`

### Step 2: Enable Private Contributions (if using private repo)

1. Go to: https://github.com/settings/profile
2. Scroll to "Contribution settings"
3. Enable "Include private contributions on my profile"

### Step 3: Commit and Push

```bash
git add .github/workflows/contribution-automation.yml
git add contributions-log.txt
git add .github/workflows/CONTRIBUTION_AUTOMATION_README.md
git commit -m "feat: add optional contribution automation workflow"
git push
```

## ⚙️ How It Works

- **Schedule**: Runs daily at 12:00 PM UTC (configurable)
- **Action**: Updates `contributions-log.txt` with a timestamp
- **Commit**: Creates a commit and pushes to repository
- **Result**: Shows up on your GitHub contribution graph

## 🗑️ How to Delete (If Not Needed)

```bash
# Delete the workflow
rm .github/workflows/contribution-automation.yml

# Delete the log file
rm contributions-log.txt

# Delete the README (optional)
rm .github/workflows/CONTRIBUTION_AUTOMATION_README.md
rm CONTRIBUTION_AUTOMATION_SETUP.md

# Commit the deletion
git add .
git commit -m "chore: remove contribution automation"
git push
```

## 📝 Adjust Schedule

Edit `.github/workflows/contribution-automation.yml`:

```yaml
# Daily at noon (default)
- cron: '0 12 * * *'

# Multiple times per day
- cron: '0 0 * * *'   # Midnight
- cron: '0 12 * * *'  # Noon
- cron: '0 18 * * *'  # 6 PM

# Every 6 hours
- cron: '0 */6 * * *'
```

## ⚠️ Important Notes

- ✅ **Does not interfere** with your main project
- ✅ **Easy to delete** - Just remove the files
- ✅ **Safe** - Only updates a log file
- ⚠️ **GitHub ToS** - Use responsibly, don't misrepresent activity
- 🔒 **Private repos** - Enable "Show private contributions" in settings

## 🎯 Status

**Current Status**: ✅ Ready to use

**Next Steps**:
1. Commit and push the files
2. Wait for the first scheduled run (or trigger manually)
3. Check your contribution graph in 24 hours

## 📚 More Info

See `.github/workflows/CONTRIBUTION_AUTOMATION_README.md` for detailed documentation.

---

**Last Updated**: December 2024

