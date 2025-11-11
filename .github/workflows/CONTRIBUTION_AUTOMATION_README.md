# 🤖 Contribution Automation - Optional Workflow

This is an **optional** workflow that automatically makes commits to your repository to show activity on your GitHub contribution graph.

## ⚠️ Important Notes

- **This is optional** - You can safely delete this workflow if you don't need it
- **Does not interfere** with your main project workflows
- **Easy to remove** - Just delete `.github/workflows/contribution-automation.yml` and `contributions-log.txt`
- **GitHub Terms of Service** - Be aware that automated contributions may violate GitHub's ToS if used to misrepresent activity

## 🚀 Setup Instructions

### Step 1: Configure Your Email

1. Open `.github/workflows/contribution-automation.yml`
2. Find the line: `GIT_EMAIL="${GITHUB_ACTOR}@users.noreply.github.com"`
3. Option 1: Keep the default (uses GitHub's no-reply email)
4. Option 2: Replace with your actual GitHub email:
   ```yaml
   GIT_EMAIL="your-email@example.com"
   ```

### Step 2: Enable Private Contributions (if using private repo)

1. Go to GitHub Settings > Profile
2. Scroll to "Contribution settings"
3. Enable "Include private contributions on my profile"

### Step 3: Adjust Schedule (Optional)

The workflow is set to run daily at noon UTC. You can modify the schedule in the workflow file:

```yaml
schedule:
  - cron: '0 12 * * *'  # Daily at noon UTC
```

**Cron Syntax:**
- `0 12 * * *` - Daily at 12:00 PM UTC
- `0 */6 * * *` - Every 6 hours
- `0 0,12 * * *` - Twice daily (midnight and noon)

## 🗑️ How to Delete

If you don't need this automation:

1. Delete the workflow file:
   ```bash
   rm .github/workflows/contribution-automation.yml
   ```

2. Delete the contribution log file:
   ```bash
   rm contributions-log.txt
   ```

3. Commit the deletion:
   ```bash
   git add .
   git commit -m "chore: remove contribution automation"
   git push
   ```

## 📊 How It Works

1. **Scheduled Trigger**: GitHub Actions runs the workflow on a schedule
2. **Update File**: Appends a timestamp to `contributions-log.txt`
3. **Commit**: Creates a commit with the updated file
4. **Push**: Pushes the commit to your repository
5. **Contribution Graph**: GitHub shows the commit on your contribution graph

## ⚙️ Configuration Options

### Change Commit Frequency

Edit the `schedule` section in the workflow file:

```yaml
# Daily
- cron: '0 12 * * *'

# Multiple times per day
- cron: '0 0 * * *'   # Midnight
- cron: '0 12 * * *'  # Noon
- cron: '0 18 * * *'  # 6 PM

# Every few hours
- cron: '0 */6 * * *'  # Every 6 hours
```

### Change Commit Message

Edit the `COMMIT_MSG` variable in the workflow:

```yaml
COMMIT_MSG="chore: automated contribution [$(date -u +%Y-%m-%d)]"
```

### Change File Updated

Edit the `CONTRIB_FILE` variable:

```yaml
CONTRIB_FILE="contributions-log.txt"
```

## 🔒 Privacy & Security

- **Private Repos**: Enable "Show private contributions" in GitHub settings
- **Email**: Uses GitHub's no-reply email by default (recommended)
- **Permissions**: Only requires `contents: write` permission
- **No Data**: Doesn't expose any sensitive information

## 📝 Files Created

- `.github/workflows/contribution-automation.yml` - The workflow file
- `contributions-log.txt` - The file that gets updated

Both files can be safely deleted without affecting your main project.

## ❓ Troubleshooting

### Commits not showing on contribution graph?

1. **Check email**: Make sure the email in the workflow matches your GitHub account
2. **Check settings**: Enable "Show private contributions" if using a private repo
3. **Check workflow runs**: Go to Actions tab to see if workflow is running
4. **Check commits**: Verify commits are being created in the repository

### Workflow not running?

1. **Check schedule**: Verify the cron syntax is correct
2. **Check permissions**: Ensure workflow has `contents: write` permission
3. **Check Actions**: Go to Actions tab to see workflow status
4. **Manual trigger**: Use `workflow_dispatch` to test manually

## 🎯 Best Practices

- ✅ Use for legitimate purposes (daily work tracking, project updates)
- ✅ Keep commits minimal and unobtrusive
- ✅ Use private repositories if possible
- ✅ Review commits periodically
- ❌ Don't use to misrepresent activity
- ❌ Don't create excessive commits
- ❌ Don't use for spam or abuse

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Syntax Guide](https://crontab.guru/)
- [GitHub Contribution Settings](https://github.com/settings/profile)

---

**Last Updated**: December 2024

**Status**: Optional - Can be safely deleted

