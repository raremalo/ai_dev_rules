# TDD-Loop Setup Skill

- Last Updated: 2025-01-10
- Description: Einrichtung und Konfiguration des Ralph-Wiggum TDD-Loop Patterns
- Version: 1.0
- Dependencies: [20-tdd-loop], Ralph-Wiggum Plugin

## Kontext

Verwende diesen Skill wenn:
- Ein neues Projekt fuer TDD-Loop eingerichtet werden soll
- Ralph-Wiggum Plugin konfiguriert werden muss
- Screenshot-Verifikation aufgesetzt werden soll
- Playwright/Test-Framework integriert werden soll

## Voraussetzungen

- Claude Code installiert
- Node.js >= 18
- Git Repository initialisiert

## Workflow

### Schritt 1: Ralph-Wiggum Plugin pruefen

```bash
# Verfuegbarkeit pruefen
/help ralph

# Erwartete Ausgabe:
# /ralph-loop - Start a Ralph loop
# /cancel-ralph - Cancel active loop
```

Falls nicht verfuegbar:
```bash
# Plugin ist Teil von Claude Code
# Stelle sicher, dass Claude Code aktuell ist
```

### Schritt 2: Projekt-Struktur erstellen

```bash
mkdir -p e2e
mkdir -p screenshots/pending
mkdir -p screenshots/verified
mkdir -p prompts
```

### Schritt 3: Screenshot-Verifier installieren

```bash
# Kopiere screenshot-verifier.js in Projekt
cp scripts/browser-testing/screenshot-verifier.js ./scripts/

# Initialisiere Struktur
node scripts/screenshot-verifier.js init
```

### Schritt 4: Test-Framework einrichten

#### Option A: Playwright

```bash
npm init playwright@latest

# playwright.config.ts anpassen:
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './screenshots/pending',
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

#### Option B: Claude-in-Chrome

```markdown
# Nutze bestehendes Browser-Testing Framework
# Siehe: rules/19-browser-testing.md
# Scripts: scripts/browser-testing/*.js
```

### Schritt 5: Prompt-Template erstellen

```bash
# Erstelle Feature-spezifischen Prompt
touch prompts/feature-x.md
```

```markdown
# prompts/feature-x.md

# TDD-Loop: Feature X

## Ziel
[Feature-Beschreibung hier]

## Completion Promise
Gib <promise>TDD_COMPLETE</promise> ERST aus, wenn:
1. Alle Tests in `e2e/` bestehen
2. Alle Screenshots in `screenshots/manifest.json` status="verified"
3. Ein finaler Rerun alle Tests bestaetigt

## Phase 1: Tests schreiben
- Erstelle Tests in `e2e/feature-x.spec.ts`
- Tests MUESSEN anfangs fehlschlagen
- Screenshots: vorher/nachher pro Zustand

## Phase 2: Minimale Implementierung
- Implementiere NUR was noetig ist
- Keine Over-Engineering

## Phase 3: Screenshot-Verifikation
- Erstelle Screenshots fuer jeden Zustand
- Lies JEDEN Screenshot visuell
- Markiere mit "verified" wenn korrekt
- Update manifest.json

## Phase 4: Rerun
- Tests erneut ausfuehren
- Stabilitaet bestaetigen

## Phase 5: Completion Check
- [ ] Alle Tests bestehen?
- [ ] manifest.allVerified === true?
- [ ] Rerun erfolgreich?

Wenn ALLE JA: <promise>TDD_COMPLETE</promise>
```

### Schritt 6: package.json Scripts hinzufuegen

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "screenshots:status": "node scripts/screenshot-verifier.js status",
    "screenshots:check": "node scripts/screenshot-verifier.js check",
    "screenshots:reset": "node scripts/screenshot-verifier.js reset"
  }
}
```

### Schritt 7: Loop starten

```bash
/ralph-loop "$(cat prompts/feature-x.md)" \
  --max-iterations 30 \
  --completion-promise "TDD_COMPLETE"
```

## Templates

### Basis-Projektstruktur

```
project/
├── e2e/
│   └── feature-x.spec.ts
├── screenshots/
│   ├── pending/
│   ├── verified/
│   └── manifest.json
├── prompts/
│   └── feature-x.md
├── scripts/
│   └── screenshot-verifier.js
├── playwright.config.ts
└── package.json
```

### Empfohlene .gitignore Ergaenzungen

```gitignore
# Screenshots (optional - je nach Projekt)
screenshots/pending/
screenshots/verified/

# Aber manifest.json tracken
!screenshots/manifest.json

# Playwright
test-results/
playwright-report/
```

## Beispiele

### Beispiel 1: Neues Feature einrichten

```bash
# 1. Prompt erstellen
cat > prompts/auth-login.md << 'EOF'
# TDD-Loop: Login Feature

## Ziel
Implementiere Login-Formular mit Email/Password.

## Completion Promise
<promise>TDD_COMPLETE</promise> wenn:
- Login-Tests bestehen
- Alle Screenshots verified
- Rerun erfolgreich

## Tests
- [ ] Formular rendert
- [ ] Validierung funktioniert
- [ ] Login erfolgreich redirected
- [ ] Login fehlgeschlagen zeigt Error

## Screenshots
- login-form-empty.png
- login-form-validation-error.png
- login-form-success.png
- login-form-error.png
EOF

# 2. Loop starten
/ralph-loop "$(cat prompts/auth-login.md)" \
  --max-iterations 25 \
  --completion-promise "TDD_COMPLETE"
```

### Beispiel 2: Bestehendes Feature erweitern

```bash
# Screenshots zuruecksetzen fuer neuen Test-Run
npm run screenshots:reset

# Neuen Prompt fuer Erweiterung
/ralph-loop "Erweitere Login um 'Passwort vergessen' Link.
Tests + Screenshots required.
<promise>DONE</promise> wenn fertig." \
  --max-iterations 15 \
  --completion-promise "DONE"
```

## Anti-Patterns

### NIEMALS

```bash
# Ohne max-iterations starten
/ralph-loop "Baue etwas..."  # Endlosschleife moeglich!

# Vage Completion-Kriterien
/ralph-loop "Mach es fertig wenn gut"  # Was ist "gut"?

# Tests ueberspringen
# "Screenshots reichen aus"  # FALSCH!
```

### IMMER

```bash
# Mit Sicherheitslimit
/ralph-loop "..." --max-iterations 30

# Klare Kriterien
# "Tests bestehen UND Screenshots verified"

# Tests ZUERST schreiben
# Tests MUESSEN anfangs fehlschlagen
```

## Checkliste

- [ ] Ralph-Wiggum Plugin verfuegbar (`/help ralph`)?
- [ ] Projekt-Struktur erstellt?
- [ ] screenshot-verifier.js installiert?
- [ ] Test-Framework eingerichtet?
- [ ] Prompt-Template erstellt?
- [ ] package.json Scripts hinzugefuegt?
- [ ] Loop gestartet mit --max-iterations?
