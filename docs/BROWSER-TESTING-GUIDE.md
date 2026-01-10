# Browser Testing Guide

Eine umfassende Anleitung fuer Browser-basierte Tests mit Claude in Chrome.

- Last Updated: 2025-01-10
- Version: 1.0

---

## Inhaltsverzeichnis

1. [Einfuehrung](#einfuehrung)
2. [Setup](#setup)
3. [Test-Typen](#test-typen)
4. [Slash-Commands](#slash-commands)
5. [Context Management](#context-management)
6. [JavaScript Utilities](#javascript-utilities)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Einfuehrung

Dieses Framework ermoeglicht automatisierte Browser-Tests fuer Landing Pages mit Claude in Chrome ueber das MCP-Protokoll. Es optimiert Token-Verbrauch, modularisiert lange E2E-Tests und generiert strukturierte Reports.

### Warum Browser-Testing mit Claude?

| Vorteil | Beschreibung |
|---------|--------------|
| **Visuell** | Claude kann Screenshots analysieren und vergleichen |
| **Kontextuell** | Versteht Seiten-Semantik, nicht nur DOM |
| **Flexibel** | Kann auf unerwartete Situationen reagieren |
| **Dokumentierend** | Generiert lesbare, strukturierte Reports |
| **Token-effizient** | Optimierte Extraktion statt DOM-Dump |

### Komponenten-Uebersicht

```
Browser Testing Framework
├── Regel 19-browser-testing.md    # Kernregeln
├── Skills
│   ├── browser-test-landing-page  # Haupt-Skill
│   ├── browser-test-guided        # Interaktiver Modus
│   ├── browser-test-seo           # SEO-fokussiert
│   ├── browser-test-visual        # Visual Regression
│   └── browser-test-accessibility # A11y Tests
├── Scripts
│   ├── dismiss-popups.js          # Pop-up Entfernung
│   ├── extract-selectors.js       # Selektoren-Extraktion
│   ├── full-page-screenshot.js    # Screenshot-Vorbereitung
│   └── page-metrics.js            # Performance-Metriken
└── Templates
    ├── test-documentation         # Testfall-Dokumentation
    └── test-report                # Report-Format
```

---

## Setup

### 1. MCP-Konfiguration pruefen

Stelle sicher, dass Claude in Chrome konfiguriert ist:

```json
{
  "mcpServers": {
    "claude-in-chrome": {
      "command": "...",
      "args": ["..."]
    }
  }
}
```

### 2. Verbindung testen

```
// In Claude:
tabs_context_mcp({ createIfEmpty: true })

// Erwartete Antwort:
{
  "availableTabs": [...],
  "tabGroupId": ...
}
```

### 3. Test-Scripts vorbereiten

Die JavaScript-Utilities befinden sich in `/scripts/browser-testing/`:

| Script | Zweck | Ausfuehren |
|--------|-------|------------|
| `dismiss-popups.js` | Cookie-Banner entfernen | Vor jedem Test |
| `extract-selectors.js` | DOM auf Selektoren reduzieren | Statt read_page |
| `full-page-screenshot.js` | Full-Page Screenshot vorbereiten | Bei Visual Tests |
| `page-metrics.js` | Performance/SEO Metrics | Bei SEO/Perf Tests |

### 4. CLAUDE.md erweitern

Fuege zu deiner Projekt-CLAUDE.md hinzu:

```markdown
## Browser Testing

### Pre-Scripts (IMMER vor Tests ausfuehren)
1. dismiss-popups.js - Cookie-Banner entfernen
2. extract-selectors.js - Selektoren extrahieren (statt read_page!)

### Context-Limits
WICHTIG: Bei grossen Seiten IMMER Selektoren verwenden!
- read_page: max depth=3
- find: bevorzugt fuer spezifische Elemente
- screenshot: fuer visuelle Analyse

### Test-Commands
- /test-landing-page URL - Standard Landing Page Test
- /test-guided URL - Interaktiver gefuehrter Test
- /test-seo URL - Nur SEO-Checks
```

---

## Test-Typen

### 1. Visual Tests

Pruefen das visuelle Erscheinungsbild der Seite.

**Checks:**
- [ ] Hero-Bereich korrekt dargestellt
- [ ] Navigation vollstaendig sichtbar
- [ ] Responsive Breakpoints funktionieren
- [ ] Keine visuellen Glitches

**Ausfuehrung:**
```
/test-visual https://example.com --viewport all

oder manuell:
1. Navigate zu URL
2. dismiss-popups.js ausfuehren
3. Desktop-Screenshot (1440px)
4. Tablet-Screenshot (768px)
5. Mobile-Screenshot (375px)
```

### 2. SEO Tests

Pruefen Suchmaschinen-Optimierung.

**Checks:**
- [ ] Title: 50-60 Zeichen
- [ ] Meta Description: 150-160 Zeichen
- [ ] Genau eine H1
- [ ] Alt-Tags auf Bildern
- [ ] Canonical-URL gesetzt
- [ ] Open Graph Tags vorhanden

**Ausfuehrung:**
```
/test-seo https://example.com

oder manuell mit extract-selectors.js:
result.meta.title           // Title pruefen
result.meta.description     // Description pruefen
result.summary.h1Count      // H1-Anzahl
result.meta.canonical       // Canonical
```

### 3. Accessibility Tests

Pruefen Barrierefreiheit (A11y Quick-Check).

**Checks:**
- [ ] Lang-Attribut gesetzt
- [ ] Skip-Link vorhanden
- [ ] Form-Inputs haben Labels
- [ ] Bilder haben Alt-Text
- [ ] Semantische Struktur (header, main, footer)

**Ausfuehrung:**
```
/test-a11y https://example.com

oder manuell:
result.meta.lang                    // Lang-Attribut
result.summary.imagesWithoutAlt     // Bilder ohne Alt
result.summary.hasHeader            // Semantic Header
result.summary.hasMain              // Semantic Main
result.summary.hasFooter            // Semantic Footer
```

### 4. Full Landing Page Test

Kombiniert alle Checks in einem Durchlauf.

**Ausfuehrung:**
```
/test-landing-page https://example.com

Ablauf:
1. Pop-up Dismissal
2. Visual Check (3 Viewports)
3. SEO Check
4. Accessibility Quick-Check
5. Console Error Check
6. Report generieren
```

---

## Slash-Commands

### /test-landing-page

Vollstaendiger Landing Page Test.

```
/test-landing-page [URL] [OPTIONS]

OPTIONS:
  --viewport [mobile|tablet|desktop|all]  Default: all
  --compare [reference-path]              Vergleiche mit Referenz
  --report [markdown|json]                Report-Format
  --skip-seo                              SEO-Tests ueberspringen
  --skip-visual                           Visual-Tests ueberspringen
  --skip-a11y                             A11y-Tests ueberspringen
  --output [path]                         Report-Speicherort

Beispiele:
  /test-landing-page https://example.com
  /test-landing-page https://example.com --viewport mobile
  /test-landing-page https://example.com --skip-seo --skip-a11y
```

### /test-guided

Interaktiver, gefuehrter Test mit Bestaetigung pro Schritt.

```
/test-guided [URL] [OPTIONS]

OPTIONS:
  --test-file [path]    Spezifische Test-Dokumentation laden
  --start-at [TC-XXX]   Ab bestimmtem Testfall starten
  --resume              Pausierte Session fortsetzen
  --verbose             Ausfuehrliche Ausgabe

Beispiele:
  /test-guided https://example.com
  /test-guided https://example.com --test-file tests/checkout.md
  /test-guided https://example.com --resume
```

### /test-seo

Nur SEO-spezifische Checks.

```
/test-seo [URL] [OPTIONS]

OPTIONS:
  --strict              Strikte Laengenpruefung
  --include-og          Open Graph pruefen
  --include-twitter     Twitter Cards pruefen

Beispiele:
  /test-seo https://example.com
  /test-seo https://example.com --strict
```

---

## Context Management

### Das Problem

Browser-DOM kann sehr gross sein. Ein vollstaendiges `read_page` kann:
- **50.000+ Tokens** verbrauchen
- Den Kontext ueberladen
- Die Antwortqualitaet reduzieren
- Lange Verarbeitungszeiten verursachen

### Die Loesung

**IMMER** Selektoren statt DOM verwenden!

```javascript
// SCHLECHT: Voller DOM-Dump
read_page({ tabId: 123 })  // 50.000+ Tokens!

// GUT: Selektoren extrahieren
javascript_tool({
  action: 'javascript_exec',
  text: extractSelectorsScript,
  tabId: 123
})  // Ca. 2.000 Tokens
```

### Wann welches Tool?

| Situation | Tool | Tokens | Wann verwenden |
|-----------|------|--------|----------------|
| Element finden | `find` | ~100 | Spezifisches Element suchen |
| Struktur verstehen | `extract-selectors.js` | ~2.000 | Seiten-Uebersicht |
| Spezifisches Element | `read_page` + `ref_id` | ~500 | Details eines Elements |
| Visueller Check | `screenshot` | ~0 | Layout pruefen |
| Metriken sammeln | `page-metrics.js` | ~1.000 | SEO/Performance |
| **VERMEIDEN** | `read_page` ohne Limit | 50.000+ | NIEMALS! |

### Token-Spar-Strategien

1. **Tiefe begrenzen:** `read_page({ depth: 3 })`
2. **Selektoren nutzen:** `extract-selectors.js` statt DOM
3. **Fokussieren:** `read_page({ ref_id: "ref_42" })`
4. **Screenshots:** Visuell statt textuell analysieren

---

## JavaScript Utilities

### dismiss-popups.js

Entfernt Cookie-Banner und Pop-ups automatisch.

**Funktionsweise:**
- Klickt auf gaengige Accept/OK-Buttons
- Entfernt fixed/sticky Overlays
- Reaktiviert Scrolling falls blockiert

**Unterstuetzte Plattformen:**
- OneTrust
- CookieConsent (cc)
- Cybot
- Generische GDPR/DSGVO Banner
- Newsletter Pop-ups
- Modal Close-Buttons

**Verwendung:**
```javascript
javascript_tool({
  action: 'javascript_exec',
  text: `[Inhalt von dismiss-popups.js]`,
  tabId: tabId
});

// Rueckgabe:
{
  success: true,
  dismissed: 2,
  message: "Dismissed 2 popup(s)/overlay(s)",
  details: [...]
}
```

### extract-selectors.js

Extrahiert Schluessel-Elemente als kompakte Selektoren.

**Extrahierte Informationen:**
- Meta-Tags (Title, Description, OG, etc.)
- Navigation-Links
- Headings (H1-H3)
- Buttons/CTAs
- Forms
- Images
- Page Sections
- Summary Statistics

**Verwendung:**
```javascript
javascript_tool({
  action: 'javascript_exec',
  text: `[Inhalt von extract-selectors.js]`,
  tabId: tabId
});

// Rueckgabe:
{
  meta: { title, description, canonical, ... },
  navigation: [...],
  headings: [...],
  buttons: [...],
  forms: [...],
  images: [...],
  sections: [...],
  summary: { h1Count, imageCount, ... }
}
```

### full-page-screenshot.js

Bereitet Full-Page Screenshots vor.

**Funktionsweise:**
- Berechnet Seiten-Dimensionen
- Identifiziert Key-Sections
- Liefert Scroll-Positionen
- Token-effiziente Strategie

**Verwendung:**
```javascript
javascript_tool({
  action: 'javascript_exec',
  text: `[Inhalt von full-page-screenshot.js]`,
  tabId: tabId
});

// Rueckgabe:
{
  page: { fullWidth, fullHeight, viewportWidth, viewportHeight },
  efficientStrategy: { recommended: [...], screenshotsNeeded: 6 },
  fullStrategy: { scrollPositions: [...], screenshotsNeeded: 12 },
  allSections: [...],
  workflow: [...]
}
```

---

## Best Practices

### 1. Tests modularisieren

Teile lange E2E-Tests in kuerzere Abschnitte (<5 min):

```markdown
SCHLECHT:
"Teste die komplette Seite von oben bis unten"

GUT:
- Test 1: Hero-Bereich (2 min)
- Test 2: Navigation (1 min)
- Test 3: Features-Bereich (2 min)
- Test 4: Footer (1 min)
```

### 2. Pop-ups immer zuerst entfernen

```javascript
// Immer als erstes nach Navigation:
await javascript_tool({
  action: 'javascript_exec',
  text: dismissPopupsScript,
  tabId: tabId
});

// Dann erst testen
```

### 3. Screenshots fuer Dokumentation

Nach jedem visuellen Test:
1. Screenshot erstellen
2. Mit Referenz vergleichen (falls vorhanden)
3. Bei Abweichung: Dokumentieren

### 4. Reports generieren

Jeder Test sollte einen Report erzeugen:
- Verwende `templates/testing/test-report.template.md`
- Executive Summary fuer schnellen Ueberblick
- Detaillierte Ergebnisse pro Kategorie
- Priorisierte Empfehlungen

### 5. Viewport-Wechsel mit Pause

```javascript
// Zwischen Viewport-Wechseln warten:
resize_window({ width: 375, height: 812, tabId });
computer({ action: "wait", duration: 1, tabId });
computer({ action: "screenshot", tabId });
```

### 6. Console-Errors pruefen

```javascript
read_console_messages({
  tabId: tabId,
  onlyErrors: true,
  pattern: "error|Error|failed|Failed"
});
```

---

## Troubleshooting

### Problem: Zu viele Tokens verbraucht

**Symptome:**
- Context-Warnungen
- Langsame Antworten
- Abgebrochene Operationen

**Loesung:**
1. Verwende `extract-selectors.js` statt `read_page`
2. Begrenze `read_page` depth auf 2-3
3. Nutze `find` fuer spezifische Elemente
4. Verwende Screenshots statt DOM-Analyse

### Problem: Pop-ups blockieren Tests

**Symptome:**
- Cookie-Banner im Screenshot
- Interaktion nicht moeglich
- Overlay verdeckt Inhalt

**Loesung:**
1. Fuehre `dismiss-popups.js` aus
2. Falls unzureichend: Selektoren-Liste in Script erweitern
3. Fallback: `computer` Tool fuer manuelle Klicks
4. Warte nach Dismissal kurz (`wait: 1`)

### Problem: Responsive Tests fehlerhaft

**Symptome:**
- Layout nicht angepasst
- Falsche Viewport-Groesse
- Mobile-Navigation nicht sichtbar

**Loesung:**
1. Verwende `resize_window` vor Screenshot
2. Warte auf Layout-Stabilisierung (1-2s)
3. Pruefe auf CSS-Media-Query Konflikte
4. Teste in korrekter Reihenfolge: Desktop -> Tablet -> Mobile

### Problem: Tests zu langsam

**Symptome:**
- Timeouts
- Extension-Fehler
- Abgebrochene Sessions

**Loesung:**
1. Tests in Module aufteilen (<5 min)
2. Parallelisiere unabhaengige Tests
3. Verwende `--skip-*` Flags fuer nicht-kritische Tests
4. Reduziere Viewport-Varianten auf kritische

### Problem: Chrome-Profile falsch geoeffnet

**Symptome:**
- Falsches Profil aktiv
- Extensions fehlen
- Login-Status verloren

**Loesung:**
1. Neuen Tab in Default-Profile verwenden
2. `tabs_context_mcp({ createIfEmpty: true })` nutzen
3. Session in neuem Fenster starten

### Problem: Tab nicht gefunden

**Symptome:**
- "Tab doesn't exist" Fehler
- Invalid tab ID

**Loesung:**
1. `tabs_context_mcp()` ausfuehren
2. Verfuegbare Tabs pruefen
3. Neuen Tab erstellen: `tabs_create_mcp()`

---

## Anhang

### Viewport-Breakpoints

| Name | Breite | Hoehe | Typische Geraete |
|------|--------|-------|------------------|
| Mobile | 375px | 812px | iPhone, Android |
| Tablet | 768px | 1024px | iPad, Tablets |
| Desktop | 1440px | 900px | Laptops, Desktops |
| Large | 1920px | 1080px | Grosse Monitore |

### SEO-Richtwerte

| Metrik | Optimal | Minimum | Maximum |
|--------|---------|---------|---------|
| Title Laenge | 55-60 | 30 | 60 |
| Description Laenge | 150-160 | 120 | 160 |
| H1 Anzahl | 1 | 1 | 1 |
| Alt-Text Coverage | 100% | 90% | - |

### Referenz-Dateien

| Typ | Pfad |
|-----|------|
| Regel | `rules/19-browser-testing.md` |
| Landing Page Skill | `skills/testing/browser-test-landing-page.md` |
| Guided Test Skill | `skills/testing/browser-test-guided.md` |
| Dismiss Script | `scripts/browser-testing/dismiss-popups.js` |
| Selectors Script | `scripts/browser-testing/extract-selectors.js` |
| Screenshot Script | `scripts/browser-testing/full-page-screenshot.js` |
| Test Template | `templates/testing/test-documentation.template.md` |
| Report Template | `templates/testing/test-report.template.md` |
