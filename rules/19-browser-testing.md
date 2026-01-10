# Browser Testing

- Last Updated: 2025-01-10
- Description: Regeln fuer Browser-basierte Tests mit Claude in Chrome MCP
- Version: 1.0

## Kernprinzip

Browser-Tests sind **modular**, **kontext-effizient** und **reproduzierbar**. Verwende Selektoren statt vollstaendigem DOM, teile E2E-Tests in kuerzere Abschnitte, und dokumentiere jeden Test strukturiert.

---

## Test-Pyramide fuer Landing Pages

```
        ╱╲
       ╱  ╲   Visual Tests (Hero, Layout, Responsive)
      ╱────╲
     ╱      ╲  SEO Tests (Meta, Struktur, Links)
    ╱────────╲
   ╱          ╲ Accessibility Tests (A11y Quick-Check)
  ╱────────────╲
 ╱              ╲ Performance (Metriken, Ladezeiten)
╱────────────────╲
```

### Prioritaeten

| Prio | Kategorie | Tests |
|------|-----------|-------|
| P1 | Visual | Hero-Bereich, Navigation, Footer, Responsive |
| P2 | SEO | Title, Description, H1, Canonical, OG-Tags |
| P2 | Accessibility | Lang-Attribut, Alt-Tags, Form-Labels |
| P3 | Performance | Ladezeit, Bildoptimierung, Console-Errors |

---

## Context Management (Token-Sparen)

### WICHTIG: Selector-Strategie

**NIEMALS** den vollstaendigen DOM laden!

**IMMER** eine dieser Optionen verwenden:

| Situation | Tool | Tokens |
|-----------|------|--------|
| Struktur verstehen | `extract-selectors.js` | ~2.000 |
| Element finden | `find` Tool | ~100 |
| Spezifisches Element | `read_page` mit `ref_id` | ~500 |
| Visueller Check | `screenshot` | ~0 (Bild) |
| **VERMEIDEN** | `read_page` ohne Limit | 50.000+ |

### Pre-Script Workflow

```javascript
// IMMER vor Tests ausfuehren:

// 1. Pop-ups entfernen
javascript_tool({
  action: 'javascript_exec',
  text: dismissPopupsScript,  // scripts/browser-testing/dismiss-popups.js
  tabId: tabId
});

// 2. Selektoren extrahieren (statt read_page)
javascript_tool({
  action: 'javascript_exec',
  text: extractSelectorsScript,  // scripts/browser-testing/extract-selectors.js
  tabId: tabId
});
```

---

## Pop-up Handling

### Standardvorgehen

1. **Vor jedem Test**: `dismiss-popups.js` ausfuehren
2. **Falls unzureichend**: Selektoren-Liste erweitern
3. **Fallback**: `computer` Tool fuer manuelle Klicks

### Cookie-Banner Selektoren (enthalten in dismiss-popups.js)

- OneTrust: `#onetrust-accept-btn-handler`
- CookieConsent: `.cc-accept`, `.cc-dismiss`
- DSGVO: `[class*="gdpr"]`, `[class*="dsgvo"]`
- Generisch: `[aria-label*="Accept"]`, `[aria-label*="Akzeptieren"]`

---

## Modulare Test-Aufteilung

### NIEMALS

```
"Teste die komplette Seite von oben bis unten in einem Durchgang"
```

### IMMER

```
Test 1: Hero-Bereich (Visual + Content)
Test 2: Navigation (Links + Responsive)
Test 3: Content-Sections (Struktur + SEO)
Test 4: Footer (Links + Rechtliches)
```

### Zeitlimits

| Test-Typ | Max. Dauer | Aktion bei Timeout |
|----------|------------|-------------------|
| Visual Check | 2 min | Zwischen-Report, Pause |
| SEO Check | 1 min | Report generieren |
| Full Page | 5 min | In Module aufteilen |

---

## Slash-Commands

### /test-landing-page

```
/test-landing-page [URL] [OPTIONS]

OPTIONS:
  --viewport [mobile|tablet|desktop|all]  Default: all
  --compare [reference-path]              Vergleiche mit Referenz
  --report [markdown|json]                Report-Format
  --skip-seo                              SEO-Tests ueberspringen
  --skip-visual                           Visual-Tests ueberspringen
```

### /test-guided

```
/test-guided [URL] [OPTIONS]

OPTIONS:
  --test-file [path]    Spezifische Test-Dokumentation
  --start-at [TC-XXX]   Ab bestimmtem Testfall starten
  --resume              Pausierte Session fortsetzen
  --verbose             Ausfuehrliche Ausgabe
```

### /test-seo

```
/test-seo [URL]

Checks:
- Title: 50-60 Zeichen
- Description: 150-160 Zeichen
- H1: Genau eine
- Canonical: Vorhanden
- OG-Tags: Vollstaendig
```

---

## Session-Lifecycle

### Start

```
1. tabs_context_mcp          → Tab-Kontext laden
2. tabs_create_mcp           → Neuen Tab erstellen
3. navigate URL              → Zu Ziel-URL navigieren
4. dismiss-popups.js         → Pop-ups entfernen
5. extract-selectors.js      → Selektoren extrahieren
```

### Waehrend Test

```
6. Modular testen            → Ein Bereich nach dem anderen
7. Screenshots speichern     → Fuer Dokumentation
8. Zwischen-Reports          → Bei langen Tests
```

### Ende

```
9. Final-Report generieren   → Strukturierter Report
10. Screenshots sichern      → In Dokumentation
11. Tab offen/schliessen     → Nach Bedarf
```

---

## Report-Generierung

### Nach jedem Test

Verwende `templates/testing/test-report.template.md`:

```markdown
# Test-Report: [Page Name]

## Executive Summary
- Gesamt: X Tests
- Bestanden: X (X%)
- Fehlgeschlagen: X

## Detaillierte Ergebnisse
[Pro Kategorie]

## Screenshots
[Referenzen]

## Empfehlungen
[Priorisierte Fixes]
```

---

## Viewport-Breakpoints

| Name | Breite | Typische Geraete |
|------|--------|------------------|
| Mobile | 375px | iPhone, Android |
| Tablet | 768px | iPad, Tablets |
| Desktop | 1440px | Laptops, Desktops |

### Responsive Test-Workflow

```
1. resize_window(375, 812)   → Mobile
2. screenshot               → Mobile-Screenshot
3. resize_window(768, 1024)  → Tablet
4. screenshot               → Tablet-Screenshot
5. resize_window(1440, 900)  → Desktop
6. screenshot               → Desktop-Screenshot
```

---

## Bekannte Einschraenkungen

### Chrome-Profile Bug

- Profile werden manchmal falsch geoeffnet
- **Workaround**: Neuen Tab in Default-Profile verwenden

### Console-Logs

- Nutze `read_console_messages` fuer Fehler-Erkennung
- **Pattern**: `pattern: "error|warning|Error|Warning"`

### Manifest-Timeouts

- Lange Tests koennen zu Extension-Timeouts fuehren
- **Loesung**: Tests in <5 min Module aufteilen

---

## Checkliste

- [ ] Pre-Scripts ausgefuehrt (dismiss-popups, extract-selectors)?
- [ ] Selektoren statt DOM verwendet?
- [ ] Test modular aufgeteilt (<5 min)?
- [ ] Screenshots fuer Dokumentation gespeichert?
- [ ] Report generiert?
- [ ] Viewport-Varianten getestet (bei Responsive)?
- [ ] Console auf Errors geprueft?

---

## Referenzen

- **Skills**: `skills/testing/browser-test-*.md`
- **Scripts**: `scripts/browser-testing/*.js`
- **Templates**: `templates/testing/*.template.md`
- **Guide**: `docs/BROWSER-TESTING-GUIDE.md`
