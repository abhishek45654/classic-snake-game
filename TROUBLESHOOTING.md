# GitHub Pages Deployment Troubleshooting

## 🔍 Common Issues & Solutions

### 1. **Blank Page / Nothing Showing** 

**Possible Causes:**

#### A. GitHub Pages Still Building
- The first deployment can take 1-2 minutes
- **Check Status:** Go to your GitHub repository → **Actions** tab
  - Look for the "Deploy to GitHub Pages" workflow
  - Wait for it to show ✅ (green checkmark)

#### B. GitHub Pages Not Configured Correctly
**Solution:**
1. Go to your repository **Settings**
2. Scroll down to **Pages** section
3. Under "Build and deployment":
   - **Source:** Should be "GitHub Actions" (if using automatic workflow)
   - OR **Source:** "Deploy from a branch" with **gh-pages** branch selected
   - **Folder:** root (/)
4. Click **Save**
5. Wait 1-2 minutes and refresh

#### C. Assets Not Loading (404 errors)
- This happens if the base path is wrong
- **Fix:** Your `vite.config.js` should have:
  ```javascript
  base: '/snake-game-react/',
  ```
- The repository name MUST match exactly
- Rebuild and redeploy after fixing

### 2. **Manual Deployment (Fastest Fix)**

If GitHub Actions isn't working, use manual deployment:

```bash
# Step 1: Clean build
rm -rf dist
npm run build

# Step 2: Deploy using gh-pages
npm run deploy

# Step 3: Configure GitHub Pages
# Go to Settings → Pages
# Source: gh-pages branch, root folder
# Save
```

Wait 1-2 minutes, then refresh your browser.

### 3. **Browser Caching Issue**

If you previously visited the URL:
```bash
# Hard refresh to clear cache:
# Windows/Linux: Ctrl + Shift + Delete
# macOS: Cmd + Shift + Delete
```

Or visit in incognito/private mode.

### 4. **Verify Deployment Status**

**Check if files are deployed:**
1. Go to: `https://abhishek45654.github.io/snake-game-react/`
2. Open **Developer Tools** (F12 or Cmd+Option+I)
3. Go to **Console** tab
4. Look for errors:
   - Red errors = JavaScript issues
   - 404 errors = File not found (asset path problem)

**Check deployed files:**
- Visit: `https://abhishek45654.github.io/snake-game-react/assets/`
- Should show your JS and CSS files

### 5. **Repository Settings Checklist**

Make sure:
- ✅ Repository is **public** (not private)
- ✅ GitHub Pages is **enabled** in Settings
- ✅ Build source is set correctly
- ✅ Branch is set to `master` or `main`

### 6. **Full Reset & Redeploy**

If nothing works, do a complete redeploy:

```bash
# 1. Make sure you're on master branch
git checkout master

# 2. Pull latest changes
git pull origin master

# 3. Clean and rebuild
rm -rf dist node_modules
npm install
npm run build

# 4. Deploy
npm run deploy

# 5. Go to Settings → Pages and verify:
#    - Source: gh-pages branch
#    - Folder: root (/)
#    - Save

# 6. Wait 2-3 minutes and visit:
#    https://abhishek45654.github.io/snake-game-react/
```

### 7. **Check GitHub Actions Logs**

1. Go to repository **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click the latest run
4. Expand each step to see detailed logs
5. Look for errors in:
   - Install dependencies
   - Build project
   - Deploy to GitHub Pages

If you see red ❌ marks, click on that step to see what failed.

## 📋 Step-by-Step Fix

**If the page is still blank:**

```bash
# Step 1: Ensure everything is committed
git status

# Step 2: Full rebuild
npm run build

# Step 3: Deploy
npm run deploy

# Step 4: Wait 3 minutes

# Step 5: Visit the URL (hard refresh: Ctrl+Shift+Delete)
https://abhishek45654.github.io/snake-game-react/
```

## 🆘 Still Not Working?

If you've tried all steps above:

1. **Check:** Repository name matches base path
   - Repository: `classic-snake-game` or `snake-game-react`?
   - Base path: `/snake-game-react/`
   - They MUST match!

2. **Verify:** GitHub Actions workflow file exists
   - File: `.github/workflows/deploy.yml`
   - Should exist in your repository

3. **Confirm:** Personal Access Token
   - If using manual deployment, you may need:
     - GitHub PAT with `public_repo` scope
     - Or use HTTPS with username/password

## 📞 Need Help?

The most common fix is:
1. `npm run deploy`
2. Set GitHub Pages source to `gh-pages` branch
3. Wait 2-3 minutes
4. Hard refresh browser
5. Visit: `https://abhishek45654.github.io/snake-game-react/`

Your app should appear! 🎉
