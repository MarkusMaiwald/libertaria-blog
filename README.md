# Libertaria Blog

> Sovereign; Kinetic; Anti-Fragile.

[![Astro](https://img.shields.io/badge/Astro-4.x-orange.svg)](https://astro.build)
[![Cloudflare](https://img.shields.io/badge/Cloudflare%20Pages-ready-f38020)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/license-MIT%20%2B%20Commons%20Clause-blue)](LICENSE)

**Live:** [libertaria.app](https://libertaria.app)  
**Stack:** Astro + Cloudflare Pages  
**Design:** Libertaria Color System (Dark/Light modes)

---

## Design Philosophy

**Dark Mode:** Black (#050505) + Silver (#c0c0c0) + Gold glow accent  
**Light Mode:** White (#ffffff) + Black (#0a0a0a) + Red glow accent

Hover effects use CSS text-shadow for subtle glow:
- Dark: `text-shadow: 0 0 20px rgba(234, 179, 8, 0.3)`
- Light: `text-shadow: 0 0 20px rgba(220, 38, 38, 0.3)`

---

## Features

- ✅ **Markdown-based**: Write posts in `.md` files
- ✅ **Date-based filenames**: `YYYY-MM-DD-slug.md` format
- ✅ **Automatic sorting**: Posts sorted by filename date
- ✅ **Tags support**: Categorize posts with frontmatter tags
- ✅ **Draft mode**: Hide unfinished posts with `draft: true`
- ✅ **RSS feed**: Auto-generated at `/rss.xml`
- ✅ **Sitemap**: Auto-generated for SEO
- ✅ **Cloudflare-ready**: Static output optimized for Cloudflare Pages

---

## Quick Start

### 1. Development

```bash
npm install
npm run dev
```

### 2. Create a new post

```bash
# Create file: src/content/blog/2024-02-03-my-post.md
---
title: 'My Post Title'
description: 'Brief description'
tags: ['libertaria', 'tech']
draft: false
---

Your content here...
```

### 3. Build

```bash
npm run build
# Output: dist/
```

---

## File Naming Convention

```
src/content/blog/
├── 2024-01-15-hello-world.md
├── 2024-02-03-libertaria-stack.md
└── 2024-03-10-gql-parser.md
```

**Format:** `YYYY-MM-DD-slug.md`

- Date is extracted from filename for sorting
- Slug becomes the URL: `/blog/2024-01-15-hello-world/`
- Fallback to frontmatter `pubDate` if filename has no date

---

## Frontmatter Schema

```yaml
---
title: string           # Required
description: string     # Required
pubDate: date          # Optional (fallback to filename)
updatedDate: date      # Optional
heroImage: string      # Optional (path to image)
tags: string[]         # Optional (array of tags)
draft: boolean         # Optional (default: false)
---
```

---

## Deployment

### Cloudflare Pages

1. Connect Git repository to Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy!

---

## Git Branches

```
main        → Production (libertaria.app)
develop     → Active development (current)
unstable    → Integration/testing
lts/v*      → Long-term support
```

---

## Tech Stack Research

See `docs/research-report.html` for comprehensive analysis of:
- Astro vs Hugo vs Nim-based solutions
- Cloudflare Pages vs Workers
- HTMX + picoCSS evaluation

---

*Forge burns bright. The Exit is being built.*

⚡️
