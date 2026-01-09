# Hooks & Automation

- Last Updated: 2025-01-09
- Description: Automatische Trigger für AI-Actions bei definierten Events (Git, Session, File-Changes)
- Version: 1.0

## Kernprinzip

Hooks automatisieren repetitive AI-Aufgaben. Sie werden bei bestimmten Events getriggert und führen vordefinierte Aktionen aus.

---

## Hook-Typen

| Typ | Trigger | Beispiel-Aktion |
|-----|---------|-----------------|
| **Git Hooks** | commit, push, merge | Validierung, Sync |
| **Session Hooks** | Start, Ende | Context laden, Cleanup |
| **File Hooks** | Create, Change, Delete | Docs aktualisieren |
| **Task Hooks** | Beads create, close | Memory updaten |

---

## Git Hooks (Beads-Integration)

### Pre-Commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Beads-Sync vor Commit
bd sync --quiet

# Lint-Check
npm run lint

# Type-Check
npm run type-check
```

### Post-Merge Hook

```bash
#!/bin/sh
# .git/hooks/post-merge

# Beads nach Merge synchronisieren
bd sync

# Dependencies aktualisieren falls package.json geändert
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
  npm install
fi
```

### Pre-Push Hook

```bash
#!/bin/sh
# .git/hooks/pre-push

# Tests müssen passen
npm run test

# Beads final sync
bd sync
```

### Hook-Installation

```bash
# Beads installiert Hooks automatisch
bd init

# Oder manuell
cp hooks/* .git/hooks/
chmod +x .git/hooks/*
```

---

## Session Hooks

### Session-Start Hook

Definiere in `AGENTS.md` oder als Custom Instruction:

```markdown
## Session-Start Protokoll

Bei jedem neuen Chat automatisch:

1. **Context laden**
   - Cognee-Search für Projekt-Status
   - `bd ready --json` für offene Tasks
   - Letzte 5 Commits lesen

2. **Memory synchronisieren**
   - Cognee-Graph Status prüfen
   - Beads-Daemon Health-Check

3. **Kontext zusammenfassen**
   - Aktueller Stand in 3 Sätzen
   - Nächste priorisierte Aufgabe
```

### Session-End Hook ("Land the Plane")

```markdown
## Session-End Protokoll (Pflicht!)

Vor Beenden JEDER Session:

1. **Work dokumentieren**
   ```bash
   bd create "Remaining: [offene Arbeit]" -p 2
   bd close [erledigte Tasks] --reason "[Grund]"
   ```

2. **Sync ausführen**
   ```bash
   bd sync
   git add .
   git commit -m "session: [Zusammenfassung]"
   git push  # MANDATORY!
   ```

3. **Memory aktualisieren**
   - Neue Patterns in Cognee speichern
   - MILESTONES.md aktualisieren

4. **Verifizieren**
   ```bash
   git status  # Muss "up to date" zeigen
   bd ready --json  # Für nächste Session
   ```
```

---

## File-Change Hooks

### Automatische Dokumentations-Updates

```yaml
# .github/workflows/docs-sync.yml (GitHub Actions)
name: Sync Documentation

on:
  push:
    paths:
      - 'src/components/**'
      - 'src/composables/**'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update COMPONENTS.md
        run: |
          # Script das Komponenten-Register aktualisiert
          ./scripts/update-components-registry.sh
          
      - name: Commit changes
        run: |
          git add docs/COMPONENTS.md
          git commit -m "docs: auto-update components registry" || true
          git push
```

### Lokale File-Watcher (für AI-Agents)

```markdown
## File-Change Triggers

Wenn diese Dateien geändert werden, automatisch:

| Datei | Aktion |
|-------|--------|
| `src/components/*.vue` | COMPONENTS.md aktualisieren |
| `docs/PRD.md` | Cognee re-cognify |
| `package.json` | Dependency-Check ausführen |
| `.env.example` | README Setup-Section prüfen |
```

---

## Task Hooks (Beads-Events)

### Bei Task-Creation

```markdown
## Hook: Nach `bd create`

1. Prüfe Dependencies
   - Gibt es blocking Issues?
   - Ist Parent-Epic vorhanden?

2. Schätze Aufwand
   - S/M/L basierend auf Beschreibung
   - Aktualisiere Task mit Estimate

3. Aktualisiere Memory
   - Cognee: Neuen Task indexieren
```

### Bei Task-Close

```markdown
## Hook: Nach `bd close`

1. Dokumentation prüfen
   - Wurde COMPONENTS.md aktualisiert?
   - Wurden Tests hinzugefügt?

2. Pattern extrahieren
   - War es ein wiederverwendbares Pattern?
   - → In PATTERNS.md dokumentieren
   - → In Cognee speichern

3. Nächsten Task vorbereiten
   - `bd ready --json` ausführen
   - Empfehlung für nächsten Task
```

---

## Qoder-Hooks Integration

### Rule-Trigger Konfiguration

```yaml
# .qoder/config.yml
hooks:
  on_file_create:
    - pattern: "*.vue"
      rule: "apply-component-standards"
      
  on_file_change:
    - pattern: "docs/*.md"
      action: "cognee-recognify"
      
  on_session_start:
    - rule: "load-project-context"
    
  on_session_end:
    - rule: "land-the-plane"
```

### Auto-Apply Rules

```yaml
# .qoder/rules/always/auto-triggers.md
# Auto-Trigger Rules

## Bei neuer Komponente
Wenn eine neue `.vue` Datei erstellt wird:
1. Prüfe Naming (Regel 04)
2. Wende UI-Stack an (Regel 05)
3. Erstelle Test-Stub

## Bei API-Änderung
Wenn `api/` geändert wird:
1. TypeScript-Types aktualisieren
2. OpenAPI-Spec generieren
3. Postman-Collection updaten
```

---

## Kombinierte Hook-Chains

### Feature-Complete Hook-Chain

```markdown
## Trigger: Feature als "done" markiert

Chain:
1. **Validation**
   - Tests passen? (npm test)
   - Types korrekt? (npm run type-check)
   - Lint clean? (npm run lint)

2. **Documentation**
   - COMPONENTS.md aktuell?
   - Storybook-Stories vorhanden?
   - API-Docs generiert?

3. **Memory**
   - Cognee: Feature-Docs indexieren
   - Beads: Child-Tasks schließen

4. **Git**
   - Feature-Branch mergen
   - Tag erstellen
   - Release-Notes generieren

5. **Notification**
   - MILESTONES.md aktualisieren
   - Team informieren (optional)
```

---

## Custom Hook erstellen

### Template

```markdown
# Hook: [Name]

## Trigger
[Wann wird der Hook ausgelöst?]

## Bedingungen
[Unter welchen Umständen ausführen?]

## Aktionen
1. [Aktion 1]
2. [Aktion 2]
3. [Aktion 3]

## Fehlerbehandlung
[Was tun wenn Aktion fehlschlägt?]

## Logging
[Was wird protokolliert?]
```

---

## Checkliste

- [ ] Git Hooks installiert (bd init)?
- [ ] Session-Start Protokoll in AGENTS.md?
- [ ] Session-End "Land the Plane" dokumentiert?
- [ ] File-Change Triggers definiert?
- [ ] Beads-Task Hooks konfiguriert?
- [ ] Hook-Chains für komplexe Workflows?
