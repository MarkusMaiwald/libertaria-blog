# Blog Design Merge - 2026-02-04

## Status
✅ Neues Design extrahiert und in `public/new-design/` kopiert
✅ Pfade aktualisiert (`/new-design/styles.css`, `/new-design/main.js`)

## Merge Ansatz

**Option gewählt:** Neues Design als **Landing Page**, Astro Blog bleibt für Posts

### Struktur:
```
public/
├── new-design/
│   ├── index.html      ← Landing Page (neues Design)
│   ├── styles.css      ← Neue Styles
│   └── main.js         ← Interaktivität
├── blog/               ← Astro-generierte Blog Posts
│   └── [...slug]/
│       └── index.html
└── index-landing.html  ← Kopie für manuellen Einsatz
```

### TODO für vollständigen Merge:

1. [ ] **Blog-Links aktualisieren**
   - In `public/new-design/index.html`: 
   - "Blog" Link → `/blog/` (statt `#blog`)
   - "View All Posts" → `/blog/`
   - Einzelne Post-Karten → Links zu tatsächlichen Astro Posts

2. [ ] **Astro index.astro ersetzen oder redirect**
   - Option A: `src/pages/index.astro` → Inhalt von new-design einbetten
   - Option B: Redirect auf `/new-design/index.html`
   - Option C: Beide parallel (Landing Page + Astro Home)

3. [ ] **Blog-Posts dynamisch verlinken**
   - Neue Design hat hardkodierte Posts
   - Sollte stattdessen Astro `getCollection('blog')` nutzen
   - Oder: Landing Page zeigt nur "Featured" Posts, Rest auf `/blog/`

4. [ ] **Assets optimieren**
   - Fonts (Inter + JetBrains Mono) → Preload?
   - Particle Canvas → Performance auf Mobile?
   - CSS → Minify für Production?

5. [ ] **Testen**
   - `npm run build`
   - `npm run preview`
   - Alle Links funktionieren?
   - Mobile Responsive?

## Empfohlene nächste Schritte (für Markus):

1. **Entscheiden:** Soll die Landing Page der neue "Home" sein?
   - JA → `src/pages/index.astro` ersetzen mit Redirect oder Inhalt
   - NEIN → Beide Designs parallel behalten

2. **Blog-Integration:** Sollen die hardkodierten Posts in der Landing Page:
   - A) Dynamisch aus Astro geladen werden?
   - B) Manuell aktualisiert werden?
   - C) Entfernt werden (nur Link zu `/blog/`)?

3. **Deployment:** Nach Merge:
   - `npm run build`
   - `dist.zip` erstellen
   - Zu Cloudflare deployen

## Aktueller Stand

- ✅ Design-Dateien vorhanden
- ✅ Pfade korrigiert
- ⏳ Integration mit Astro Blog ausstehend
- ⏳ Finaler Test ausstehend

## Dateien

- Quelle: `libertaria-enhanced/` (aus ZIP)
- Ziel: `public/new-design/`
- Backup: `public/index-landing.html`
