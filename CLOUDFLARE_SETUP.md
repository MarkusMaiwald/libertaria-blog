# Cloudflare Pages Setup — Step by Step

## Voraussetzungen
- Cloudflare Account (kostenlos)
- Domain libertaria.app (bei Cloudflare oder extern)

---

## Schritt 1: Pages Projekt erstellen

1. https://dash.cloudflare.com → **Pages** → **Create a project**
2. **Connect to Git**
3. GitHub autorisieren
4. Repository wählen: `MarkusMaiwald/libertaria-blog`

---

## Schritt 2: Build-Einstellungen

| Setting | Value |
|---------|-------|
| Framework | Astro |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment Variables:**
```
NODE_VERSION = 20
```

---

## Schritt 3: Deploy

1. **Save and Deploy** klicken
2. Warten (~2 Min)
3. URL erhalten: `xxx.pages.dev`

---

## Schritt 4: Custom Domain (libertaria.app)

1. **Custom domains** Tab
2. **Set up a custom domain**
3. Domain: `libertaria.app`

### DNS-Records:

**Falls Domain bei Cloudflare:**
- Auto-konfiguriert

**Falls Domain extern:**
```
Type: CNAME
Name: libertaria.app
Target: xxx.pages.dev
```

---

## Schritt 5: SSL/TLS

1. **SSL/TLS** → **Overview**
2. Mode: **Full (strict)**

---

## Schritt 6: GitHub Secrets (für Auto-Deploy)

Repository → Settings → Secrets → Actions:

```
CLOUDFLARE_ACCOUNT_ID = (aus Dashboard, rechts unten)
CLOUDFLARE_API_TOKEN = (unter Profile → API Tokens → Create)
```

### API Token erstellen:
1. https://dash.cloudflare.com/profile/api-tokens
2. **Create Token**
3. **Custom token**
4. Permissions:
   - `Cloudflare Pages:Edit`
   - `Zone:Read`

---

## Fertig!

Blog live unter: `https://libertaria.app`

Auto-Deploy bei jedem Push zu `main`.

⚡️
