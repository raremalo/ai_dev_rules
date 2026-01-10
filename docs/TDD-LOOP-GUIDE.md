# TDD-Loop Guide

Eine umfassende Anleitung fuer Test-Driven Development mit Ralph-Wiggum Loop und visueller Verifikation.

- Last Updated: 2025-01-10
- Version: 1.0

---

## Inhaltsverzeichnis

1. [Einfuehrung](#einfuehrung)
2. [Ralph-Wiggum Plugin](#ralph-wiggum-plugin)
3. [TDD-Workflow](#tdd-workflow)
4. [Screenshot-Verifikation](#screenshot-verifikation)
5. [Prompt-Schreiben](#prompt-schreiben)
6. [Beispiel-Implementierung](#beispiel-implementierung)
7. [Troubleshooting](#troubleshooting)

---

## Einfuehrung

### Was ist TDD-Loop?

TDD-Loop kombiniert Test-Driven Development mit dem Ralph-Wiggum Plugin fuer autonome, iterative Entwicklung:

```
Tests First → Implementierung → Screenshot-Verifikation → Rerun → Completion
     ↑                                                              │
     └──────────────── Iteration (bis alle Bedingungen erfuellt) ───┘
```

### Warum TDD-Loop?

| Vorteil | Beschreibung |
|---------|--------------|
| **Autonomie** | Claude arbeitet selbststaendig bis zur Fertigstellung |
| **Qualitaet** | Tests und visuelle Verifikation garantieren Korrektheit |
| **Sicherheit** | Max-Iterations verhindert Endlosschleifen |
| **Dokumentation** | Screenshots dokumentieren jeden Zustand |

### Komponenten

```
TDD-Loop System
├── Ralph-Wiggum Plugin      # Agentic Loop
├── Playwright/Tests         # Funktionale Tests
├── Screenshot-Verifier      # Visuelle Verifikation
├── manifest.json            # Status-Tracking
└── Prompt-Template          # Steuerung
```

---

## Ralph-Wiggum Plugin

### Ueberblick

Ralph-Wiggum ist ein Claude Code Plugin, das iterative Entwicklungsschleifen ermoeglicht. Es basiert auf der "Ralph Technique" von Geoffrey Huntley.

### Funktionsweise

1. Claude erhaelt Prompt mit Aufgabe und Completion Promise
2. Claude arbeitet an der Aufgabe
3. Bei Exit-Versuch: Loop fuettert Prompt erneut
4. Vorheriger Code bleibt in Dateien erhalten
5. Claude liest eigene Arbeit und setzt fort
6. Loop endet wenn Completion Promise ausgegeben wird

### Commands

```bash
# Loop starten
/ralph-loop "<prompt>" --max-iterations 30 --completion-promise "DONE"

# Loop abbrechen
/cancel-ralph

# Hilfe
/help ralph
```

### Optionen

| Option | Beschreibung | Empfehlung |
|--------|--------------|------------|
| `--max-iterations N` | Sicherheitslimit | 20-50 je nach Komplexitaet |
| `--completion-promise "X"` | Signal fuer Fertigstellung | Eindeutiges Wort |

### Beispiel

```bash
/ralph-loop "Implementiere Login-Feature.
Tests muessen bestehen.
Screenshots muessen verified sein.
Output <promise>TDD_COMPLETE</promise> wenn fertig." \
  --max-iterations 30 \
  --completion-promise "TDD_COMPLETE"
```

---

## TDD-Workflow

### Phase 1: Tests schreiben

**Ziel:** Fehlschlagende Tests definieren das erwartete Verhalten.

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('zeigt Login-Formular', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form[data-testid="login-form"]')).toBeVisible();
  });

  test('validiert leere Felder', async ({ page }) => {
    await page.goto('/login');
    await page.click('[data-testid="submit"]');
    await expect(page.locator('[data-testid="error"]')).toBeVisible();
  });

  test('Login erfolgreich', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

**Regeln:**
- Tests MUESSEN anfangs fehlschlagen
- Tests definieren das Verhalten, nicht die Implementierung
- Ein Test pro Verhalten

### Phase 2: Minimale Implementierung

**Ziel:** Nur das Noetigste implementieren, um Tests zu bestehen.

```typescript
// src/components/LoginForm.tsx
export function LoginForm() {
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError('Alle Felder ausfuellen');
      return;
    }

    // Login-Logik...
  };

  return (
    <form data-testid="login-form" onSubmit={handleSubmit}>
      <input data-testid="email" name="email" />
      <input data-testid="password" name="password" type="password" />
      {error && <div data-testid="error">{error}</div>}
      <button data-testid="submit">Login</button>
    </form>
  );
}
```

**Regeln:**
- Kein Over-Engineering
- Kein "nice-to-have" Code
- Fokus auf Test-Erfuellung

### Phase 3: Screenshot-Verifikation

**Ziel:** Visuelle Korrektheit dokumentieren und bestaetigen.

```bash
# Screenshots erstellen (in Tests oder manuell)
await page.screenshot({ path: 'screenshots/pending/login-empty.png' });
await page.screenshot({ path: 'screenshots/pending/login-error.png' });
await page.screenshot({ path: 'screenshots/pending/login-success.png' });

# Screenshots registrieren
node scripts/screenshot-verifier.js register login-empty pending/login-empty.png login
node scripts/screenshot-verifier.js register login-error pending/login-error.png login
node scripts/screenshot-verifier.js register login-success pending/login-success.png login

# Screenshots visuell pruefen und verifizieren
node scripts/screenshot-verifier.js verify login-empty claude
node scripts/screenshot-verifier.js verify login-error claude
node scripts/screenshot-verifier.js verify login-success claude
```

### Phase 4: Rerun

**Ziel:** Stabilitaet bestaetigen.

```bash
npm test
# Alle Tests muessen weiterhin bestehen
```

### Phase 5: Completion Check

**Ziel:** Alle Bedingungen pruefen.

```bash
# Check ob Completion erlaubt
node scripts/screenshot-verifier.js check

# Wenn allowed: true
# UND alle Tests bestehen
# UND Rerun erfolgreich
# → <promise>TDD_COMPLETE</promise>
```

---

## Screenshot-Verifikation

### Warum Screenshots?

- **Dokumentation:** Jeder Zustand wird visuell festgehalten
- **Verifikation:** Claude muss Screenshots lesen, nicht nur Code
- **Regression:** Aenderungen sind visuell erkennbar
- **Abschluss-Kontrolle:** Verhindert "zu fruehes Fertig"

### Verzeichnisstruktur

```
screenshots/
├── pending/           # Noch nicht verifiziert
│   ├── feature-before.png
│   └── feature-after.png
├── verified/          # Verifiziert und umbenannt
│   ├── feature-before-verified.png
│   └── feature-after-verified.png
└── manifest.json      # Status-Tracking
```

### manifest.json

```json
{
  "screenshots": [
    {
      "id": "login-empty",
      "path": "verified/login-empty-verified.png",
      "status": "verified",
      "feature": "login",
      "timestamp": "2025-01-10T18:00:00Z",
      "verifiedAt": "2025-01-10T18:05:00Z",
      "verifiedBy": "claude-iteration-3"
    },
    {
      "id": "login-error",
      "path": "pending/login-error.png",
      "status": "pending",
      "feature": "login",
      "timestamp": "2025-01-10T18:02:00Z"
    }
  ],
  "allVerified": false,
  "totalCount": 2,
  "verifiedCount": 1,
  "pendingCount": 1,
  "lastUpdated": "2025-01-10T18:05:00Z"
}
```

### Screenshot-Verifier CLI

```bash
# Initialisieren
node scripts/screenshot-verifier.js init

# Status anzeigen
node scripts/screenshot-verifier.js status

# Screenshot registrieren
node scripts/screenshot-verifier.js register <id> <path> <feature>

# Screenshot verifizieren
node scripts/screenshot-verifier.js verify <id> [verifiedBy]

# Pending anzeigen
node scripts/screenshot-verifier.js pending

# Completion pruefen
node scripts/screenshot-verifier.js check

# Zuruecksetzen
node scripts/screenshot-verifier.js reset
```

### Verifikations-Workflow

1. **Screenshot erstellen**
   - Via Playwright: `page.screenshot({ path: '...' })`
   - Via Claude-in-Chrome: `computer({ action: "screenshot" })`

2. **Registrieren**
   ```bash
   node scripts/screenshot-verifier.js register login-form pending/login-form.png login
   ```

3. **Visuell lesen**
   - Claude oeffnet/liest den Screenshot
   - Analysiert Layout, Elemente, Text, Styling

4. **Verifizieren oder Ablehnen**
   ```bash
   # Wenn korrekt:
   node scripts/screenshot-verifier.js verify login-form claude

   # Wenn fehlerhaft:
   # Screenshot NICHT verifizieren, Fehler beheben
   ```

5. **Completion Check**
   ```bash
   node scripts/screenshot-verifier.js check
   # { "allowed": true/false }
   ```

---

## Prompt-Schreiben

### Best Practices

#### 1. Klare Completion-Kriterien

```markdown
❌ SCHLECHT:
"Baue Login und mach es gut."

✅ GUT:
"Baue Login.
Wenn fertig:
- Tests bestehen
- Screenshots verified
- Output: <promise>TDD_COMPLETE</promise>"
```

#### 2. Phasen definieren

```markdown
✅ GUT:
"Phase 1: Tests schreiben (fehlschlagend)
Phase 2: Minimale Implementierung
Phase 3: Screenshots verifizieren
Phase 4: Rerun
Phase 5: Completion Check"
```

#### 3. Self-Correction einbauen

```markdown
✅ GUT:
"Bei Test-Fehlschlag:
1. Fehler analysieren
2. Code korrigieren
3. Erneut testen
4. Wiederholen bis gruen"
```

#### 4. Escape Hatch

```markdown
✅ GUT:
"Nach 20 Iterationen ohne Erfolg:
- Blockade dokumentieren
- Alternativen vorschlagen
- Hilfe anfordern"
```

### Prompt-Template

Siehe: `templates/testing/ralph-prompt.template.md`

```bash
# Template kopieren und anpassen
cp templates/testing/ralph-prompt.template.md prompts/my-feature.md

# Feature-spezifisch bearbeiten
# [FEATURE_NAME], [BESCHREIBUNG], Tests, Screenshots definieren

# Loop starten
/ralph-loop "$(cat prompts/my-feature.md)" --max-iterations 30 --completion-promise "TDD_COMPLETE"
```

---

## Beispiel-Implementierung

### Szenario: Command Palette

#### 1. Prompt erstellen

```markdown
# prompts/command-palette.md

# TDD-Loop: Command Palette

## Ziel
Implementiere eine Command Palette (Cmd+K) mit Suchfunktion.

## Completion Promise
<promise>TDD_COMPLETE</promise> wenn:
1. Alle Tests bestehen
2. Alle Screenshots verified
3. Rerun erfolgreich

## Tests
- [ ] Cmd+K oeffnet Palette
- [ ] Escape schliesst Palette
- [ ] Suche filtert Befehle
- [ ] Befehl-Auswahl fuehrt Aktion aus

## Screenshots
- command-palette-closed.png
- command-palette-open.png
- command-palette-search.png
- command-palette-select.png
```

#### 2. Loop starten

```bash
/ralph-loop "$(cat prompts/command-palette.md)" \
  --max-iterations 25 \
  --completion-promise "TDD_COMPLETE"
```

#### 3. Iteration 1: Tests schreiben

```typescript
// e2e/command-palette.spec.ts
test('oeffnet mit Cmd+K', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Meta+k');
  await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();
});

test('schliesst mit Escape', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Meta+k');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-testid="command-palette"]')).not.toBeVisible();
});
```

#### 4. Iteration 2-N: Implementierung

Claude implementiert iterativ bis Tests bestehen...

#### 5. Screenshot-Verifikation

```bash
# Screenshots erstellen
# Screenshots registrieren
# Claude liest und verifiziert

node scripts/screenshot-verifier.js check
# { "allowed": true }
```

#### 6. Completion

```
Tests: PASSED
Screenshots: ALL VERIFIED
Rerun: PASSED

<promise>TDD_COMPLETE</promise>
```

---

## Troubleshooting

### Problem: Loop endet nicht

**Ursache:** Completion-Bedingungen nie erfuellt.

**Loesung:**
1. `--max-iterations` niedriger setzen
2. Bedingungen vereinfachen
3. Escape Hatch im Prompt einbauen

### Problem: Tests schlagen immer fehl

**Ursache:** Tests zu komplex oder Bugs in Implementation.

**Loesung:**
1. Tests vereinfachen
2. Einen Test nach dem anderen
3. Debug-Ausgaben hinzufuegen

### Problem: Screenshots werden nicht verified

**Ursache:** Claude liest Screenshots nicht.

**Loesung:**
1. Explizit im Prompt: "Lies JEDEN Screenshot visuell"
2. Screenshots einzeln pruefen
3. Visuelle Analyse dokumentieren

### Problem: Regressionen

**Ursache:** Aenderungen brechen bestehende Tests.

**Loesung:**
1. Rerun nach jeder Aenderung
2. Bei Regression: zurueck und fixen
3. Keine neuen Features bis stabil

### Problem: Endlosschleife

**Ursache:** Unmoeglich zu erfuellende Bedingungen.

**Loesung:**
1. `/cancel-ralph` ausfuehren
2. Prompt ueberarbeiten
3. Bedingungen realistischer machen

---

## Referenzen

- **Regel:** `rules/20-tdd-loop.md`
- **Skills:** `skills/testing/tdd-loop-*.md`
- **Scripts:** `scripts/browser-testing/screenshot-verifier.js`
- **Templates:** `templates/testing/ralph-prompt.template.md`
- **Ralph Plugin:** `anthropics/claude-code/plugins/ralph-wiggum`
- **Ralph Technique:** https://ghuntley.com/ralph/
