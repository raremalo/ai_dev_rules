# Browser Test Landing Page Skill

- Last Updated: 2025-01-10
- Description: Fuehrt umfassende Landing-Page-Tests mit Claude in Chrome durch
- Version: 1.0
- Dependencies: [19-browser-testing], [06-screenshot-workflow], dismiss-popups.js, extract-selectors.js

## Kontext

Verwende diesen Skill wenn:
- Eine Landing Page auf visuelle Korrektheit geprueft werden soll
- SEO-Metadaten verifiziert werden muessen
- Screenshot-Vergleiche durchgefuehrt werden sollen
- Responsive Design getestet werden muss

## Voraussetzungen

- Claude in Chrome MCP konfiguriert und verbunden
- Ziel-URL erreichbar
- Optional: Referenz-Screenshots fuer Vergleich
- Scripts verfuegbar: `scripts/browser-testing/*.js`

## Workflow

### Schritt 1: Vorbereitung

```
1.1 Tab-Context laden
    tabs_context_mcp({ createIfEmpty: true })

1.2 Neuen Tab erstellen
    tabs_create_mcp()

1.3 Zu URL navigieren
    navigate({ url: "[TARGET_URL]", tabId: [TAB_ID] })

1.4 Warten auf Ladevorgang
    computer({ action: "wait", duration: 2, tabId: [TAB_ID] })
```

### Schritt 2: Pre-Scripts ausfuehren

```javascript
// 2.1 Pop-ups entfernen
javascript_tool({
  action: 'javascript_exec',
  text: `[INHALT VON dismiss-popups.js]`,
  tabId: [TAB_ID]
});
// Erwartetes Ergebnis: { dismissed: X, message: "..." }

// 2.2 Selektoren extrahieren
javascript_tool({
  action: 'javascript_exec',
  text: `[INHALT VON extract-selectors.js]`,
  tabId: [TAB_ID]
});
// Nutze Ergebnis fuer weitere Tests
```

### Schritt 3: Visual Tests

#### 3.1 Desktop-Screenshot

```
resize_window({ width: 1440, height: 900, tabId: [TAB_ID] })
computer({ action: "wait", duration: 1, tabId: [TAB_ID] })
computer({ action: "screenshot", tabId: [TAB_ID] })
```

#### 3.2 Tablet-Screenshot

```
resize_window({ width: 768, height: 1024, tabId: [TAB_ID] })
computer({ action: "wait", duration: 1, tabId: [TAB_ID] })
computer({ action: "screenshot", tabId: [TAB_ID] })
```

#### 3.3 Mobile-Screenshot

```
resize_window({ width: 375, height: 812, tabId: [TAB_ID] })
computer({ action: "wait", duration: 1, tabId: [TAB_ID] })
computer({ action: "screenshot", tabId: [TAB_ID] })
```

### Schritt 4: SEO Tests

Aus `extract-selectors.js` Ergebnis pruefen:

```yaml
SEO-Checkliste:
  Title:
    - vorhanden: result.meta.title !== null
    - laenge: 50-60 Zeichen optimal
    - aktuell: result.meta.titleLength

  Description:
    - vorhanden: result.meta.description !== null
    - laenge: 150-160 Zeichen optimal
    - aktuell: result.meta.descriptionLength

  H1:
    - anzahl: result.summary.h1Count === 1
    - text: result.headings.filter(h => h.level === 'H1')

  Struktur:
    - canonical: result.meta.canonical !== null
    - og:title: result.meta.ogTitle !== null
    - og:description: result.meta.ogDescription !== null
    - og:image: result.meta.ogImage !== null
```

### Schritt 5: Accessibility Quick-Check

```yaml
A11y-Checkliste:
  Lang-Attribut:
    - vorhanden: result.meta.lang !== null
    - wert: result.meta.lang

  Bilder:
    - gesamt: result.summary.imageCount
    - ohne_alt: result.summary.imagesWithoutAlt
    - quote: (gesamt - ohne_alt) / gesamt * 100

  Struktur:
    - header: result.summary.hasHeader
    - main: result.summary.hasMain
    - footer: result.summary.hasFooter
    - nav: result.summary.hasNav
```

### Schritt 6: Console-Errors pruefen

```
read_console_messages({
  tabId: [TAB_ID],
  onlyErrors: true,
  pattern: "error|Error|failed|Failed"
})
```

### Schritt 7: Report generieren

Erstelle Report nach `templates/testing/test-report.template.md`.

## Templates

### Test-Aufruf

```markdown
/test-landing-page https://example.com

Optionen:
  --viewport mobile          # Nur Mobile
  --viewport tablet          # Nur Tablet
  --viewport desktop         # Nur Desktop
  --viewport all             # Alle (Default)
  --skip-seo                 # SEO ueberspringen
  --skip-visual              # Visual ueberspringen
  --skip-a11y                # A11y ueberspringen
  --report markdown          # Markdown Report (Default)
  --report json              # JSON Report
```

### Ergebnis-Template

```markdown
## Landing Page Test: [URL]

**Datum:** [TIMESTAMP]
**Viewport:** [VIEWPORT]

### Visual Check
- [ ] Hero-Bereich korrekt dargestellt
- [ ] Navigation vollstaendig
- [ ] Footer sichtbar
- [ ] Keine visuellen Fehler

### SEO Check
| Metrik | Erwartet | Gefunden | Status |
|--------|----------|----------|--------|
| Title | 50-60 Zeichen | [X] | [PASS/FAIL] |
| Description | 150-160 Zeichen | [X] | [PASS/FAIL] |
| H1 Count | 1 | [X] | [PASS/FAIL] |
| Canonical | Vorhanden | [X] | [PASS/FAIL] |

### Accessibility
| Check | Status |
|-------|--------|
| Lang-Attribut | [PASS/FAIL] |
| Images mit Alt | [X]% |
| Semantic Structure | [PASS/FAIL] |

### Console Errors
[X] Errors gefunden / Keine Errors
```

## Beispiele

### Beispiel 1: Einfacher Landing Page Test

```
User: Teste die Landing Page von https://example.com

Claude:
1. Erstelle Tab und navigiere zu URL
2. Fuehre dismiss-popups.js aus -> 1 Cookie-Banner entfernt
3. Fuehre extract-selectors.js aus
4. Erstelle Screenshots (Desktop, Tablet, Mobile)
5. Pruefe SEO: Title OK (55 Zeichen), Description OK (152 Zeichen)
6. Pruefe A11y: Lang="de", 95% Images mit Alt
7. Console: Keine Errors

Report:
Landing Page Test BESTANDEN
- Visual: 3/3 Viewports OK
- SEO: 4/4 Checks bestanden
- A11y: 3/3 Checks bestanden
```

### Beispiel 2: Mit Fehlern

```
User: /test-landing-page https://broken-site.com --viewport desktop

Claude:
1. Erstelle Tab und navigiere zu URL
2. dismiss-popups.js: 0 Pop-ups gefunden
3. extract-selectors.js: Warnung - 3 H1-Tags gefunden
4. Screenshot erstellt

Report:
Landing Page Test FEHLGESCHLAGEN

Fehler:
1. [P2] SEO: 3 H1-Tags statt 1 (Zeilen: ...)
2. [P2] SEO: Description fehlt
3. [P3] A11y: 5 Bilder ohne Alt-Text

Empfehlungen:
1. H1-Tags auf einen reduzieren
2. Meta-Description hinzufuegen
3. Alt-Texte ergaenzen
```

## Anti-Patterns

### NIEMALS

```javascript
// Vollstaendigen DOM laden
read_page({ tabId: tabId })  // 50.000+ Tokens!

// Tests ohne Pop-up Dismissal
navigate({ url: "..." })
screenshot()  // Cookie-Banner im Bild!

// Alle Viewports ohne Pause
resize_window({ width: 375 })
screenshot()
resize_window({ width: 768 })  // Zu schnell!
screenshot()
```

### IMMER

```javascript
// Selektoren statt DOM
javascript_tool({ text: extractSelectorsScript })

// Pop-ups zuerst entfernen
javascript_tool({ text: dismissPopupsScript })
computer({ action: "wait", duration: 1 })
screenshot()

// Pause zwischen Viewport-Wechseln
resize_window({ width: 375 })
computer({ action: "wait", duration: 1 })
screenshot()
```

## Checkliste

- [ ] Tab-Context geladen?
- [ ] dismiss-popups.js ausgefuehrt?
- [ ] extract-selectors.js ausgefuehrt?
- [ ] Screenshots fuer alle Viewports?
- [ ] SEO-Metriken geprueft?
- [ ] A11y Quick-Check durchgefuehrt?
- [ ] Console auf Errors geprueft?
- [ ] Report generiert?
