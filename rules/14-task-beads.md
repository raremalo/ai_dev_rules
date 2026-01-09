# Task-Tracking mit Beads

- Last Updated: 2025-01-09
- Description: Integration von Beads als distributed, Git-backed Issue-Tracker mit DAG-Dependencies für AI-Agents
- Version: 1.0

## Kernprinzip

Beads ersetzt chaotische Markdown-Pläne durch einen **dependency-aware Graph**. Agents verlieren nie den Kontext über lange Projekte.

---

## Warum Beads statt Markdown-Pläne?

| Problem mit Markdown | Beads-Lösung |
|---------------------|--------------|
| Pläne bit-rotten schnell | Issues sind verlinkt und aktuell |
| Keine echten Dependencies | DAG mit blocking/blocked-by |
| Agent verliert Fokus | `bd ready` zeigt nur actionable Tasks |
| Kein Multi-Session-Memory | Git-backed, persistiert automatisch |
| Merge-Konflikte | Hash-based IDs (bd-a1b2) |

---

## Installation

```bash
# macOS/Linux
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Projekt initialisieren
bd init

# Agent informieren
echo "Use 'bd' for task tracking" >> AGENTS.md
```

---

## MCP-Server Setup

```json
{
  "mcpServers": {
    "beads": {
      "command": "beads-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

### Oder via pip:

```bash
pip install beads-mcp
```

---

## Basis-Workflow

### 1. Issues erstellen

```bash
# Feature erstellen
bd create "Implement UserCard component" -t feature -p 1

# Task mit Dependency
bd create "Write UserCard tests" -t task -p 2 --deps "blocks:bd-a1b2"

# Epic für größere Features
bd create "Auth System" -t epic -p 1
# Child-Tasks automatisch: bd-a3f8.1, bd-a3f8.2, ...
```

### 2. Actionable Work finden

```bash
# Was ist ready? (keine offenen Blocker)
bd ready --json

# Details zu einem Issue
bd show bd-a1b2 --json
```

### 3. Status aktualisieren

```bash
# In Arbeit nehmen
bd update bd-a1b2 --status in_progress

# Abschließen
bd close bd-a1b2 --reason "Merged in PR #42"
```

### 4. Dependencies visualisieren

```bash
# Dependency-Tree anzeigen
bd dep tree bd-a3f8

# Impact-Analyse
bd dep list bd-a1b2
```

---

## AI-Agent Workflow

### Session-Start

```markdown
AI-Anfrage:
"Zeige mir mit `bd ready --json` alle unblockierten Tasks 
sortiert nach Priorität. Was sollte ich als nächstes bearbeiten?"
```

### Während der Arbeit

```markdown
AI-Anfrage:
"Aktualisiere bd-a1b2 auf 'in_progress' und erstelle 
einen Child-Task für die entdeckte Edge-Case-Behandlung"
```

### Session-Ende ("Land the Plane")

```markdown
AI-Anfrage:
"Land the plane:
1. bd create für remaining work
2. bd close für fertige Tasks
3. bd sync
4. git push (MANDATORY!)
5. git status zur Bestätigung"
```

**KRITISCH:** Niemals eine Session beenden ohne `git push`!

---

## Hierarchische Struktur

```
Epic (bd-a3f8)
├── Feature (bd-a3f8.1) 
│   ├── Task (bd-a3f8.1.1)
│   └── Task (bd-a3f8.1.2)
├── Feature (bd-a3f8.2)
└── Feature (bd-a3f8.3)
```

### Beispiel: Auth-System

```bash
# Epic erstellen
bd create "Auth System" -t epic -p 1
# → bd-a3f8

# Features als Children
bd create "Login UI" -p 1 --parent bd-a3f8
# → bd-a3f8.1

bd create "Token Refresh" -p 1 --parent bd-a3f8
# → bd-a3f8.2

# Tasks unter Feature
bd create "Login Form Component" -p 1 --parent bd-a3f8.1
# → bd-a3f8.1.1
```

---

## Dependency-Typen

| Typ | Bedeutung | Beispiel |
|-----|-----------|----------|
| `blocks` | Task A blockiert Task B | Tests blockieren Deploy |
| `blocked-by` | Task B wartet auf Task A | Deploy wartet auf Tests |
| `parent` | Hierarchische Beziehung | Feature unter Epic |
| `related` | Thematische Verbindung | Ähnliche Komponenten |

```bash
# Blocking-Dependency setzen
bd create "Deploy to prod" -p 1 --deps "blocked-by:bd-test1,bd-test2"
```

---

## Daemon-Management

Beads läuft einen Background-Daemon für Auto-Sync:

```bash
# Alle Daemons anzeigen
bd daemons list

# Health-Check
bd daemons health

# Daemon neu starten (nach bd upgrade)
bd daemons restart /path/to/workspace

# Alle stoppen
bd daemons killall
```

---

## Compaction (Memory Decay)

Alte geschlossene Issues werden zusammengefasst:

```bash
# Statistiken anzeigen
bd admin compact --stats

# Kandidaten analysieren (30+ Tage geschlossen)
bd admin compact --analyze --json

# Compaction anwenden
bd admin compact --apply --id bd-42 --summary summary.txt
```

---

## Integration mit anderen Regeln

### Mit PRD (Regel 01)

```markdown
"Erstelle aus PRD.md Feature-Breakdown als Beads-Epic 
mit Child-Issues für jedes Akzeptanzkriterium"
```

### Mit Version-Control (Regel 07)

```markdown
"Vor git commit: `bd sync` ausführen
Nach git push: Session als 'landed' markieren"
```

### Mit Context-Management (Regel 09)

```markdown
"Bei neuem Chat: `bd ready --json` für aktuellen Stand"
```

---

## AI-Anfrage Templates

### Projekt-Setup

```markdown
"Initialisiere Beads für dieses Projekt:
1. bd init
2. Erstelle Epic aus PRD.md
3. Breakdown in Features und Tasks
4. Zeige den Dependency-Tree"
```

### Daily Standup

```markdown
"Beads Standup:
1. bd ready --json (was ist actionable?)
2. bd list --status in_progress (was läuft?)
3. Empfehle nächsten Task basierend auf Priorität"
```

### Sprint-Review

```markdown
"Sprint-Summary aus Beads:
1. Alle geschlossenen Issues dieser Woche
2. Offene Blocker identifizieren
3. Velocity-Statistik (closed/created ratio)"
```

---

## Checkliste

- [ ] Beads installiert und initialisiert?
- [ ] AGENTS.md mit Beads-Hinweis?
- [ ] Epic aus PRD erstellt?
- [ ] Dependencies korrekt gesetzt?
- [ ] Session mit `bd sync + git push` beendet?
- [ ] Daemon läuft (bd daemons health)?
