# AI Development Rules System

[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://github.com/4regab/agent-rules-mcp)
[![Cognee Integration](https://img.shields.io/badge/Cognee-Memory-green)](https://docs.cognee.ai)
[![Beads Integration](https://img.shields.io/badge/Beads-Tasks-orange)](https://github.com/steveyegge/beads)

Ein vollständiges Regel-System für AI-gestützte Softwareentwicklung mit **persistentem Memory** (Cognee), **Task-Tracking** (Beads), **Skills** und **Hooks**.

## 🚀 Schnellstart

### Option 1: NPX (Empfohlen)

```bash
# Interaktiver Setup-Wizard
npx ai-dev-rules setup

# MCP Setup (Cursor, Claude Desktop, Kiro)
npx ai-dev-rules setup --mcp

# Export zu einem Format
npx ai-dev-rules setup --format cursor

# Export zu allen IDE-Formaten
npx ai-dev-rules setup --all

# Installation verifizieren
npx ai-dev-rules verify
```

### Option 2: Shell-Script (Sicher)

```bash
# Schritt 1: Script herunterladen
curl -fsSL https://raw.githubusercontent.com/raremalo/ai_dev_rules/master/scripts/setup.sh -o /tmp/setup.sh

# Schritt 2: Script prüfen (Security Best Practice)
less /tmp/setup.sh

# Schritt 3: Ausführen
bash /tmp/setup.sh        # Interaktiv
bash /tmp/setup.sh mcp    # MCP Setup
bash /tmp/setup.sh all    # Alle Formate
```

### Unterstützte IDEs & Tools

| IDE/Tool | Format | NPX Command |
|----------|--------|-------------|
| Cursor | `.cursorrules` | `npx ai-dev-rules setup -f cursor` |
| VS Code + Copilot | `.github/copilot-instructions.md` | `npx ai-dev-rules setup -f copilot` |
| Claude Desktop | MCP | `npx ai-dev-rules setup --mcp` |
| Windsurf | `.windsurfrules` | `npx ai-dev-rules setup -f windsurf` |
| Zed | `.zed/rules.md` | `npx ai-dev-rules setup -f zed` |
| Cline | `.clinerules` | `npx ai-dev-rules setup -f cline` |
| Kiro | MCP | `npx ai-dev-rules setup --mcp` |
| Verdent | MCP + `AGENTS.md` | `npx ai-dev-rules setup --mcp` |

### Option 3: Mit dotagent

```bash
# dotagent installieren
npm install -g dotagent

# Repository klonen
git clone https://github.com/raremalo/ai_dev_rules.git
cd ai_dev_rules

# Zu allen Formaten exportieren
dotagent export --formats all
```

### Option 4: MCP Server (Dynamisch)

```json
{
  "mcpServers": {
    "ai-dev-rules": {
      "command": "npx",
      "args": ["-y", "agent-rules-mcp@latest"],
      "env": {
        "GITHUB_OWNER": "raremalo",
        "GITHUB_REPO": "ai_dev_rules",
        "GITHUB_PATH": "rules",
        "GITHUB_BRANCH": "master"
      }
    }
  }
}
```

### Option 5: Vollständiges Setup (Mit Memory & Tasks)

```bash
# 1. Repository klonen
git clone https://github.com/raremalo/ai_dev_rules.git

# 2. MCP-Konfiguration kopieren
cp mcp-config-full.json ~/.cursor/mcp.json
# oder für Claude Desktop:
# cp mcp-config-full.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# 3. Pfade und API-Keys anpassen
# Editiere die JSON-Datei mit deinen Werten

# 4. Cognee installieren (optional - AI Memory)
git clone https://github.com/topoteretes/cognee.git
cd cognee/cognee-mcp && uv sync --dev --all-extras

# 5. Beads installieren (optional - Task Tracking)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

---

## 📁 Repository-Struktur

```
ai-dev-rules/
├── README.md                    # Diese Datei
├── INTEGRATION.md               # Detaillierte Setup-Anleitung
├── mcp-config.json              # Minimale MCP-Konfiguration
├── mcp-config-full.json         # Vollständige Konfiguration
│
├── rules/                       # Basis-Regeln (01-16)
│   ├── 01-prd-documentation.md
│   ├── 02-atomic-components.md
│   ├── 03-context-referencing.md
│   ├── 04-naming-conventions.md
│   ├── 05-ui-stack-standards.md
│   ├── 06-screenshot-workflow.md
│   ├── 07-version-control.md
│   ├── 08-agent-training.md
│   ├── 09-context-management.md
│   ├── 10-enterprise-compliance.md
│   ├── 11-testing-strategy.md
│   ├── 12-error-handling.md
│   ├── 13-memory-cognee.md      # NEU: AI Memory
│   ├── 14-task-beads.md         # NEU: Task Tracking
│   ├── 15-skills-system.md      # NEU: Skills
│   └── 16-hooks-automation.md   # NEU: Hooks
│
├── skills/                      # Wiederverwendbare Skills
│   ├── creation/
│   │   └── create-vue-component.md
│   └── analysis/
│       └── (weitere Skills)
│
└── docs/
    └── ARCHITECTURE-EXTENDED.md # Gesamtarchitektur
```

---

## 📋 Regel-Übersicht

### Basis-Regeln (01-12)

| # | Regel | Beschreibung |
|---|-------|--------------|
| 01 | PRD & Dokumentation | Product Requirements + lebende Docs |
| 02 | Atomic Components | Feature-Zerlegung in kleinste Einheiten |
| 03 | Context Referencing | Explizite Datei- und Pattern-Referenzen |
| 04 | Naming Conventions | Selbsterklärende Namen |
| 05 | UI Stack Standards | Konsistente UI-Bibliotheken |
| 06 | Screenshot Workflow | Visuelle Kommunikation |
| 07 | Version Control | Git als Sicherheitsnetz |
| 08 | Agent Training | Persistentes Feedback |
| 09 | Context Management | Token-Effizienz |
| 10 | Enterprise Compliance | GDPR, A11y, i18n |
| 11 | Testing Strategy | Test-First Approach |
| 12 | Error Handling | Standardisierte Fehlerbehandlung |

### Erweiterte Regeln (13-18)

| # | Regel | Beschreibung |
|---|-------|--------------|
| 13 | Cognee Memory | Persistentes AI-Gedächtnis via Knowledge-Graph |
| 14 | Beads Tasks | DAG-basiertes Task-Tracking für Agents |
| 15 | Skills System | Wiederverwendbare AI-Workflows |
| 16 | Hooks Automation | Automatische Trigger bei Events |
| 17 | AI Interaction Patterns | **NEU:** Memory Files, Strong Emphasis, Model-Auswahl |
| 18 | AI Delegation Patterns | **NEU:** Wann delegieren, Debugging, Pivot-Strategien |

### Templates

| Datei | Beschreibung |
|-------|--------------|
| `templates/CLAUDE.md.template` | **NEU:** Vorlage für Projekt-Memory-File (81% essential!) |

---

## 🧠 Cognee Integration (AI Memory)

Cognee transformiert Dokumente in einen abfragbaren Knowledge-Graph:

```markdown
# Session-Start
"Führe Cognee-Search durch für aktuelle Projekt-Patterns"

# Neues Wissen speichern
"Cognify die neue Komponenten-Dokumentation"

# Code analysieren
"Codify das /src Verzeichnis für Code-Graph"
```

**Haupt-Tools:**
- `cognify` - Dokumente → Knowledge Graph
- `codify` - Code → Code Graph  
- `search` - Context-aware Abfragen
- `prune` - Graph optimieren

**MCP-Konfiguration:** Siehe `mcp-config-full.json`

---

## 📝 Beads Integration (Task Tracking)

Beads ersetzt Markdown-Pläne durch einen dependency-aware Graph:

```bash
# Was ist actionable?
bd ready --json

# Task erstellen
bd create "Implement UserCard" -t feature -p 1

# Dependencies setzen
bd create "Write tests" -t task -p 2 --deps "blocks:bd-a1b2"

# Session beenden ("Land the Plane")
bd sync && git push  # MANDATORY!
```

**Haupt-Commands:**
- `bd create` - Neue Tasks/Issues
- `bd ready` - Unblockierte Arbeit finden
- `bd close` - Tasks abschließen
- `bd sync` - Mit Git synchronisieren
- `bd dep tree` - Dependencies visualisieren

**MCP-Konfiguration:** Siehe `mcp-config-full.json`

---

## 🛠 Skills System

Skills sind wiederverwendbare Anleitungen für spezifische Aufgaben:

```markdown
# Skill laden und anwenden
"Lade den Skill 'create-vue-component' und erstelle 
eine UserProfileCard mit Avatar, Name und Status"
```

**Verfügbare Skills:**
- `create-vue-component` - Vue 3 Komponenten nach Standards erstellen
- (weitere Skills können in `skills/` ergänzt werden)

**Skill-Kategorien:**
- `creation/` - Neue Dateien/Komponenten erstellen
- `transformation/` - Bestehenden Code refactoren
- `analysis/` - Code analysieren und auditen
- `integration/` - Externe Services einbinden

---

## 🔗 Hooks & Automation

Automatische Trigger bei definierten Events:

| Hook | Trigger | Aktion |
|------|---------|--------|
| Pre-Commit | `git commit` | Lint, Type-Check, bd sync |
| Post-Merge | `git merge` | Dependencies aktualisieren |
| Pre-Push | `git push` | Tests ausführen |
| Session-Start | Neuer Chat | Context laden via Cognee + Beads |
| Session-End | Chat beenden | Land the Plane Protocol |
| File-Change | Datei geändert | Docs aktualisieren |

---

## 🎯 Typischer Workflow

### Session-Start

```markdown
"Starte neue Session:
1. Lade Regeln für atomic-components und ui-stack
2. Cognee-Search für aktuelle Patterns
3. bd ready --json für offene Tasks
4. Fasse Kontext zusammen"
```

### Während der Arbeit

```markdown
"Basierend auf Regel 02 (atomic-components) und 
Skill 'create-vue-component', implementiere [Feature]"
```

### Session-Ende

```markdown
"Land the Plane:
1. bd create für remaining work
2. bd close für erledigte Tasks
3. Cognee: Neue Patterns speichern
4. bd sync && git push (MANDATORY!)"
```

---

## 🔧 Lokale Anpassungen (Qoder)

Für projekt-spezifische Overrides:

```
Projekt/
└── .qoder/rules/
    └── always/
        └── project-overrides.md
```

Beispiel Override:
```markdown
# Projekt-spezifische Regeln

## Stack-Override
- Dieses Projekt nutzt Naive UI statt Radix
- Pinia Store-Namen: use[Entity]Store

## Ausnahmen  
- Legacy-Code in /src/legacy/ folgt alten Patterns
```

---

## 📊 Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP SERVER LAYER                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │agent-rules │  │  cognee    │  │   beads    │            │
│  │   -mcp     │  │   -mcp     │  │   -mcp     │            │
│  │ Rules/Skills│  │  Memory   │  │   Tasks    │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼───────────────┼───────────────┼────────────────────┘
         │               │               │
         ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│              AI CLIENTS (Cursor, Claude, Kiro)              │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL PROJECT                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Qoder    │  │ Git Hooks  │  │    Code    │            │
│  │  Overrides │  │ Automation │  │   & Docs   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

Siehe [docs/ARCHITECTURE-EXTENDED.md](./docs/ARCHITECTURE-EXTENDED.md) für Details.

---

## 📚 Weiterführende Dokumentation

- [INTEGRATION.md](./INTEGRATION.md) - Detaillierte Setup-Anleitung
- [docs/ARCHITECTURE-EXTENDED.md](./docs/ARCHITECTURE-EXTENDED.md) - Systemarchitektur
- [Cognee Docs](https://docs.cognee.ai) - AI Memory Dokumentation
- [Beads Docs](https://github.com/steveyegge/beads) - Task Tracking Dokumentation
- [agent-rules-mcp](https://github.com/4regab/agent-rules-mcp) - MCP Server für Regeln

---

## 🤝 Beitragen

1. Fork erstellen
2. Feature-Branch: `git checkout -b feature/neue-regel`
3. Änderungen committen
4. Pull Request erstellen

---

## 📝 Lizenz

MIT
