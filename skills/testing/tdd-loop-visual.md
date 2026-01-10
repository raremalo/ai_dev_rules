# TDD-Loop Visual Verification Skill

- Last Updated: 2025-01-10
- Description: Screenshot-Verifikationsprotokoll fuer TDD-Loop Pattern
- Version: 1.0
- Dependencies: [20-tdd-loop], screenshot-verifier.js, [19-browser-testing]

## Kontext

Verwende diesen Skill wenn:
- Screenshots waehrend TDD-Loop verifiziert werden muessen
- manifest.json Status geprueft werden soll
- Visuelle Regression erkannt werden muss
- Completion-Bedingungen validiert werden sollen

## Voraussetzungen

- TDD-Loop Setup abgeschlossen
- screenshot-verifier.js installiert
- Screenshots in `screenshots/pending/` vorhanden

## Workflow

### Schritt 1: Pending Screenshots identifizieren

```bash
# Via CLI
node scripts/screenshot-verifier.js pending

# Oder Status pruefen
node scripts/screenshot-verifier.js status
```

Ausgabe:
```json
{
  "allVerified": false,
  "totalCount": 4,
  "verifiedCount": 1,
  "pendingCount": 3,
  "screenshots": [
    { "id": "login-form-empty", "status": "pending" },
    { "id": "login-form-error", "status": "pending" },
    { "id": "login-success", "status": "verified" }
  ]
}
```

### Schritt 2: Screenshot visuell lesen

Fuer JEDEN pending Screenshot:

```markdown
1. Screenshot-Datei oeffnen/lesen
2. Visuell analysieren:
   - Layout korrekt?
   - Elemente sichtbar?
   - Text lesbar?
   - Keine visuellen Fehler?
3. Entscheidung: verified oder Fehler melden
```

### Schritt 3: Als verified markieren

```bash
# Via CLI
node scripts/screenshot-verifier.js verify login-form-empty claude-iteration-5

# Via Script
const verifier = require('./scripts/screenshot-verifier');
verifier.verifyScreenshot('login-form-empty', 'claude-iteration-5');
```

### Schritt 4: Completion Check

```bash
node scripts/screenshot-verifier.js check
```

Ausgabe wenn NICHT bereit:
```json
{
  "allowed": false,
  "totalCount": 4,
  "verifiedCount": 2,
  "pendingCount": 2,
  "pendingScreenshots": ["login-form-error", "login-validation"],
  "reason": "2 screenshot(s) still pending: login-form-error, login-validation"
}
```

Ausgabe wenn BEREIT:
```json
{
  "allowed": true,
  "totalCount": 4,
  "verifiedCount": 4,
  "pendingCount": 0,
  "pendingScreenshots": []
}
```

### Schritt 5: Completion Promise (nur wenn allowed)

```markdown
PRUEFE:
- completion.allowed === true?
- Alle Tests bestanden?
- Rerun erfolgreich?

Wenn JA: <promise>TDD_COMPLETE</promise>
Wenn NEIN: Weiter iterieren
```

## Templates

### Screenshot-Verifikations-Checklist

```markdown
## Screenshot: [ID]

**Datei:** screenshots/pending/[filename].png
**Feature:** [Feature-Name]
**Zustand:** [before/after/error/success]

### Visuelle Pruefung

- [ ] Layout entspricht Erwartung
- [ ] Alle Elemente sichtbar
- [ ] Text lesbar und korrekt
- [ ] Farben/Styling korrekt
- [ ] Keine Ueberlappungen
- [ ] Responsive (falls relevant)
- [ ] Keine Console-Errors sichtbar

### Entscheidung

- [ ] **VERIFIED** - Screenshot ist korrekt
- [ ] **REJECTED** - Fehler gefunden: [Beschreibung]

### Aktion

```bash
# Wenn verified:
node scripts/screenshot-verifier.js verify [ID] claude
```
```

### Verifikations-Report

```markdown
# Screenshot Verifikations-Report

**Iteration:** [N]
**Datum:** [TIMESTAMP]

## Status

| Screenshot | Status | Geprueft | Notizen |
|------------|--------|----------|---------|
| login-empty | verified | ✓ | Layout OK |
| login-error | verified | ✓ | Error-Message sichtbar |
| login-success | pending | | Noch zu pruefen |

## Completion Check

- Total: 3
- Verified: 2
- Pending: 1
- **Completion erlaubt:** NEIN

## Naechste Schritte

1. Screenshot `login-success` pruefen
2. Nach Verifikation: Completion Check erneut
```

## Beispiele

### Beispiel 1: Einzelnen Screenshot verifizieren

```markdown
Claude liest Screenshot `screenshots/pending/login-form.png`:

Analyse:
- Login-Formular sichtbar: ✓
- Email-Feld vorhanden: ✓
- Password-Feld vorhanden: ✓
- Submit-Button sichtbar: ✓
- Layout zentriert: ✓
- Keine visuellen Fehler: ✓

Entscheidung: VERIFIED

Aktion:
```bash
node scripts/screenshot-verifier.js verify login-form claude-iteration-3
```
```

### Beispiel 2: Fehler im Screenshot erkennen

```markdown
Claude liest Screenshot `screenshots/pending/dashboard.png`:

Analyse:
- Header sichtbar: ✓
- Navigation sichtbar: ✓
- Hauptbereich: ✗ FEHLER
  - Daten werden nicht angezeigt
  - Loading-Spinner haengt
- Footer: nicht sichtbar (Scroll?)

Entscheidung: REJECTED

Aktion:
- Screenshot NICHT verifizieren
- Fehler beheben
- Neuen Screenshot erstellen
- Erneut pruefen
```

### Beispiel 3: Batch-Verifikation

```markdown
Claude verifiziert mehrere Screenshots:

1. `form-empty.png` → VERIFIED
2. `form-filled.png` → VERIFIED
3. `form-error.png` → VERIFIED
4. `form-success.png` → REJECTED (Redirect nicht sichtbar)

Aktionen:
```bash
node scripts/screenshot-verifier.js verify form-empty claude
node scripts/screenshot-verifier.js verify form-filled claude
node scripts/screenshot-verifier.js verify form-error claude
# form-success: Fehler beheben, neuer Screenshot
```

Status nach Batch:
- 3/4 verified
- Completion: NICHT erlaubt
```

## Integration mit Claude-in-Chrome

### Screenshot erstellen und registrieren

```javascript
// 1. Screenshot via Claude-in-Chrome
computer({ action: "screenshot", tabId: tabId });
// -> Screenshot-ID erhalten: ss_abc123

// 2. Screenshot speichern
// (manuell oder via download)

// 3. Im Manifest registrieren
const verifier = require('./scripts/screenshot-verifier');
verifier.registerScreenshot(
  'feature-state-1',
  'pending/feature-state-1.png',
  'login-feature'
);
```

### Visuell pruefen mit Claude

```javascript
// Screenshot lesen
read({ file_path: 'screenshots/pending/feature-state-1.png' });

// Claude analysiert visuell...

// Wenn OK, verifizieren
verifier.verifyScreenshot('feature-state-1', 'claude');
```

## Anti-Patterns

### NIEMALS

```markdown
# Screenshots ohne Lesen verifizieren
verifyScreenshot('id', 'claude');  // Ohne Screenshot zu sehen!

# Completion Promise ohne Check
<promise>TDD_COMPLETE</promise>  // Ohne checkCompletionAllowed()!

# Fehler ignorieren
"Screenshot sieht OK genug aus"  // FALSCH!
```

### IMMER

```markdown
# JEDEN Screenshot visuell lesen
read({ file_path: 'screenshots/pending/[file].png' });

# Gruendlich analysieren
# Layout, Elemente, Text, Styling pruefen

# Erst nach Analyse verifizieren
verifyScreenshot('id', 'claude-iteration-N');

# Completion nur wenn allowed
const check = checkCompletionAllowed();
if (check.allowed) { /* Completion Promise */ }
```

## Checkliste

- [ ] Alle pending Screenshots identifiziert?
- [ ] JEDEN Screenshot visuell gelesen?
- [ ] Gruendliche visuelle Analyse durchgefuehrt?
- [ ] Korrekte Screenshots als verified markiert?
- [ ] Fehlerhafte Screenshots NICHT verifiziert?
- [ ] manifest.json aktualisiert?
- [ ] checkCompletionAllowed() geprueft?
- [ ] Completion Promise NUR wenn allowed?
