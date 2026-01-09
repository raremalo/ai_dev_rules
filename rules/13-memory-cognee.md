# AI Memory mit Cognee

- Last Updated: 2025-01-09
- Description: Integration von Cognee als persistente AI-Memory-Layer für Knowledge-Graph-basierte Kontextanreicherung
- Version: 1.0

## Kernprinzip

Cognee transformiert Projektdokumente und Code in einen abfragbaren Knowledge-Graph. Agents haben dadurch persistentes "Gedächtnis" über Sessions hinweg.

---

## Cognee-Operationen

| Operation | Zweck | Trigger |
|-----------|-------|---------|
| `.add()` | Daten vorbereiten | Neue Dokumente/Code |
| `.cognify()` | Knowledge-Graph bauen | Nach `.add()` |
| `.codify()` | Code-Graph erstellen | Repository-Analyse |
| `.search()` | Context-aware Abfragen | Jede AI-Session |
| `.prune()` | Graph optimieren | Regelmäßig |

---

## MCP-Server Setup

### Konfiguration (mcp.json)

```json
{
  "mcpServers": {
    "cognee": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/cognee-mcp",
        "run",
        "cognee"
      ],
      "env": {
        "ENV": "local",
        "TOKENIZERS_PARALLELISM": "false",
        "LLM_API_KEY": "sk-your-key",
        "GRAPH_DATABASE_PROVIDER": "networkx",
        "VECTOR_DB_PROVIDER": "lancedb",
        "DB_PROVIDER": "sqlite"
      }
    }
  }
}
```

### Docker-Alternative

```bash
# HTTP Transport (empfohlen)
docker run -e TRANSPORT_MODE=http \
  --env-file ./.env \
  -p 8000:8000 \
  cognee/cognee-mcp:main
```

---

## Workflow: Projekt-Memory aufbauen

### 1. Initial Setup (einmalig)

```markdown
AI-Anfrage:
"Initialisiere Cognee für dieses Projekt:
1. Cognify die Dateien in /docs/ (PRD, ARCHITECTURE, PATTERNS)
2. Codify das Repository für Code-Graphen
3. Bestätige den Memory-Status"
```

### 2. Dokumente hinzufügen

```python
# Manuell via Python
import cognee

await cognee.add([
    "docs/PRD.md",
    "docs/ARCHITECTURE.md",
    "docs/PATTERNS.md",
    "docs/DECISIONS.md"
])

await cognee.cognify()
```

### 3. Code-Repository analysieren

```markdown
AI-Anfrage:
"Codify das gesamte /src Verzeichnis, 
um einen Code-Graphen zu erstellen"
```

---

## Such-Strategien

### Graph Completion (Standard)

```markdown
AI-Anfrage:
"Suche in Cognee mit GRAPH_COMPLETION nach:
'Wie ist unser Error-Handling-Pattern strukturiert?'"
```

### RAG Completion

```markdown
AI-Anfrage:
"Suche mit RAG_COMPLETION nach relevanten 
Dokumentabschnitten für 'Auth-System Architektur'"
```

### Code-Suche

```markdown
AI-Anfrage:
"Suche im Code-Graphen nach allen Komponenten,
die das useAuth Composable verwenden"
```

### Such-Typen Übersicht

| Typ | Verwendung |
|-----|------------|
| `GRAPH_COMPLETION` | Relationale Zusammenhänge |
| `RAG_COMPLETION` | Dokument-Chunks mit Kontext |
| `CODE` | Code-Struktur und Dependencies |
| `CHUNKS` | Rohe Textabschnitte |
| `INSIGHTS` | Aggregierte Erkenntnisse |

---

## Auto-Regeln generieren

Cognee kann aus Interaktionen automatisch Regeln ableiten:

### Continue-Integration

```yaml
# .continue/rules/cognee_rules.yaml
name: Generate rules from interactions
alwaysApply: true
description: >
  Cognee's save_interaction tool captures exchanges,
  building a memory of what works.
rules:
  - tool: save_interaction
    auto: true
```

### Cursor-Integration

```markdown
AI-Anfrage nach erfolgreicher Implementierung:
"Speichere diese Interaktion in Cognee:
- Pattern: Loading-State mit Skeleton
- Kontext: Vue 3 Composition API
- Lösung: [Code-Snippet]"
```

---

## Session-Start-Protokoll

Zu Beginn jeder AI-Session:

```markdown
"Führe Cognee-Search durch für:
1. Aktuelle Projekt-Patterns
2. Offene Entscheidungen aus DECISIONS.md
3. Letzte Änderungen an der Architektur

Fasse die relevanten Erkenntnisse zusammen."
```

---

## Memory-Hygiene

### Regelmäßiges Pruning

```markdown
AI-Anfrage (wöchentlich):
"Optimiere den Cognee-Graph:
1. Prune veraltete Nodes
2. Zeige Statistiken zum Graph
3. Identifiziere Lücken im Knowledge-Graph"
```

### Nach Feature-Abschluss

```markdown
AI-Anfrage:
"Aktualisiere Cognee-Memory:
1. Add docs/COMPONENTS.md (neu: UserCard)
2. Re-cognify für aktualisierten Graph
3. Bestätige die neuen Relationen"
```

---

## Integration mit anderen Regeln

### Mit PRD-Dokumentation (Regel 01)

```markdown
"Cognify automatisch nach jeder PRD-Änderung"
```

### Mit Context-Referencing (Regel 03)

```markdown
"Vor jeder Anfrage: Cognee-Search für relevanten Kontext"
```

### Mit Agent-Training (Regel 08)

```markdown
"Speichere erfolgreiche Patterns in Cognee-Memory"
```

---

## Checkliste

- [ ] Cognee MCP-Server konfiguriert?
- [ ] Projekt-Dokumentation cognified?
- [ ] Code-Repository codified?
- [ ] Session-Start mit Cognee-Search?
- [ ] Neue Patterns in Memory gespeichert?
- [ ] Regelmäßiges Pruning geplant?
