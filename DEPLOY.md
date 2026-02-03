# Cloudflare Pages Deployment Guide

> Deploy libertaria.blog to the edge

## Prerequisites

- Cloudflare account (free tier works)
- GitHub repository connected
- Domain: libertaria.app (optional, can use *.pages.dev)

---

## Step 1: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Authorize Cloudflare to access GitHub
5. Select repository: `MarkusMaiwald/libertaria-blog`

---

## Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Framework preset** | Astro |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |

### Environment Variables (optional)

```
NODE_VERSION = 20
```

---

## Step 3: Deploy

1. Click **Save and Deploy**
2. Wait for build (~1-2 minutes)
3. Get your `.pages.dev` URL

---

## Step 4: Custom Domain (libertaria.app)

1. Go to **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `libertaria.app`
4. Follow DNS configuration:
   - Add CNAME record: `libertaria.app` → `your-project.pages.dev`
   - Or use Cloudflare nameservers for full proxy

---

## Step 5: GitHub Secrets (for Actions)

Add these secrets to your GitHub repository:

```bash
# In GitHub repo → Settings → Secrets and variables → Actions

CLOUDFLARE_ACCOUNT_ID = your-account-id
CLOUDFLARE_API_TOKEN = your-api-token
```

### Create API Token:

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Custom token**
4. Permissions:
   - `Cloudflare Pages:Edit`
   - `Zone:Read` (if using custom domain)
5. Include: Your account + zone

---

## Automatic Deployment

The GitHub Action triggers on:
- Push to `main` → Production deploy
- Push to `unstable` → Preview deploy
- Pull request → Preview deploy

---

## Verify Deployment

```bash
# Check build status
curl -I https://libertaria.app

# Check RSS feed
curl https://libertaria.app/rss.xml

# Check sitemap
curl https://libertaria.app/sitemap-index.xml
```

---

## Troubleshooting

### Build fails
```bash
# Check build locally
npm ci
npm run build
```

### Custom domain not working
- DNS propagation can take 24-48 hours
- Check SSL/TLS encryption mode: **Full (strict)**

### Assets not loading
- Check `astro.config.mjs` base URL
- Verify `dist/` contains all files

---

## Post-Deployment Checklist

- [ ] Site loads at `https://libertaria.app`
- [ ] Dark/Light mode toggle works
- [ ] Blog posts display correctly
- [ ] RSS feed accessible
- [ ] Sitemap generated
- [ ] Custom domain SSL working
- [ ] GitHub Actions passing

---

*Forge burns bright. The Exit is live.*

⚡️
