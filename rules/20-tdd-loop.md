# TDD-Loop Pattern

- Last Updated: 2025-01-10
- Description: Test-Driven Development mit Ralph-Wiggum Loop und visueller Verifikation
- Version: 1.0

## Kernprinzip

**Tests First → Minimale Implementierung → Screenshot-Verifikation → Rerun → Completion Promise**

Die Completion Promise darf ERST ausgegeben werden, wenn ALLE Bedingungen erfuellt sind:
1. Alle funktionalen Tests bestehen
2. Alle Screenshots haben "verified" Status
3. Ein Rerun bestaetigt stabilen Zustand

---

## Ralph-Wiggum Plugin

### Was ist Ralph?

Ralph ist eine Entwicklungsmethodik basierend auf kontinuierlichen AI-Agent-Loops. Der Loop:
1. Faengt Claudes Exit-Versuche ab
2. Fuettert denselben Prompt erneut
3. Wiederholt bis zur Completion Promise

### Installation

```bash
# Plugin aktivieren (in Claude Code)
# Das Plugin ist Teil von anthropics/claude-code
```

### Commands

| Command | Beschreibung |
|---------|--------------|
| `/ralph-loop "<prompt>" [options]` | Startet einen Loop |
| `/cancel-ralph` | Bricht aktiven Loop ab |

### Optionen

```bash
/ralph-loop "<prompt>" \
  --max-iterations 30 \          # Sicherheitslimit
  --completion-promise "DONE"    # Signal fuer Fertigstellung
```

---

## TDD-Workflow

### Phase 1: Tests schreiben (fehlschlagend)

```typescript
// e2e/feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Feature: [Name]', () => {
  test('should [behavior]', async ({ page }) => {
    // Test MUSS anfangs fehlschlagen
    await page.goto('/');
    await expect(page.locator('[data-testid="feature"]')).toBeVisible();
  });
});
```

**WICHTIG:** Tests MUESSEN anfangs fehlschlagen!

### Phase 2: Minimale Implementierung

- Implementiere NUR was noetig ist, um Tests zu bestehen
- Kein Over-Engineering
- Kein "nice-to-have" Code

### Phase 3: Screenshot-Verifikation

```
1. Screenshot erstellen → status: "pending"
2. Screenshot visuell lesen und analysieren
3. Als "verified" markieren wenn korrekt
4. manifest.json aktualisieren
```

### Phase 4: Rerun

- Alle Tests erneut ausfuehren
- Stabilitaet bestaetigen
- Keine Regressionen

### Phase 5: Completion Check

```markdown
PRUEFE vor Completion Promise:
- [ ] Alle Tests bestehen?
- [ ] manifest.allVerified === true?
- [ ] Rerun erfolgreich?

Wenn ALLE JA: <promise>TDD_COMPLETE</promise>
Wenn NEIN: Weiter iterieren
```

---

## Screenshot-Verifikationsprotokoll

### Verzeichnisstruktur

```
screenshots/
├── pending/           # Noch nicht verifiziert
│   └── feature-001-before.png
├── verified/          # Von Claude verifiziert
│   └── feature-001-after-verified.png
└── manifest.json      # Status-Tracking
```

### manifest.json Format

```json
{
  "screenshots": [
    {
      "id": "feature-001-before",
      "path": "pending/feature-001-before.png",
      "status": "pending",
      "feature": "command-palette",
      "timestamp": "2025-01-10T18:00:00Z"
    },
    {
      "id": "feature-001-after",
      "path": "verified/feature-001-after-verified.png",
      "status": "verified",
      "verifiedAt": "2025-01-10T18:05:00Z",
      "verifiedBy": "claude-iteration-3"
    }
  ],
  "allVerified": false,
  "totalCount": 2,
  "verifiedCount": 1,
  "pendingCount": 1
}
```

### Verifikations-Regeln

**NIEMALS** Completion Promise ausgeben wenn:
- `manifest.allVerified === false`
- Screenshots mit `status: "pending"` existieren
- Screenshots nicht gelesen wurden

**IMMER** vor Completion Promise:
- Jeden Screenshot visuell lesen
- Korrektheit bestaetigen
- Status auf "verified" setzen
- manifest.json aktualisieren

---

## Agentic Prompt Template

```markdown
# TDD-Loop: [Feature Name]

## Ziel
[Feature-Beschreibung]

## Completion Promise
Gib <promise>TDD_COMPLETE</promise> ERST aus, wenn:
1. Alle Tests in `e2e/` bestehen
2. Alle Screenshots in `screenshots/manifest.json` status="verified" haben
3. Ein finaler Rerun alle Tests bestaetigt

## Phase 1: Tests schreiben
- Erstelle Tests in `e2e/[feature].spec.ts`
- Tests MUESSEN anfangs fehlschlagen
- Definiere Screenshots: vorher/nachher pro Zustand

## Phase 2: Minimale Implementierung
- Implementiere NUR was noetig ist, um Tests zu bestehen
- Keine Over-Engineering

## Phase 3: Screenshot-Verifikation
- Erstelle Screenshots fuer jeden Zustand
- Lies JEDEN Screenshot visuell
- Markiere mit "verified" wenn korrekt
- Update manifest.json

## Phase 4: Rerun
- Fuehre alle Tests erneut aus
- Bestaetuge stabilen Zustand

## Phase 5: Completion Check
PRUEFE vor Completion Promise:
- [ ] Alle Tests bestehen?
- [ ] manifest.allVerified === true?
- [ ] Rerun erfolgreich?

Wenn ALLE JA: <promise>TDD_COMPLETE</promise>
Wenn NEIN: Weiter iterieren
```

---

## Loop-Konfiguration

### Empfohlene Einstellungen

| Feature-Komplexitaet | Max Iterations | Completion Promise |
|---------------------|----------------|-------------------|
| Einfach (Button, Form) | 10-15 | `SIMPLE_DONE` |
| Mittel (Page, Component) | 20-30 | `TDD_COMPLETE` |
| Komplex (Multi-Page Flow) | 40-50 | `FEATURE_COMPLETE` |

### Beispiel-Aufruf

```bash
/ralph-loop "$(cat prompts/feature-x.md)" \
  --max-iterations 30 \
  --completion-promise "TDD_COMPLETE"
```

---

## Best Practices

### 1. Klare Completion-Kriterien

```markdown
❌ SCHLECHT:
"Baue Feature X und mach es gut."

✅ GUT:
"Baue Feature X.
Wenn fertig:
- Alle Tests bestehen
- Screenshots verified
- Output: <promise>TDD_COMPLETE</promise>"
```

### 2. Inkrementelle Ziele

```markdown
❌ SCHLECHT:
"Erstelle komplette E-Commerce Plattform."

✅ GUT:
"Phase 1: User Auth (Tests + Screenshots)
Phase 2: Produkt-Liste (Tests + Screenshots)
Phase 3: Warenkorb (Tests + Screenshots)
Output <promise>DONE</promise> wenn alle Phasen fertig."
```

### 3. Self-Correction einbauen

```markdown
✅ GUT:
"Implementiere Feature X mit TDD:
1. Schreibe fehlschlagende Tests
2. Implementiere Feature
3. Tests ausfuehren
4. Bei Fehlschlag: debuggen und fixen
5. Refactor wenn noetig
6. Wiederhole bis alle gruen
7. Screenshots verifizieren
8. Output: <promise>TDD_COMPLETE</promise>"
```

### 4. Escape Hatches

```markdown
✅ GUT:
"Nach 20 Iterationen, wenn nicht fertig:
- Dokumentiere was blockiert
- Liste Loesungsversuche auf
- Schlage Alternativen vor"
```

---

## Wann Ralph verwenden

### Gut geeignet fuer:

- ✅ Klar definierte Tasks mit eindeutigen Erfolgskriterien
- ✅ Tasks die Iteration erfordern (Tests zum Bestehen bringen)
- ✅ Greenfield-Projekte
- ✅ Tasks mit automatischer Verifikation (Tests, Screenshots)

### Nicht geeignet fuer:

- ❌ Tasks die menschliches Urteil erfordern
- ❌ One-Shot Operationen
- ❌ Tasks mit unklaren Erfolgskriterien
- ❌ Production-Debugging

---

## Integration mit Browser-Testing

Dieses Pattern integriert mit [Regel 19: Browser Testing]:

- Nutze `dismiss-popups.js` vor Screenshots
- Nutze `extract-selectors.js` fuer DOM-Analyse
- Nutze `page-metrics.js` fuer SEO/A11y Checks
- Nutze Claude-in-Chrome oder Playwright fuer Screenshots

---

## Checkliste

- [ ] Tests geschrieben (anfangs fehlschlagend)?
- [ ] Minimale Implementierung (nur was noetig)?
- [ ] Screenshots erstellt?
- [ ] Jeden Screenshot visuell gelesen?
- [ ] manifest.json aktualisiert?
- [ ] manifest.allVerified === true?
- [ ] Rerun erfolgreich?
- [ ] Completion Promise ausgegeben?

---

## Referenzen

- **Plugin:** `anthropics/claude-code/plugins/ralph-wiggum`
- **Technik:** https://ghuntley.com/ralph/
- **Browser-Testing:** [Regel 19: Browser Testing]
- **Skills:** `skills/testing/tdd-loop-*.md`
