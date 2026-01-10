# Browser Test SEO Skill

- Last Updated: 2025-01-10
- Description: Fuehrt SEO-fokussierte Tests mit Claude in Chrome durch
- Version: 1.0
- Dependencies: [19-browser-testing], extract-selectors.js, page-metrics.js

## Kontext

Verwende diesen Skill wenn:
- Nur SEO-Metriken geprueft werden sollen
- Meta-Tags verifiziert werden muessen
- Heading-Struktur analysiert werden soll
- Open Graph / Twitter Cards geprueft werden sollen

## Voraussetzungen

- Claude in Chrome MCP verbunden
- Ziel-URL erreichbar
- Scripts: `extract-selectors.js`, `page-metrics.js`

## Workflow

### Schritt 1: Seite laden und vorbereiten

```
1. tabs_context_mcp({ createIfEmpty: true })
2. tabs_create_mcp()
3. navigate({ url: "[URL]", tabId: [TAB_ID] })
4. computer({ action: "wait", duration: 2, tabId: [TAB_ID] })
5. javascript_tool({ text: dismissPopupsScript, tabId: [TAB_ID] })
```

### Schritt 2: SEO-Metriken sammeln

```javascript
// Option A: Schnelle Extraktion
javascript_tool({
  text: extractSelectorsScript,
  tabId: tabId
});
// Nutze result.meta und result.summary

// Option B: Umfassende Metriken
javascript_tool({
  text: pageMetricsScript,
  tabId: tabId
});
// Nutze result.seo fuer detaillierte Analyse
```

### Schritt 3: Metriken analysieren

#### Title-Analyse

```yaml
Title:
  Wert: result.seo.title.value
  Laenge: result.seo.title.length
  Status: result.seo.title.status

  Bewertung:
    - optimal: 50-60 Zeichen
    - akzeptabel: 30-70 Zeichen
    - problematisch: <30 oder >70 Zeichen
```

#### Description-Analyse

```yaml
Description:
  Wert: result.seo.description.value
  Laenge: result.seo.description.length
  Status: result.seo.description.status

  Bewertung:
    - optimal: 150-160 Zeichen
    - akzeptabel: 120-170 Zeichen
    - problematisch: <120 oder >170 Zeichen
```

#### Heading-Struktur

```yaml
Headings:
  H1:
    Anzahl: result.seo.h1.count
    Optimal: result.seo.h1.optimal (genau 1)
    Werte: result.seo.h1.values
  H2: result.seo.h2Count
  H3: result.seo.h3Count

  Bewertung:
    - optimal: Genau 1 H1, mehrere H2/H3
    - problematisch: 0 oder >1 H1
```

#### Open Graph

```yaml
Open Graph:
  Title: result.seo.openGraph.hasTitle
  Description: result.seo.openGraph.hasDescription
  Image: result.seo.openGraph.hasImage
  URL: result.seo.openGraph.hasUrl
  Complete: result.seo.openGraph.complete
```

#### Technisches SEO

```yaml
Technical:
  Canonical: result.seo.canonical
  Robots: result.seo.robots
  Structured Data: result.seo.structuredData.hasJsonLd
```

### Schritt 4: Report generieren

```markdown
## SEO-Report: [URL]

### Score: [X]/100

### Title
- Wert: "[...]"
- Laenge: X Zeichen
- Status: [OK/WARNING/ERROR]

### Description
- Wert: "[...]"
- Laenge: X Zeichen
- Status: [OK/WARNING/ERROR]

### Headings
- H1: X (Erwartet: 1)
- H2: X
- H3: X

### Open Graph
- [x] Title
- [x] Description
- [x] Image
- [ ] URL

### Technical
- Canonical: [URL]
- Robots: [Wert]
- JSON-LD: [Ja/Nein]

### Empfehlungen
1. [...]
2. [...]
```

## Templates

### Slash-Command

```
/test-seo [URL] [OPTIONS]

OPTIONS:
  --strict              Strikte Laengenpruefung
  --include-og          Open Graph Details
  --include-twitter     Twitter Card Details
  --include-schema      Schema.org/JSON-LD Details
  --report markdown     Report-Format (default)
  --report json         JSON-Format
```

### Ergebnis-Template

```markdown
## SEO-Check: [URL]

**Datum:** [TIMESTAMP]
**Score:** [X]/100

| Metrik | Erwartet | Gefunden | Status |
|--------|----------|----------|--------|
| Title vorhanden | Ja | [Ja/Nein] | [ICON] |
| Title Laenge | 50-60 | [X] | [ICON] |
| Description vorhanden | Ja | [Ja/Nein] | [ICON] |
| Description Laenge | 150-160 | [X] | [ICON] |
| H1 Anzahl | 1 | [X] | [ICON] |
| Canonical | Vorhanden | [Ja/Nein] | [ICON] |
| OG Complete | Ja | [Ja/Nein] | [ICON] |

### Gefundene Meta-Tags

```html
<title>[...]</title>
<meta name="description" content="[...]">
<link rel="canonical" href="[...]">
```

### Empfehlungen

1. [Priorisierte Empfehlung]
2. [...]
```

## Beispiele

### Beispiel 1: Standard SEO-Check

```
User: /test-seo https://example.com

Claude:
1. Navigiere zu URL
2. Fuehre page-metrics.js aus
3. Analysiere SEO-Metriken

Ergebnis:
SEO-Score: 85/100

Title: "Example Domain - Your Trusted Source" (45 Zeichen)
- Status: OK (koennte 5-15 Zeichen laenger sein)

Description: "Example Domain provides..." (142 Zeichen)
- Status: WARNING (8 Zeichen unter Optimum)

H1: 1 gefunden - "Welcome to Example"
- Status: OK

Canonical: https://example.com
- Status: OK

Open Graph: 3/5 Tags vorhanden
- Fehlt: og:url, og:type

Empfehlungen:
1. [P3] Description um ~15 Zeichen erweitern
2. [P3] og:url und og:type hinzufuegen
```

### Beispiel 2: Strikter Check

```
User: /test-seo https://example.com --strict

Claude:
SEO-Score: 72/100 (Strikte Bewertung)

Kritische Issues:
1. [P2] Title: 45 Zeichen (Minimum: 50)
2. [P2] Description: 142 Zeichen (Minimum: 150)

Warnings:
1. [P3] Open Graph unvollstaendig
2. [P3] Kein JSON-LD/Schema.org gefunden
```

## Anti-Patterns

### NIEMALS

```javascript
// Vollstaendigen DOM fuer SEO-Check laden
read_page({ tabId: tabId })  // Unnoetig gross!

// Meta-Tags manuell aus HTML parsen
// -> Nutze extract-selectors.js oder page-metrics.js
```

### IMMER

```javascript
// Optimierte Scripts verwenden
javascript_tool({ text: pageMetricsScript, tabId: tabId });

// Strukturierte Analyse
const seo = result.seo;
const score = result.summary.seoScore;
```

## Checkliste

- [ ] Seite vollstaendig geladen?
- [ ] page-metrics.js ausgefuehrt?
- [ ] Title geprueft (Laenge, Keywords)?
- [ ] Description geprueft?
- [ ] H1-Struktur validiert?
- [ ] Canonical vorhanden?
- [ ] Open Graph vollstaendig?
- [ ] Report generiert?
