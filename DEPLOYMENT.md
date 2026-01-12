# Snake Game React - GitHub Pages Deployment Guide

## Overview
This Snake game is configured for automatic deployment to GitHub Pages using GitHub Actions.

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)
The app automatically deploys to GitHub Pages whenever you push to the `master` or `main` branch.

**Setup Steps:**
1. Ensure your repository is pushed to GitHub
2. Go to your repository **Settings → Pages**
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
   - Click Save

That's it! The workflow will automatically deploy on every push.

### Method 2: Manual Deployment with gh-pages
If you prefer to deploy manually:

```bash
npm run deploy
```

This command:
1. Builds the project: `npm run build`
2. Deploys the dist folder to the gh-pages branch

**Setup Steps:**
1. Ensure your local repo is connected: `git remote -v`
2. Run the deploy command above
3. Go to repository **Settings → Pages**
4. Select source: `gh-pages` branch, `root` folder
5. Click Save

## Important Configuration Files

### vite.config.js
- **base path**: `/snake-game-react/` - Set to your repository name for correct asset loading

### package.json
- **scripts.deploy**: `npm run build && gh-pages -d dist`
- **devDependencies**: Added `gh-pages` for deployment

### .github/workflows/deploy.yml
- Automated workflow that triggers on push to master/main
- Builds the project
- Deploys to GitHub Pages automatically

## Access Your Deployed App
After deployment, your app will be available at:
```
https://<username>.github.io/snake-game-react/
```

## Troubleshooting

### Assets not loading (404 errors)
- Verify the `base` path in `vite.config.js` matches your repository name
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)

### Deployment not triggering
- Check the "Actions" tab in your GitHub repository
- Verify the workflow file exists at `.github/workflows/deploy.yml`
- Ensure you have push access to the repository

### Manual deploy fails
- Ensure gh-pages is installed: `npm install gh-pages --save-dev`
- Check you have git configured: `git config user.name` and `git config user.email`
- Verify you have GitHub credentials configured

## Local Preview
To preview the production build locally:
```bash
npm run preview
```

This serves the dist folder on localhost to verify everything works as expected.

## What Gets Deployed
Only the contents of the `dist/` folder are deployed. This includes:
- Compiled HTML (index.html)
- Bundled JavaScript
- CSS styles
- Asset files

The source code in `src/` is not deployed, only the built artifacts.
