# Version Control als Sicherheitsnetz

- Last Updated: 2025-01-09
- Description: Git-Workflow-Regeln für sichere AI-gestützte Entwicklung mit Rollback-Möglichkeit
- Version: 1.0

## Kernprinzip

Git ist dein Sicherheitsnetz. Committe **vor** jedem AI-Experiment, damit du jederzeit zurück kannst.

---

## Commit-Strategie

### Vor AI-Session
```bash
# Aktuellen Stand sichern
git add .
git commit -m "checkpoint: vor AI-Session"
```

### Nach erfolgreicher Implementierung
```bash
git add .
git commit -m "feat(component): UserCard mit Status-Indikator

- Avatar mit Online-Dot
- Hover-State mit Shadow
- TypeScript-Interface
- Storybook-Story

AI-assisted: Claude"
```

### Bei fehlgeschlagenem Experiment
```bash
# Zurück zum letzten Checkpoint
git checkout .
# oder selektiv
git checkout -- src/components/UserCard.vue
```

---

## Commit-Message Format

```
<type>(<scope>): <kurze Beschreibung>

[Optional: Längere Beschreibung]

AI-assisted: <Agent-Name>
```

### Types
| Type | Verwendung |
|------|------------|
| `feat` | Neues Feature |
| `fix` | Bugfix |
| `refactor` | Code-Umstrukturierung |
| `style` | Formatting, keine Logik-Änderung |
| `docs` | Dokumentation |
| `test` | Tests hinzufügen/ändern |
| `chore` | Tooling, Dependencies |
| `checkpoint` | Zwischenstand vor Experiment |

---

## Branch-Strategie für AI-Experimente

```bash
# Für größere Experimente: eigener Branch
git checkout -b experiment/dashboard-refactor

# AI macht Änderungen...
# Nach Erfolg:
git checkout main
git merge experiment/dashboard-refactor

# Nach Fehlschlag:
git checkout main
git branch -D experiment/dashboard-refactor
```

---

## Stash für schnelle Experimente

```bash
# Aktuelle Änderungen zwischenspeichern
git stash push -m "WIP: vor AI-Experiment"

# AI macht Änderungen...

# Bei Fehlschlag: Stash wiederherstellen
git checkout .
git stash pop
```

---

## Atomic Commits

Jede logische Einheit = ein Commit:

```bash
# ❌ Falsch: Alles in einem Commit
git add .
git commit -m "Dashboard fertig"

# ✅ Richtig: Atomare Commits
git add src/components/DashboardHeader.vue
git commit -m "feat(dashboard): Header mit Navigation"

git add src/components/DashboardStats.vue
git commit -m "feat(dashboard): Stats-Cards mit KPIs"

git add src/composables/useDashboardData.ts
git commit -m "feat(dashboard): Data-Fetching Composable"
```

---

## Gefährliche Operationen

### Vor Refactoring
```bash
# IMMER zuerst committen
git add .
git commit -m "checkpoint: vor Refactoring von auth-system"

# Dann AI-Refactoring starten
```

### Vor Dependency-Updates
```bash
git add .
git commit -m "checkpoint: vor dependency-updates"

# Dann Updates
npm update
npm audit fix

# Bei Problemen
git checkout package.json package-lock.json
npm install
```

---

## Recovery-Befehle

```bash
# Letzte Änderungen verwerfen (nicht committed)
git checkout .

# Letzten Commit rückgängig (behalte Änderungen)
git reset --soft HEAD~1

# Letzten Commit komplett rückgängig
git reset --hard HEAD~1

# Zu spezifischem Commit zurück
git log --oneline  # Hash finden
git checkout <hash>

# Gelöschte Datei wiederherstellen
git checkout HEAD -- path/to/file.vue
```

---

## Session-Abschluss

Am Ende jeder AI-Session:

```bash
# 1. Alles committen
git add .
git commit -m "session: [Datum] [Zusammenfassung]

Implementiert:
- Feature A
- Feature B

Offen:
- Bug in Feature C

AI-assisted: Claude"

# 2. Optional: Push
git push origin main
```

---

## Checkliste

- [ ] Vor AI-Session committed?
- [ ] Experiment-Branch für größere Änderungen?
- [ ] Atomic Commits (eine Änderung = ein Commit)?
- [ ] Commit-Messages beschreibend?
- [ ] "AI-assisted" Tag in Messages?
- [ ] Session am Ende sauber abgeschlossen?
