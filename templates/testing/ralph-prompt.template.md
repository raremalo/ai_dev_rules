# TDD-Loop: [FEATURE_NAME]

<!--
ANLEITUNG:
1. Ersetze [FEATURE_NAME] mit dem Feature-Namen
2. Fuege Feature-Beschreibung unter "Ziel" ein
3. Definiere spezifische Tests unter "Tests"
4. Liste erwartete Screenshots unter "Screenshots"
5. Speichere als prompts/[feature-name].md
6. Starte mit: /ralph-loop "$(cat prompts/[feature-name].md)" --max-iterations 30 --completion-promise "TDD_COMPLETE"
-->

## Ziel

[FEATURE_BESCHREIBUNG]

<!--
Beispiel:
Implementiere ein Login-Formular mit Email/Password Authentifizierung.
Das Formular soll Validierung haben und bei Erfolg zum Dashboard weiterleiten.
-->

---

## Completion Promise

Gib `<promise>TDD_COMPLETE</promise>` **ERST** aus, wenn **ALLE** Bedingungen erfuellt sind:

1. ✅ Alle Tests in `e2e/` bestehen
2. ✅ Alle Screenshots in `screenshots/manifest.json` haben `status: "verified"`
3. ✅ Ein finaler Rerun bestaetigt stabilen Zustand

**NIEMALS** Completion Promise ausgeben wenn:
- ❌ Tests fehlschlagen
- ❌ Screenshots mit `status: "pending"` existieren
- ❌ Screenshots nicht visuell geprueft wurden

---

## Phase 1: Tests schreiben

### Testdatei erstellen

```typescript
// e2e/[FEATURE_NAME].spec.ts
import { test, expect } from '@playwright/test';

test.describe('[FEATURE_NAME]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // TODO: Tests hier definieren
});
```

### Erforderliche Tests

<!--
Definiere spezifische Tests fuer das Feature.
Tests MUESSEN anfangs fehlschlagen!
-->

- [ ] Test 1: [BESCHREIBUNG]
- [ ] Test 2: [BESCHREIBUNG]
- [ ] Test 3: [BESCHREIBUNG]
- [ ] Test 4: [BESCHREIBUNG]

### Beispiel-Tests

```typescript
test('rendert [ELEMENT]', async ({ page }) => {
  await expect(page.locator('[data-testid="[ELEMENT]"]')).toBeVisible();
});

test('[AKTION] funktioniert', async ({ page }) => {
  await page.click('[data-testid="[BUTTON]"]');
  await expect(page.locator('[data-testid="[RESULT]"]')).toBeVisible();
});

test('zeigt Fehler bei [BEDINGUNG]', async ({ page }) => {
  await page.fill('[data-testid="input"]', '[UNGUELTIG]');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('[data-testid="error"]')).toBeVisible();
});
```

---

## Phase 2: Minimale Implementierung

### Regeln

- Implementiere **NUR** was noetig ist, um Tests zu bestehen
- **Kein** Over-Engineering
- **Kein** "nice-to-have" Code
- Fokus auf **funktionierende** Tests

### Schritte

1. Test ausfuehren (fehlschlagend)
2. Minimalen Code schreiben
3. Test erneut ausfuehren
4. Wenn bestanden: naechster Test
5. Wenn fehlgeschlagen: Code anpassen

---

## Phase 3: Screenshot-Verifikation

### Erforderliche Screenshots

<!--
Definiere Screenshots fuer jeden wichtigen Zustand.
Format: [ID] - [BESCHREIBUNG]
-->

| ID | Beschreibung | Zustand |
|----|--------------|---------|
| `[FEATURE]-initial` | Ausgangszustand | before |
| `[FEATURE]-[STATE1]` | [BESCHREIBUNG] | during |
| `[FEATURE]-[STATE2]` | [BESCHREIBUNG] | during |
| `[FEATURE]-success` | Erfolgszustand | after |
| `[FEATURE]-error` | Fehlerzustand | error |

### Screenshot-Workflow

1. **Erstellen:** Screenshot in `screenshots/pending/` speichern
2. **Registrieren:**
   ```bash
   node scripts/screenshot-verifier.js register [ID] pending/[FILE].png [FEATURE]
   ```
3. **Lesen:** Screenshot visuell oeffnen und analysieren
4. **Verifizieren:**
   ```bash
   node scripts/screenshot-verifier.js verify [ID] claude
   ```
5. **Wiederholen:** Fuer JEDEN Screenshot

### Visuelle Pruefung

Fuer jeden Screenshot pruefen:
- [ ] Layout entspricht Erwartung
- [ ] Alle Elemente sichtbar
- [ ] Text lesbar und korrekt
- [ ] Keine visuellen Fehler
- [ ] Styling korrekt

---

## Phase 4: Rerun

### Test-Ausfuehrung

```bash
npm test
# oder
npx playwright test
```

### Erwartetes Ergebnis

- Alle Tests: ✅ PASSED
- Keine Regressionen
- Stabiler Zustand

### Bei Fehlschlag

1. Fehler analysieren
2. Code korrigieren
3. Erneut testen
4. Screenshots aktualisieren wenn noetig
5. Screenshots erneut verifizieren

---

## Phase 5: Completion Check

### Automatischer Check

```bash
node scripts/screenshot-verifier.js check
```

### Manuelle Checkliste

- [ ] **Alle Tests bestehen?**
  ```bash
  npm test  # Alle gruen?
  ```

- [ ] **Alle Screenshots verified?**
  ```bash
  node scripts/screenshot-verifier.js status
  # allVerified: true?
  ```

- [ ] **Rerun erfolgreich?**
  ```bash
  npm test  # Immer noch gruen?
  ```

### Entscheidung

```
Wenn ALLE drei Bedingungen erfuellt:
  → <promise>TDD_COMPLETE</promise>

Wenn EINE Bedingung nicht erfuellt:
  → Weiter iterieren
  → Zurueck zu Phase 1, 2, 3 oder 4 je nach Problem
```

---

## Escape Hatch

Nach **20 Iterationen** ohne Completion, wenn blockiert:

1. Dokumentiere was blockiert
2. Liste bisherige Loesungsversuche
3. Schlage alternative Ansaetze vor
4. Frage nach menschlicher Hilfe

---

## Hinweise

- Diese Prompt-Datei wird bei jeder Iteration erneut gelesen
- Dein vorheriger Code existiert weiterhin in den Dateien
- Lies deine eigenen Aenderungen um fortzufahren
- Git-History zeigt deinen Fortschritt

---

<!--
LOOP STARTEN:
/ralph-loop "$(cat prompts/[FEATURE_NAME].md)" --max-iterations 30 --completion-promise "TDD_COMPLETE"
-->
