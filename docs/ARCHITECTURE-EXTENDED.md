# Erweiterte Architektur: AI Development Ecosystem

Dieses Dokument beschreibt die Gesamtarchitektur des AI-Development-Systems mit allen Integrationen.

## System-Übersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI DEVELOPMENT ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MCP SERVER LAYER                              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ agent-rules  │  │   cognee     │  │    beads     │              │   │
│  │  │    -mcp      │  │    -mcp      │  │    -mcp      │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │  • Rules     │  │  • Memory    │  │  • Tasks     │              │   │
│  │  │  • Skills    │  │  • Knowledge │  │  • Issues    │              │   │
│  │  │  • Patterns  │  │  • Graph     │  │  • DAG       │              │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │   │
│  │         │                 │                 │                       │   │
│  └─────────┼─────────────────┼─────────────────┼───────────────────────┘   │
│            │                 │                 │                            │
│            ▼                 ▼                 ▼                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        AI CLIENT LAYER                               │   │
│  │                                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Claude  │  │  Cursor  │  │   Kiro   │  │ Windsurf │            │   │
│  │  │ Desktop  │  │   IDE    │  │   IDE    │  │   IDE    │            │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │   │
│  │       │             │             │             │                   │   │
│  └───────┼─────────────┼─────────────┼─────────────┼───────────────────┘   │
│          │             │             │             │                        │
│          ▼             ▼             ▼             ▼                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        LOCAL PROJECT LAYER                           │   │
│  │                                                                      │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │   │
│  │  │     Qoder      │  │   Git Hooks    │  │   File System  │        │   │
│  │  │  .qoder/rules/ │  │  .git/hooks/   │  │   src/, docs/  │        │   │
│  │  │                │  │                │  │                │        │   │
│  │  │  • Overrides   │  │  • pre-commit  │  │  • Components  │        │   │
│  │  │  • Local Rules │  │  • post-merge  │  │  • PRD.md      │        │   │
│  │  │  • @rule cmds  │  │  • pre-push    │  │  • PATTERNS.md │        │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Datenfluss

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   USER      │────▶│  AI CLIENT  │────▶│ MCP SERVERS │
│  Request    │     │ (Cursor etc)│     │             │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   RULES     │     │   MEMORY    │
                    │ (agent-mcp) │     │  (cognee)   │
                    └──────┬──────┘     └──────┬──────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   TASKS     │     │    CODE     │
                    │  (beads)    │     │  CHANGES    │
                    └──────┬──────┘     └──────┬──────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────────────────────────┐
                    │           GIT REPOSITORY        │
                    │  • Code  • .beads/  • docs/     │
                    └─────────────────────────────────┘
```

## Komponenten-Verantwortlichkeiten

### agent-rules-mcp
**Zweck:** Zentrale Regel- und Skill-Verwaltung

| Funktion | Beschreibung |
|----------|--------------|
| `list_rules` | Zeigt alle verfügbaren Regeln |
| `get_rules` | Lädt spezifische Regeln |
| Rules | 01-16 Basis-Regeln |
| Skills | Wiederverwendbare Workflows |

### cognee-mcp
**Zweck:** Persistentes AI-Gedächtnis

| Funktion | Beschreibung |
|----------|--------------|
| `cognify` | Dokumente → Knowledge Graph |
| `codify` | Code → Code Graph |
| `search` | Context-aware Suche |
| `prune` | Graph optimieren |

### beads-mcp
**Zweck:** Task-Tracking mit Dependencies

| Funktion | Beschreibung |
|----------|--------------|
| `bd create` | Neue Issues/Tasks |
| `bd ready` | Actionable Work finden |
| `bd close` | Tasks abschließen |
| `bd sync` | Git-Synchronisation |

### Qoder (Lokal)
**Zweck:** Projekt-spezifische Overrides

| Funktion | Beschreibung |
|----------|--------------|
| always-apply | Immer aktive Regeln |
| specific-files | Datei-Pattern-basiert |
| manual | Via @rule Befehl |

### Git Hooks (Lokal)
**Zweck:** Automatische Trigger

| Hook | Aktion |
|------|--------|
| pre-commit | Lint, Type-Check, bd sync |
| post-merge | Dependency-Update |
| pre-push | Tests, Final sync |

---

## Session-Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                      SESSION LIFECYCLE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SESSION START                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Load Rules (agent-rules-mcp)                          │   │
│  │ 2. Query Memory (cognee: search)                         │   │
│  │ 3. Get Ready Tasks (beads: bd ready --json)              │   │
│  │ 4. Summarize Context                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  DURING SESSION                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Apply Rules for each task                              │   │
│  │ • Load Skills as needed                                  │   │
│  │ • Update task status (beads)                             │   │
│  │ • Save patterns to memory (cognee)                       │   │
│  │ • Git commits after milestones                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  SESSION END ("Land the Plane")                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Create tasks for remaining work (beads)               │   │
│  │ 2. Close completed tasks (beads)                         │   │
│  │ 3. Update documentation                                  │   │
│  │ 4. Save new patterns (cognee)                            │   │
│  │ 5. bd sync                                               │   │
│  │ 6. git commit                                            │   │
│  │ 7. git push (MANDATORY!)                                 │   │
│  │ 8. Verify: git status                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integrations-Matrix

| Integration | agent-rules | cognee | beads | qoder | git-hooks |
|-------------|:-----------:|:------:|:-----:|:-----:|:---------:|
| Rules laden | ✅ Primary | | | ✅ Override | |
| Memory speichern | | ✅ Primary | | | |
| Tasks tracken | | | ✅ Primary | | |
| Auto-Trigger | | | | | ✅ Primary |
| Session-Start | ✅ | ✅ | ✅ | | |
| Session-End | | ✅ | ✅ | | ✅ |
| Pre-Commit | | | ✅ | | ✅ |

---

## Failover-Strategie

```
Wenn MCP-Server nicht erreichbar:

agent-rules-mcp ─── FAIL ───▶ Fallback: Lokale Qoder-Regeln
                                    │
cognee-mcp ──────── FAIL ───▶ Fallback: Manuelle Context-Übergabe
                                    │
beads-mcp ───────── FAIL ───▶ Fallback: Direct CLI (bd commands)
```

---

## Erweiterungspunkte

### Neue MCP-Server hinzufügen
1. Server in `mcp-config.json` registrieren
2. Regel in `rules/` erstellen für Integration
3. Hooks in `rules/16-hooks-automation.md` erweitern

### Neue Skills hinzufügen
1. Skill-Datei in `skills/[category]/` erstellen
2. Template aus `rules/15-skills-system.md` folgen
3. In `README.md` dokumentieren

### Neue Hooks hinzufügen
1. Hook-Definition in `rules/16-hooks-automation.md`
2. Implementation in `.git/hooks/` oder Qoder-Config
3. Testen und dokumentieren
