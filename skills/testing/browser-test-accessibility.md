# Browser Test Accessibility Skill

- Last Updated: 2025-01-10
- Description: Fuehrt Accessibility-Tests (A11y) mit Claude in Chrome durch
- Version: 1.0
- Dependencies: [19-browser-testing], extract-selectors.js, page-metrics.js

## Kontext

Verwende diesen Skill wenn:
- Barrierefreiheit einer Seite geprueft werden soll
- WCAG-Konformitaet verifiziert werden muss
- Tastaturnavigation getestet werden soll
- Screen-Reader-Kompatibilitaet evaluiert werden soll

## Voraussetzungen

- Claude in Chrome MCP verbunden
- Ziel-URL erreichbar
- Scripts: `extract-selectors.js`, `page-metrics.js`

## Workflow

### Schritt 1: Seite vorbereiten

```
1. tabs_context_mcp({ createIfEmpty: true })
2. tabs_create_mcp()
3. navigate({ url: "[URL]", tabId: [TAB_ID] })
4. computer({ action: "wait", duration: 2, tabId: [TAB_ID] })
5. javascript_tool({ text: dismissPopupsScript, tabId: [TAB_ID] })
```

### Schritt 2: A11y-Metriken sammeln

```javascript
javascript_tool({
  text: pageMetricsScript,
  tabId: tabId
});

// Relevante Ergebnisse:
// result.accessibility.lang
// result.accessibility.skipLink
// result.accessibility.images
// result.accessibility.links
// result.accessibility.forms
// result.accessibility.ariaLandmarks
```

### Schritt 3: Checks durchfuehren

#### 3.1 Sprache

```yaml
Lang-Attribut:
  Check: document.documentElement.lang
  Erwartet: "de" oder "en" (passend zum Content)
  Status: result.accessibility.lang.status

  WCAG: 3.1.1 Language of Page (Level A)
```

#### 3.2 Skip-Link

```yaml
Skip-Link:
  Check: a[href="#main"], a[href="#content"]
  Erwartet: Vorhanden am Seitenanfang
  Status: result.accessibility.skipLink.found

  WCAG: 2.4.1 Bypass Blocks (Level A)
```

#### 3.3 Bilder

```yaml
Alt-Texte:
  Gesamt: result.accessibility.images.total
  Ohne Alt: result.accessibility.images.withoutAlt
  Prozent: result.accessibility.images.percentage

  WCAG: 1.1.1 Non-text Content (Level A)

  Bewertung:
    - 100%: Optimal
    - 90-99%: Akzeptabel
    - <90%: Problematisch
```

#### 3.4 Links

```yaml
Link-Text:
  Check: Links ohne sichtbaren Text oder aria-label
  Ohne Text: result.accessibility.links.withoutText

  WCAG: 2.4.4 Link Purpose (Level A)
```

#### 3.5 Formulare

```yaml
Form-Labels:
  Inputs: result.accessibility.forms.inputCount
  Ohne Label: result.accessibility.forms.withoutLabels
  Prozent: result.accessibility.forms.percentage

  WCAG: 1.3.1 Info and Relationships (Level A)
         3.3.2 Labels or Instructions (Level A)
```

#### 3.6 Landmarks

```yaml
ARIA Landmarks:
  Banner (header): result.accessibility.ariaLandmarks.banner
  Navigation: result.accessibility.ariaLandmarks.navigation
  Main: result.accessibility.ariaLandmarks.main
  Contentinfo (footer): result.accessibility.ariaLandmarks.contentinfo

  WCAG: 1.3.1 Info and Relationships (Level A)
```

### Schritt 4: Tastaturnavigation testen (optional)

```javascript
// Tab durch die Seite
computer({ action: "key", text: "Tab", tabId: tabId });
// Pruefe: Fokus sichtbar?

// Mehrfach Tab
computer({ action: "key", text: "Tab", repeat: 5, tabId: tabId });
// Pruefe: Logische Reihenfolge?

// Enter auf fokussiertem Element
computer({ action: "key", text: "Enter", tabId: tabId });
// Pruefe: Interaktion funktioniert?
```

### Schritt 5: Farbkontrast pruefen (visuell)

```javascript
// Screenshot erstellen
computer({ action: "screenshot", tabId: tabId });

// Visuell pruefen:
// - Text auf Hintergrund lesbar?
// - Fokus-Indikator sichtbar?
// - Links unterscheidbar?
```

### Schritt 6: Report erstellen

```markdown
## Accessibility Report: [URL]

### Score: [X]/100

### WCAG Level A Compliance

| Kriterium | Status | Details |
|-----------|--------|---------|
| 1.1.1 Alt-Texte | [PASS/FAIL] | X/Y Bilder |
| 1.3.1 Struktur | [PASS/FAIL] | Landmarks |
| 2.4.1 Skip-Link | [PASS/FAIL] | [Vorhanden/Fehlt] |
| 2.4.4 Link-Text | [PASS/FAIL] | X Links ohne Text |
| 3.1.1 Sprache | [PASS/FAIL] | lang="[X]" |
| 3.3.2 Labels | [PASS/FAIL] | X/Y Inputs |

### Issues

1. [Kritisch] ...
2. [Hoch] ...
3. [Mittel] ...

### Empfehlungen

1. ...
2. ...
```

## Templates

### Slash-Command

```
/test-a11y [URL] [OPTIONS]

OPTIONS:
  --level [A|AA|AAA]        WCAG Level (default: A)
  --keyboard                Tastaturnavigation testen
  --skip-images             Bilder-Check ueberspringen
  --report markdown         Report-Format

Beispiele:
  /test-a11y https://example.com
  /test-a11y https://example.com --level AA
  /test-a11y https://example.com --keyboard
```

### Ergebnis-Template

```markdown
## A11y-Check: [URL]

**Datum:** [TIMESTAMP]
**WCAG Level:** A
**Score:** [X]/100

### Sprache

| Check | Erwartet | Gefunden | Status |
|-------|----------|----------|--------|
| Lang-Attribut | Vorhanden | [lang="de"] | PASS |

### Skip-Link

| Check | Erwartet | Gefunden | Status |
|-------|----------|----------|--------|
| Skip-Link | Vorhanden | [Ja/Nein] | [PASS/FAIL] |

### Bilder

| Metrik | Wert | Status |
|--------|------|--------|
| Gesamt | X | - |
| Mit Alt | X | - |
| Ohne Alt | X | [PASS/FAIL] |
| Quote | X% | - |

**Bilder ohne Alt-Text:**
1. [Selector/Src]
2. [Selector/Src]

### Formulare

| Metrik | Wert | Status |
|--------|------|--------|
| Inputs | X | - |
| Mit Label | X | - |
| Ohne Label | X | [PASS/FAIL] |

### Landmarks

| Landmark | Vorhanden | Element |
|----------|-----------|---------|
| Banner | [Ja/Nein] | header |
| Navigation | [Ja/Nein] | nav |
| Main | [Ja/Nein] | main |
| Contentinfo | [Ja/Nein] | footer |

### Empfehlungen

1. [P1] Skip-Link hinzufuegen
2. [P2] Alt-Texte fuer X Bilder ergaenzen
3. [P3] ...
```

## Beispiele

### Beispiel 1: Quick A11y Check

```
User: /test-a11y https://example.com

Claude:
1. Navigiere zu example.com
2. page-metrics.js ausfuehren
3. Analysiere A11y-Metriken

Ergebnis:
A11y-Score: 75/100

Bestanden:
- [x] Lang-Attribut: "de"
- [x] Main Landmark vorhanden
- [x] Navigation Landmark vorhanden
- [x] 95% Bilder mit Alt-Text

Fehlgeschlagen:
- [ ] Skip-Link nicht gefunden
- [ ] 2 Bilder ohne Alt-Text

Empfehlungen:
1. [P2] Skip-Link am Seitenanfang hinzufuegen
2. [P3] Alt-Texte fuer decoration.png, icon.svg
```

### Beispiel 2: Mit Tastaturtest

```
User: /test-a11y https://form.example.com --keyboard

Claude:
1. Standard A11y-Check durchfuehren
2. Tastaturnavigation testen

A11y-Score: 80/100

Tastaturnavigation:
- Tab 1: Logo (fokussiert, sichtbar)
- Tab 2: Home-Link (fokussiert, sichtbar)
- Tab 3: About-Link (fokussiert, sichtbar)
- Tab 4: Suchfeld (fokussiert, sichtbar)
- Tab 5-8: Weitere Navigation

Fokus-Reihenfolge: Logisch (oben-links nach unten-rechts)
Fokus-Indikator: Sichtbar (blauer Ring)
Skip-Link: FEHLT

Issues:
1. [P2] Kein Skip-Link - Nutzer muss durch 8 Tabs navigieren
```

### Beispiel 3: WCAG AA Check

```
User: /test-a11y https://example.com --level AA

Claude:
WCAG AA erfordert zusaetzliche Kriterien:

Level A (Basis):
- [x] 1.1.1 Alt-Texte
- [ ] 2.4.1 Skip-Link
- [x] 3.1.1 Sprache

Level AA (Erweitert):
- [?] 1.4.3 Kontrast (visuell zu pruefen)
- [?] 1.4.4 Textgroesse (visuell zu pruefen)
- [x] 2.4.6 Ueberschriften beschreibend
- [?] 2.4.7 Fokus sichtbar

Hinweis: Kontrast- und Farbpruefung erfordert
spezialisierte Tools (axe, WAVE). Claude kann
nur visuelle Einschaetzung geben.
```

## Anti-Patterns

### NIEMALS

```javascript
// A11y-Checks ohne strukturierte Metriken
read_page({ tabId: tabId });
// "Pruefe ob alles barrierefrei ist"
// -> Zu vage, nicht reproduzierbar

// Nur visuelle Pruefung
screenshot();
// "Sieht barrierefrei aus"
// -> Viele Issues sind nicht sichtbar
```

### IMMER

```javascript
// Strukturierte Metriken verwenden
javascript_tool({ text: pageMetricsScript, tabId });
// -> Quantifizierbare Ergebnisse

// WCAG-Kriterien referenzieren
// -> Klare Pass/Fail Kriterien

// Konkrete Empfehlungen geben
// -> "Fuege Skip-Link hinzu: <a href='#main'>Zum Inhalt</a>"
```

## Checkliste

- [ ] page-metrics.js ausgefuehrt?
- [ ] Lang-Attribut geprueft?
- [ ] Skip-Link geprueft?
- [ ] Bilder auf Alt-Text geprueft?
- [ ] Links auf Text geprueft?
- [ ] Formulare auf Labels geprueft?
- [ ] Landmarks vorhanden?
- [ ] Tastaturnavigation getestet (optional)?
- [ ] Report mit WCAG-Referenzen erstellt?
