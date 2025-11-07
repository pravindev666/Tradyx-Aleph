# Google AdSense: Manual vs Auto Ads

## 📊 Your Current Setup

You have **4 designated ad tiles** in your dashboard:
1. Ad placement in sidebar
2. Ad before "Prediction Models" section
3. Ad after "Prediction Models" section
4. Other ad placements

## 🔀 Two AdSense Options

### Option 1: **Manual Ad Placements** (Recommended for Your 4 Tiles) ✅

**What it does:**
- You control exactly where ads appear
- Ads show in your 4 designated tiles only
- You can set specific ad sizes (728x90, 300x250, etc.)
- Better user experience - ads appear where you want them

**How to set up:**
1. Go to Google AdSense → Ads → By ad unit
2. Click **"+ New ad unit"**
3. Choose format (e.g., Display ads, In-article ads)
4. Set size (e.g., 728x90, 300x250, Responsive)
5. Give it a name (e.g., "Sidebar Ad 1", "Prediction Models Top")
6. Click **"Create"**
7. Copy the **Ad unit ID** (looks like: `1234567890`)
8. Replace `XXXXXXXXXX` in your `AdSlot` components with the actual ID

**Your code (already set up):**
```tsx
<AdSlot
  slot="1234567890"  // ← Your AdSense ad unit ID
  style={{ display: 'block', width: '100%', minHeight: 90 }}
  format="auto"
/>
```

### Option 2: **Auto Ads** (Places Ads Everywhere Automatically) ⚠️

**What it does:**
- Google automatically places ads **all over your site**
- You have NO control over placement
- Ads can appear anywhere Google thinks is optimal
- Can be disruptive to user experience

**How it works:**
- Just add the script in `<head>` (already done)
- Google automatically injects ads wherever it wants
- You can't control which pages or sections get ads

## 🎯 Recommendation: Use **Manual Placements** for Your 4 Tiles

Since you have **4 specific ad tiles** designed in your dashboard, use **Manual Ad Placements**:

1. ✅ Better user experience
2. ✅ Ads appear exactly where you designed them
3. ✅ No unexpected ads popping up
4. ✅ You control the ad sizes and formats

## 📋 Setup Steps for Manual Ad Placements

### Step 1: Create Ad Units in Google AdSense

1. Go to: https://www.google.com/adsense/
2. Click **"Ads"** → **"By ad unit"**
3. Click **"+ New ad unit"**
4. For each of your 4 tiles, create an ad unit:

   **Tile 1: Sidebar Ad**
   - Name: "Tradyx Sidebar Ad"
   - Size: Responsive (or 300x250)
   - Type: Display ads

   **Tile 2: Before Prediction Models**
   - Name: "Tradyx Top Banner"
   - Size: Responsive (or 728x90)
   - Type: Display ads

   **Tile 3: After Prediction Models**
   - Name: "Tradyx Bottom Banner"
   - Size: Responsive (or 728x90)
   - Type: Display ads

   **Tile 4: Other placements**
   - Create as needed

### Step 2: Get Ad Unit IDs

After creating each ad unit, you'll see an **Ad unit ID** (e.g., `1234567890`).

### Step 3: Update Your Code

Replace the placeholder `XXXXXXXXXX` with your actual ad unit IDs:

```tsx
// In OptionsDashboard.tsx
<AdSlot
  slot="1234567890"  // ← Sidebar ad unit ID
  style={{ display: 'block', width: 300, height: 250 }}
/>

<AdSlot
  slot="2345678901"  // ← Top banner ad unit ID
  style={{ display: 'block', width: '100%', minHeight: 90 }}
/>
```

### Step 4: Test

1. Deploy your site
2. Visit your live site
3. Ads should appear in your 4 designated tiles
4. It may take up to 1 hour for ads to start showing

## ❌ Don't Use Auto Ads If You Have Designated Tiles

**Auto ads will:**
- Place ads everywhere, not just in your 4 tiles
- Ignore your designated ad placements
- Create a poor user experience
- Conflict with your manual placements

## ✅ What You Already Have (Correct Setup)

1. ✅ AdSense script in `<head>` (already added)
2. ✅ AdSlot component (already created)
3. ✅ 4 ad placements in dashboard (already designed)
4. ✅ Publisher ID set: `ca-pub-3773170640876257`

## 🚀 Next Steps

1. **Create 4 ad units** in Google AdSense
2. **Get the 4 ad unit IDs**
3. **Update your code** with the actual IDs
4. **Deploy and test**

Your setup is already correct for manual placements! Just need to create the ad units and add the IDs.

