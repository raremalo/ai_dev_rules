# Test-Dokumentation: [Feature/Page Name]

- Erstellt: YYYY-MM-DD
- Version: 1.0
- Prioritaet: [P1-Kritisch | P2-Hoch | P3-Mittel | P4-Niedrig]
- Status: [Draft | Ready | Executed | Passed | Failed]

## Metadaten

| Feld | Wert |
|------|------|
| Ziel-URL | `https://example.com/page` |
| Verantwortlich | [Name/Team] |
| Letzte Ausfuehrung | YYYY-MM-DD HH:MM |
| Browser | Chrome [Version] |
| MCP-Version | Claude in Chrome [Version] |

---

## Voraussetzungen

### Technische Voraussetzungen

- [ ] Claude in Chrome MCP konfiguriert und verbunden
- [ ] Ziel-Umgebung erreichbar (Staging/Production)
- [ ] Test-Daten vorbereitet (falls erforderlich)
- [ ] Referenz-Screenshots vorhanden (falls Visual Regression)

### Umgebung

| Parameter | Wert |
|-----------|------|
| Viewport | [Mobile 375px / Tablet 768px / Desktop 1440px] |
| Authentifizierung | [Keine / Login erforderlich] |
| Sprache | [DE / EN] |
| Cookies | [Akzeptiert / Abgelehnt] |

### Pre-Scripts

```
[x] dismiss-popups.js - Cookie-Banner entfernen
[x] extract-selectors.js - Selektoren extrahieren
[ ] [weitere Scripts falls noetig]
```

---

## Testfaelle

### TC-001: [Testfall Name]

**Prioritaet:** P1
**Kategorie:** [Visual | SEO | Accessibility | Functional]
**Geschaetzte Dauer:** ~2 min

#### Vorbedingungen

- Seite ist vollstaendig geladen
- Pop-ups wurden geschlossen
- [weitere Bedingungen]

#### Schritte

| # | Aktion | Erwartetes Ergebnis | Tool |
|---|--------|---------------------|------|
| 1 | Navigiere zu URL | Seite laedt vollstaendig | `navigate` |
| 2 | Fuehre dismiss-popups.js aus | Keine Pop-ups sichtbar | `javascript_tool` |
| 3 | Pruefe Hero-Bereich | H1 vorhanden, CTA sichtbar | `extract-selectors.js` |
| 4 | Erstelle Desktop-Screenshot | Screenshot gespeichert | `screenshot` |

#### Erwartetes Ergebnis

- H1 entspricht: "[Erwarteter Text]"
- CTA-Button ist sichtbar und klickbar
- Keine visuellen Fehler
- Keine Console-Errors

#### Tatsaechliches Ergebnis

```
[Nach Ausfuehrung ausfuellen]
- H1: [gefundener Text]
- CTA: [Status]
- Errors: [Anzahl/keine]
```

#### Status

- [ ] Bestanden
- [ ] Fehlgeschlagen
- [ ] Blockiert
- [ ] Uebersprungen

#### Screenshots

| Typ | Datei |
|-----|-------|
| Referenz | `screenshots/reference/tc-001-hero.png` |
| Aktuell | `screenshots/current/tc-001-hero-YYYYMMDD.png` |
| Diff | `screenshots/diff/tc-001-hero-diff.png` |

---

### TC-002: SEO Meta-Tags

**Prioritaet:** P2
**Kategorie:** SEO
**Geschaetzte Dauer:** ~1 min

#### Schritte

| # | Aktion | Erwartetes Ergebnis |
|---|--------|---------------------|
| 1 | Extrahiere page-metrics.js | Metrics erhalten |
| 2 | Pruefe Title | 50-60 Zeichen, Keywords enthalten |
| 3 | Pruefe Description | 150-160 Zeichen |
| 4 | Pruefe H1 | Genau eine H1 vorhanden |
| 5 | Pruefe Canonical | URL vorhanden |

#### Erwartete Werte

| Meta-Tag | Erwarteter Wert | Aktueller Wert | Status |
|----------|-----------------|----------------|--------|
| Title | "[...]" (55 Zeichen) | | |
| Description | "[...]" (155 Zeichen) | | |
| H1 Count | 1 | | |
| Canonical | `https://...` | | |
| OG:Title | Vorhanden | | |
| OG:Description | Vorhanden | | |
| OG:Image | Vorhanden | | |

---

### TC-003: Accessibility Quick-Check

**Prioritaet:** P2
**Kategorie:** Accessibility
**Geschaetzte Dauer:** ~1 min

#### Schritte

| # | Aktion | Erwartetes Ergebnis |
|---|--------|---------------------|
| 1 | Pruefe Lang-Attribut | `lang="de"` oder `lang="en"` |
| 2 | Pruefe Skip-Link | Link zu main/content vorhanden |
| 3 | Pruefe Bilder | Alle haben alt-Attribut |
| 4 | Pruefe Form-Labels | Alle Inputs haben Labels |

#### Erwartete Werte

| Check | Erwartet | Aktuell | Status |
|-------|----------|---------|--------|
| Lang-Attribut | `de` / `en` | | |
| Skip-Link | Vorhanden | | |
| Images mit Alt | 100% | | |
| Inputs mit Label | 100% | | |

---

### TC-004: Responsive Design

**Prioritaet:** P2
**Kategorie:** Visual
**Geschaetzte Dauer:** ~3 min

#### Schritte

| # | Viewport | Aktion | Erwartetes Ergebnis |
|---|----------|--------|---------------------|
| 1 | Desktop (1440px) | Screenshot | Layout korrekt |
| 2 | Tablet (768px) | Screenshot | Anpassung korrekt |
| 3 | Mobile (375px) | Screenshot | Mobile-Navigation sichtbar |

#### Breakpoint-Checks

| Viewport | Navigation | Hero | Footer | Status |
|----------|------------|------|--------|--------|
| Desktop | Standard | Vollbild | 4-spaltig | |
| Tablet | Hamburger | Reduziert | 2-spaltig | |
| Mobile | Hamburger | Stack | 1-spaltig | |

---

### TC-005: Console Errors

**Prioritaet:** P3
**Kategorie:** Functional
**Geschaetzte Dauer:** ~30 sec

#### Schritte

| # | Aktion | Erwartetes Ergebnis |
|---|--------|---------------------|
| 1 | Pruefe Console auf Errors | Keine JS-Errors |
| 2 | Pruefe Console auf Warnings | Keine kritischen Warnings |
| 3 | Pruefe Network auf 404s | Keine fehlenden Ressourcen |

#### Erwartete Werte

| Typ | Erwartet | Gefunden | Status |
|-----|----------|----------|--------|
| JS Errors | 0 | | |
| Warnings | <5 | | |
| 404 Errors | 0 | | |

---

## Zusammenfassung

| Kategorie | Gesamt | Bestanden | Fehlgeschlagen | Blockiert | Uebersprungen |
|-----------|--------|-----------|----------------|-----------|---------------|
| Visual | | | | | |
| SEO | | | | | |
| Accessibility | | | | | |
| Functional | | | | | |
| **Total** | | | | | |

---

## Gefundene Issues

### Issue 1: [Kurzbeschreibung]

| Feld | Wert |
|------|------|
| Schweregrad | [Kritisch / Hoch / Mittel / Niedrig] |
| Testfall | TC-XXX |
| Beschreibung | [Detaillierte Beschreibung] |
| Screenshot | `failures/[filename].png` |
| Empfehlung | [Wie zu beheben] |

---

## Notizen

```
[Weitere Beobachtungen, bekannte Issues, Verbesserungsvorschlaege]
```

---

## Anhang

### Verwendete Scripts

- `dismiss-popups.js` - Version 1.0
- `extract-selectors.js` - Version 1.0
- `full-page-screenshot.js` - Version 1.0

### Referenz-Dateien

- Skills: `skills/testing/browser-test-landing-page.md`
- Regel: `rules/19-browser-testing.md`
- Guide: `docs/BROWSER-TESTING-GUIDE.md`
