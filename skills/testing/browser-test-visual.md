# Browser Test Visual Skill

- Last Updated: 2025-01-10
- Description: Fuehrt visuelle Tests und Screenshot-Vergleiche mit Claude in Chrome durch
- Version: 1.0
- Dependencies: [19-browser-testing], [06-screenshot-workflow], full-page-screenshot.js

## Kontext

Verwende diesen Skill wenn:
- Visuelle Darstellung einer Seite geprueft werden soll
- Responsive Design getestet werden muss
- Screenshot-Vergleiche durchgefuehrt werden sollen
- Layout-Probleme identifiziert werden muessen

## Voraussetzungen

- Claude in Chrome MCP verbunden
- Ziel-URL erreichbar
- Optional: Referenz-Screenshots fuer Vergleich
- Scripts: `dismiss-popups.js`, `full-page-screenshot.js`

## Workflow

### Schritt 1: Seite vorbereiten

```
1. tabs_context_mcp({ createIfEmpty: true })
2. tabs_create_mcp()
3. navigate({ url: "[URL]", tabId: [TAB_ID] })
4. computer({ action: "wait", duration: 2, tabId: [TAB_ID] })
5. javascript_tool({ text: dismissPopupsScript, tabId: [TAB_ID] })
```

### Schritt 2: Viewport konfigurieren

```javascript
// Desktop (Standard)
resize_window({ width: 1440, height: 900, tabId: tabId });

// Tablet
resize_window({ width: 768, height: 1024, tabId: tabId });

// Mobile
resize_window({ width: 375, height: 812, tabId: tabId });
```

### Schritt 3: Screenshots erstellen

#### Option A: Viewport-Screenshots

```javascript
// Desktop
resize_window({ width: 1440, height: 900, tabId: tabId });
computer({ action: "wait", duration: 1, tabId: tabId });
computer({ action: "screenshot", tabId: tabId });
// -> Speichern als desktop.png

// Tablet
resize_window({ width: 768, height: 1024, tabId: tabId });
computer({ action: "wait", duration: 1, tabId: tabId });
computer({ action: "screenshot", tabId: tabId });
// -> Speichern als tablet.png

// Mobile
resize_window({ width: 375, height: 812, tabId: tabId });
computer({ action: "wait", duration: 1, tabId: tabId });
computer({ action: "screenshot", tabId: tabId });
// -> Speichern als mobile.png
```

#### Option B: Section-Screenshots (Token-effizient)

```javascript
// 1. Sections identifizieren
javascript_tool({ text: fullPageScreenshotScript, tabId: tabId });
// -> Erhaelt efficientStrategy.recommended

// 2. Pro Section scrollen und screenshoten
for (section of sections) {
  computer({
    action: "scroll",
    scroll_direction: "down",
    scroll_amount: section.scrollY / 100,
    tabId: tabId
  });
  computer({ action: "wait", duration: 0.5, tabId: tabId });
  computer({ action: "screenshot", tabId: tabId });
}
```

#### Option C: Zoom fuer Details

```javascript
// Bestimmten Bereich vergroessern
computer({
  action: "zoom",
  region: [100, 200, 500, 400],  // [x0, y0, x1, y1]
  tabId: tabId
});
```

### Schritt 4: Visuelle Analyse

Fuer jeden Screenshot pruefen:

```yaml
Hero-Bereich:
  - [ ] Headline sichtbar und lesbar
  - [ ] Hintergrundbild/Video geladen
  - [ ] CTA-Button sichtbar
  - [ ] Spacing korrekt

Navigation:
  - [ ] Logo sichtbar
  - [ ] Menu-Items lesbar
  - [ ] Hamburger-Menu (Mobile)
  - [ ] Aktiver Link markiert

Content:
  - [ ] Text nicht abgeschnitten
  - [ ] Bilder geladen
  - [ ] Korrekte Ausrichtung
  - [ ] Keine Ueberlappungen

Footer:
  - [ ] Vollstaendig sichtbar
  - [ ] Links funktional
  - [ ] Copyright aktuell
```

### Schritt 5: Vergleich mit Referenz (optional)

```markdown
Vergleichsmethode:
1. Referenz-Screenshot laden
2. Aktuellen Screenshot erstellen
3. Visuell vergleichen:
   - Layout-Unterschiede
   - Farb-Abweichungen
   - Element-Verschiebungen
   - Fehlende Elemente
```

### Schritt 6: Report erstellen

```markdown
## Visual Test Report: [URL]

### Viewport: Desktop (1440x900)
- Screenshot: [Link/ID]
- Status: [PASS/FAIL]
- Issues: [Liste]

### Viewport: Tablet (768x1024)
- Screenshot: [Link/ID]
- Status: [PASS/FAIL]
- Issues: [Liste]

### Viewport: Mobile (375x812)
- Screenshot: [Link/ID]
- Status: [PASS/FAIL]
- Issues: [Liste]

### Zusammenfassung
- Gesamt: X/3 bestanden
- Kritische Issues: [Liste]
```

## Templates

### Slash-Command

```
/test-visual [URL] [OPTIONS]

OPTIONS:
  --viewport [mobile|tablet|desktop|all]  Default: all
  --compare [reference-path]              Vergleiche mit Referenz
  --sections                              Nur Key-Sections screenshoten
  --full-page                             Komplette Seite (mehr Screenshots)
  --output [path]                         Speicherort fuer Screenshots

Beispiele:
  /test-visual https://example.com
  /test-visual https://example.com --viewport mobile
  /test-visual https://example.com --compare ./reference/
```

### Ergebnis-Template

```markdown
## Visual Test: [URL]

**Datum:** [TIMESTAMP]
**Viewports getestet:** Desktop, Tablet, Mobile

### Desktop (1440x900)

**Screenshot:** [Image ID]

**Checks:**
- [x] Hero: Headline sichtbar
- [x] Hero: CTA-Button prominent
- [x] Navigation: Alle Links sichtbar
- [x] Footer: Copyright korrekt
- [ ] Issue: Bild nicht geladen (Section 3)

### Tablet (768x1024)

**Screenshot:** [Image ID]

**Checks:**
- [x] Layout angepasst
- [x] Navigation: Hamburger-Menu
- [x] Content: Zweispaltig
- [x] Keine Ueberlappungen

### Mobile (375x812)

**Screenshot:** [Image ID]

**Checks:**
- [x] Einspaltig
- [x] Touch-Targets gross genug
- [x] Text lesbar (Schriftgroesse)
- [ ] Issue: CTA zu nah am Rand

### Issues

| # | Viewport | Schweregrad | Beschreibung |
|---|----------|-------------|--------------|
| 1 | Desktop | Mittel | Bild in Section 3 nicht geladen |
| 2 | Mobile | Niedrig | CTA Button Padding zu klein |
```

## Beispiele

### Beispiel 1: Quick Visual Check

```
User: /test-visual https://example.com --viewport desktop

Claude:
1. Navigiere zu example.com
2. dismiss-popups.js -> 1 Banner entfernt
3. resize_window(1440, 900)
4. Screenshot erstellt

Analyse:
- Hero: OK - Headline "Welcome" sichtbar
- Navigation: OK - 5 Links sichtbar
- Content: OK - Bilder geladen
- Footer: OK - Copyright 2025

Status: BESTANDEN
Screenshot-ID: ss_abc123
```

### Beispiel 2: Responsive Test

```
User: /test-visual https://shop.example.com --viewport all

Claude:
Teste 3 Viewports...

Desktop (1440x900):
- Screenshot: ss_001
- Status: OK

Tablet (768x1024):
- Screenshot: ss_002
- Status: WARNING
- Issue: Produktkarten ueberlappen leicht

Mobile (375x812):
- Screenshot: ss_003
- Status: OK
- Navigation wechselt zu Hamburger-Menu

Zusammenfassung: 2/3 OK, 1 Warning
Empfehlung: Produktkarten-Grid fuer Tablet pruefen
```

### Beispiel 3: Section-fokussiert

```
User: /test-visual https://example.com --sections

Claude:
1. full-page-screenshot.js ausfuehren
2. Gefundene Sections: header, hero, features, testimonials, footer

Section-Screenshots:
1. Header/Nav - OK
2. Hero - OK
3. Features - OK
4. Testimonials - WARNING (Bild fehlt)
5. Footer - OK

Token-Verbrauch: 5 Screenshots statt Full-Page (12 Segments)
```

## Anti-Patterns

### NIEMALS

```javascript
// Screenshots ohne Wartezeit
resize_window({ width: 375 });
screenshot();  // Layout noch nicht stabil!

// Zu viele Full-Page Screenshots
for (viewport of [375, 768, 1024, 1280, 1440, 1920]) {
  // 6 komplette Full-Page Scans = Token-Verschwendung
}
```

### IMMER

```javascript
// Mit Wartezeit
resize_window({ width: 375, height: 812, tabId });
computer({ action: "wait", duration: 1, tabId });
computer({ action: "screenshot", tabId });

// Token-effizient
// Nutze --sections fuer gezielte Checks
// Nutze --viewport [specific] statt all wenn moeglich
```

## Checkliste

- [ ] Pop-ups entfernt vor Screenshots?
- [ ] Wartezeit zwischen Viewport-Wechseln?
- [ ] Alle kritischen Viewports getestet?
- [ ] Hero-Bereich geprueft?
- [ ] Navigation geprueft (inkl. Mobile)?
- [ ] Content-Bereiche geprueft?
- [ ] Footer geprueft?
- [ ] Screenshots gespeichert/dokumentiert?
- [ ] Issues mit Schweregrad erfasst?
