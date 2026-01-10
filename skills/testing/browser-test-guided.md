# Browser Test Guided Skill

- Last Updated: 2025-01-10
- Description: Interaktive, gefuehrte Test-Ausfuehrung mit Schritt-fuer-Schritt Bestaetigung
- Version: 1.0
- Dependencies: [19-browser-testing], browser-test-landing-page

## Kontext

Verwende diesen Skill wenn:
- Tests zum ersten Mal auf einer Seite ausgefuehrt werden
- Detaillierte Kontrolle ueber jeden Schritt benoetigt wird
- Der Tester jeden Schritt bestaetigen soll
- Dokumentation waehrend der Ausfuehrung erstellt werden soll

## Voraussetzungen

- Test-Dokumentation vorhanden (optional: `test-documentation.template.md`)
- Ziel-URL bekannt
- Claude in Chrome MCP verbunden

## Workflow

### Schritt 1: Session starten

```
User: /test-guided https://example.com
      oder
User: /test-guided https://example.com --test-file tests/landing-page.md
```

### Schritt 2: Interaktiver Ablauf

Der Skill arbeitet in einer Schleife mit Benutzer-Bestaetigung:

#### Phase 1: Vorbereitung

```markdown
╔════════════════════════════════════════════════════════════╗
║ SCHRITT 1: Vorbereitung                                    ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ Ich werde die Testumgebung vorbereiten:                   ║
║                                                            ║
║ 1. Navigiere zu https://example.com                       ║
║ 2. Fuehre dismiss-popups.js aus                           ║
║ 3. Extrahiere Selektoren                                  ║
║                                                            ║
║ Fortfahren? [ja/nein/abbrechen]                           ║
╚════════════════════════════════════════════════════════════╝
```

#### Phase 2: Testfall-Ausfuehrung

```markdown
╔════════════════════════════════════════════════════════════╗
║ SCHRITT 2: Testfall TC-001                                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ **Testfall:** Hero-Bereich Visual Check                   ║
║ **Prioritaet:** P1                                        ║
║                                                            ║
║ Aktionen:                                                  ║
║ 1. Screenshot des Hero-Bereichs erstellen                 ║
║ 2. Auf H1-Element pruefen                                 ║
║ 3. CTA-Button verifizieren                                ║
║                                                            ║
║ Erwartetes Ergebnis:                                       ║
║ - H1 vorhanden und sichtbar                               ║
║ - CTA-Button klickbar                                     ║
║                                                            ║
║ Diesen Testfall ausfuehren? [ja/ueberspringen/abbrechen]  ║
╚════════════════════════════════════════════════════════════╝
```

#### Phase 3: Ergebnis-Anzeige

```markdown
╔════════════════════════════════════════════════════════════╗
║ ERGEBNIS TC-001: BESTANDEN                                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ Gefunden:                                                  ║
║ ✓ H1: "Willkommen bei Example" (100% Match)              ║
║ ✓ CTA: Button gefunden, ref="ref_42"                     ║
║ ✓ Screenshot: gespeichert als tc-001-hero.png            ║
║                                                            ║
║ Naechster Testfall: TC-002 (SEO Check)                    ║
║ Fortfahren? [ja/wiederholen/abbrechen]                    ║
╚════════════════════════════════════════════════════════════╝
```

### Kontroll-Befehle

| Befehl | Kurzform | Aktion |
|--------|----------|--------|
| `ja` | `j`, `y` | Aktuellen Schritt ausfuehren |
| `nein` | `n` | Schritt ueberspringen |
| `wiederholen` | `w`, `r` | Letzten Schritt wiederholen |
| `abbrechen` | `a`, `q` | Test abbrechen, Report generieren |
| `pause` | `p` | Test pausieren, Kontext speichern |
| `status` | `s` | Aktuellen Fortschritt anzeigen |
| `screenshot` | `ss` | Manuellen Screenshot erstellen |
| `hilfe` | `h`, `?` | Befehle anzeigen |

### Pause & Resume

```markdown
╔════════════════════════════════════════════════════════════╗
║ PAUSE aktiviert                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ Aktueller Stand gespeichert:                              ║
║ - Abgeschlossen: TC-001, TC-002, TC-003                   ║
║ - Naechster: TC-004                                       ║
║ - Zeit: 5:32 Minuten                                      ║
║                                                            ║
║ Um fortzusetzen:                                          ║
║ /test-guided https://example.com --resume                 ║
╚════════════════════════════════════════════════════════════╝
```

## Templates

### Slash-Command Format

```
/test-guided [URL] [OPTIONS]

OPTIONS:
  --test-file [path]    Spezifische Test-Dokumentation laden
  --start-at [TC-XXX]   Ab bestimmtem Testfall starten
  --resume              Pausierte Session fortsetzen
  --verbose             Ausfuehrliche Ausgabe pro Schritt
  --skip-visual         Visuelle Tests ueberspringen
  --skip-seo            SEO-Tests ueberspringen
```

### Fortschritts-Anzeige

```
Test-Fortschritt: [████████░░░░░░░░░░░░] 40%
Abgeschlossen: 4/10 | Bestanden: 4 | Fehlgeschlagen: 0
Zeit: 3:45 min | Verbleibend: ~6 min
```

### Zwischen-Report

```markdown
╔════════════════════════════════════════════════════════════╗
║ ZWISCHEN-REPORT (nach TC-005)                              ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ Status:                                                    ║
║ ├── Bestanden:      5                                     ║
║ ├── Fehlgeschlagen: 0                                     ║
║ ├── Uebersprungen:  0                                     ║
║ └── Ausstehend:     5                                     ║
║                                                            ║
║ Bisherige Findings:                                        ║
║ - [Info] Title koennte laenger sein (45 Zeichen)         ║
║ - [Info] 2 Bilder ohne Alt-Text                          ║
║                                                            ║
║ Weitermachen mit TC-006?                                  ║
╚════════════════════════════════════════════════════════════╝
```

## Beispiele

### Beispiel 1: Standard Guided Test

```
User: /test-guided https://example.com

Claude:
╔════════════════════════════════════════════════════════════╗
║ GUIDED TEST SESSION                                        ║
║ URL: https://example.com                                   ║
║ Tests: 8 Testfaelle (3 Visual, 3 SEO, 2 A11y)            ║
╚════════════════════════════════════════════════════════════╝

SCHRITT 1: Vorbereitung
-----------------------
1. Navigiere zu https://example.com
2. Pop-ups entfernen
3. Selektoren extrahieren

Fortfahren? [ja/nein]

User: ja

Claude:
[Fuehrt Schritte aus]

✓ Navigation erfolgreich
✓ 1 Cookie-Banner entfernt
✓ 45 Elemente extrahiert

SCHRITT 2: TC-001 Visual Hero
-----------------------------
Screenshot des Hero-Bereichs erstellen und pruefen.

Ausfuehren? [ja/ueberspringen]

User: ja

[Prozess setzt sich fort...]
```

### Beispiel 2: Mit Test-Datei

```
User: /test-guided https://shop.example.com --test-file tests/checkout.md

Claude:
╔════════════════════════════════════════════════════════════╗
║ GUIDED TEST: Checkout Flow                                 ║
║ Test-Datei: tests/checkout.md                             ║
║ Testfaelle: 12                                            ║
╚════════════════════════════════════════════════════════════╝

Gefundene Testfaelle:
- TC-001: Warenkorb oeffnen (P1)
- TC-002: Produkt hinzufuegen (P1)
- TC-003: Menge aendern (P2)
...

Mit TC-001 starten? [ja/nein]
```

### Beispiel 3: Resume nach Pause

```
User: /test-guided https://example.com --resume

Claude:
╔════════════════════════════════════════════════════════════╗
║ SESSION FORTSETZEN                                         ║
╠════════════════════════════════════════════════════════════╣
║ Gespeicherter Stand gefunden:                             ║
║ - URL: https://example.com                                ║
║ - Fortschritt: 5/10 Tests (50%)                          ║
║ - Letzter Test: TC-005 (BESTANDEN)                       ║
║ - Naechster: TC-006 SEO Meta-Tags                        ║
╚════════════════════════════════════════════════════════════╝

Mit TC-006 fortfahren? [ja/von_vorne/abbrechen]
```

## Anti-Patterns

### NIEMALS

```
// Alle Tests ohne Bestaetigung durchlaufen
for (test in tests) { execute(test) }  // User hat keine Kontrolle!

// Fehlgeschlagene Tests ignorieren
if (test.failed) { continue }  // Fehler werden uebersehen!

// Ohne Zwischen-Reports fortfahren
// Nach 20 Minuten weiss niemand mehr den Stand
```

### IMMER

```
// Jeden kritischen Testfall bestaetigen lassen
askUser("TC-001 ausfuehren? [ja/nein]")

// Screenshots fuer Dokumentation speichern
saveScreenshot(`tc-${testId}-${timestamp}.png`)

// Bei Fehlern Optionen anbieten
if (test.failed) {
  askUser("Fehler gefunden. [wiederholen/ueberspringen/abbrechen]")
}

// Regelmaessige Fortschritts-Updates
if (completedTests % 5 === 0) {
  showIntermediateReport()
}
```

## Checkliste

- [ ] Interaktive Bestaetigungen funktionieren?
- [ ] Kontroll-Befehle werden erkannt?
- [ ] Pause/Resume korrekt implementiert?
- [ ] Fortschritts-Anzeige sichtbar?
- [ ] Zwischen-Reports bei langen Sessions?
- [ ] Screenshots werden gespeichert?
- [ ] Final-Report generiert?
- [ ] Fehler werden klar kommuniziert?
