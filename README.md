# Libertaria Blog

> Sovereign; Kinetic; Anti-Fragile.

**Domain:** libertaria.app  
**Source:** Local Git → Cloudflare Pages  
**Goal:** Static blog with markdown files, date-based sorting, hashtag categorization

---

## Requirements

- **Easy setup**: Throw markdown files with date in filename → site renders
- **Markdown**: Frontmatter support (YAML)
- **Date sorting**: Filename-based (`YYYY-MM-DD-slug.md`)
- **Hashtags**: Categorization via tags/categories
- **Hosting**: Cloudflare Pages (free tier)
- **Stack**: Astro (recommended) or Hugo

---

## Tech Stack Evaluation

See `research-report.html` for comprehensive analysis.

| Option | Recommendation | Status |
|--------|---------------|--------|
| **Astro** | ✅ Primary choice | Type-safe, modern, easy |
| **Hugo** | ✅ Alternative | Fastest, mature ecosystem |
| **Nimja + HappyX** | ⚠️ Research project | No blog examples found |
| **HTMX + picoCSS + Hmpl.js** | ❌ Incomplete | Missing content pipeline |
| **Hono + Marked** | ✅ Lightweight | ~300 lines, full control |

---

## Git Branching Strategy

```
main        → Production (libertaria.app)
unstable    → Staging/integration
lts/v*      → Long-term support versions
develop     → Active development
feature/*   → Feature branches
```

---

## File Naming Convention

```
content/
├── blog/
│   ├── 2024-01-15-hello-world.md
│   ├── 2024-02-03-libertaria-stack.md
│   └── 2024-03-10-gql-parser.md
└── pages/
    ├── about.md
    └── contact.md
```

Frontmatter example:
```yaml
---
title: "Hello World"
date: 2024-01-15
tags: ["intro", "libertaria"]
draft: false
---
```

---

## Deployment

**Cloudflare Pages:**
1. Connect Git repository
2. Build command: `npm run build`
3. Output directory: `dist/`
4. Automatic deployments on push

---

## Project Status

- [x] Tech stack research
- [ ] Initialize Astro project
- [ ] Set up Cloudflare Pages
- [ ] Design theme/layout
- [ ] First blog post

---

*Forge burns bright. The Exit is being built.*

⚡️
