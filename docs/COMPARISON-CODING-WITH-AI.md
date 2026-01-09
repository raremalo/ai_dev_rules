# Vergleich: AI Dev Rules vs. coding-with-ai.dev

Diese Dokumentation zeigt den Abgleich zwischen diesem Regel-System und den Community-validierten Techniken von [coding-with-ai.dev](https://coding-with-ai.dev).

## Abdeckungsübersicht

### ✅ Vollständig abgedeckt

| coding-with-ai.dev Technik | Adoption | Unsere Regel |
|---------------------------|----------|--------------|
| Write Detailed Specs | 50% essential | 02-atomic-components |
| Show Screenshots | 38% situational | 06-screenshot-workflow |
| Prime with Existing Code | 36% essential | 03-context-referencing |
| Always Review Full Diff | 56% essential | 07-version-control |
| Create Rollback Points | - | 07-version-control |
| Clear Context Between Tasks | 67% essential | 09-context-management |
| Always Test Code Yourself | 67% essential | 11-testing-strategy |
| Write Tests First | 19% situational | 11-testing-strategy |

### ✅ Neu hinzugefügt (v2.0)

| coding-with-ai.dev Technik | Adoption | Neue Regel |
|---------------------------|----------|------------|
| Set Up Memory Files | **81% essential** | 17 + CLAUDE.md Template |
| Treat as Digital Intern | 60% essential | 17-ai-interaction-patterns |
| Strong Emphasis Words | 50% essential | 17-ai-interaction-patterns |
| Interrupt and Redirect | 60% essential | 17-ai-interaction-patterns |
| Keep Asking for Changes | 47% essential | 17-ai-interaction-patterns |
| Choose Boring Libraries | 64% essential | 17-ai-interaction-patterns |
| Get Multiple Options | 57% essential | 17-ai-interaction-patterns |
| Read → Plan → Code → Commit | 53% essential | 17-ai-interaction-patterns |
| Start cheap, escalate | 19% essential | 17-ai-interaction-patterns |
| Actually Read the Code | 63% essential | 17-ai-interaction-patterns |
| Offload Tedious Tasks | 64% essential | 18-ai-delegation-patterns |
| Handle Critical, Delegate Rest | - | 18-ai-delegation-patterns |
| Log Everything for AI | 35% essential | 18-ai-delegation-patterns |
| Let It Test and Fix Itself | 27% essential | 18-ai-delegation-patterns |
| Pivot When Stuck | - | 18-ai-delegation-patterns |
| Use Subagents | 22% didn't adopt | 18-ai-delegation-patterns |
| Run Multiple Agents Parallel | 14% essential | 18-ai-delegation-patterns |

### ⚠️ Bewusst nicht übernommen

| Technik | Adoption | Grund |
|---------|----------|-------|
| Vibe Coding | 30% didn't adopt | Nicht für Enterprise geeignet |
| Brain First, Assistant Second | 39% didn't adopt | Situationsabhängig |
| Run Without Permissions | - | Security-Risiko |

### 📊 Zusätzliche Regeln (nicht in coding-with-ai.dev)

Diese Regeln gehen über coding-with-ai.dev hinaus:

| Regel | Beschreibung |
|-------|--------------|
| 04-naming-conventions | Systematische Naming-Patterns |
| 05-ui-stack-standards | UI-Library Standardisierung |
| 08-agent-training | Persistentes Feedback |
| 10-enterprise-compliance | GDPR, A11y, i18n |
| 12-error-handling | Error-Patterns |
| 13-memory-cognee | Knowledge-Graph Memory |
| 14-task-beads | DAG-basiertes Task-Tracking |
| 15-skills-system | Wiederverwendbare Skills |
| 16-hooks-automation | Event-basierte Automatisierung |

---

## Adoptions-Statistiken

Basierend auf Community-Voting (n = verschiedene Stichproben):

### Höchste Adoption (>60% essential)

1. **Set Up Memory Files** - 81% (n=85)
2. **Clear Context Between Tasks** - 67% (n=15)
3. **Always Test Code Yourself** - 67% (n=27)
4. **Offload Tedious Tasks** - 64% (n=22)
5. **Choose Boring Libraries** - 64% (n=43)
6. **Actually Read the Code** - 63% (n=19)
7. **Use Agent as Coding Partner** - 63% (n=16)
8. **Treat as Digital Intern** - 60% (n=20)
9. **Interrupt and Redirect** - 60% (n=15)

### Mittlere Adoption (40-60% essential)

10. Get Multiple Options - 57% (n=51)
11. Always Review Full Diff - 56% (n=16)
12. Read → Plan → Code → Commit - 53% (n=84)
13. Write Detailed Specs - 50% (n=61)
14. Strong Emphasis Words - 50% (n=14)
15. Keep Asking for Changes - 47% (n=17)

### Niedrigere / Situationale Adoption

- Build Prototype First - 44% situational
- Keep Code Dead Simple - 40% essential
- Show Screenshots - 38% situational
- Prime with Existing Code - 36% essential
- Log Everything for AI - 35% essential
- Define Structure, Delegate - 35% situational
- One Writes, Another Reviews - 31% situational

---

## Integration mit unserem System

### Memory Files + Beads

```markdown
# CLAUDE.md

## Task-Tracking
Nutze Beads für alle Tasks:
- `bd ready --json` bei Session-Start
- `bd create` für neue Tasks  
- `bd close` bei Abschluss
- IMMER `bd sync && git push` bei Session-Ende!
```

### Memory Files + Cognee

```markdown
# CLAUDE.md

## Knowledge Graph
- Bei Session-Start: Cognee-Search für Kontext
- Nach Feature-Abschluss: Cognee-Add für neue Docs
- Wöchentlich: Cognee-Prune für Optimierung
```

### Memory Files + Skills

```markdown
# CLAUDE.md

## Verfügbare Skills
Lade Skills bei Bedarf:
- `create-vue-component` für neue Komponenten
- `audit-accessibility` für A11y-Check
- `analyze-bundle` für Bundle-Analyse
```

---

## Quellen

- [coding-with-ai.dev](https://coding-with-ai.dev) - Live-Voting
- [GitHub: inmve/awesome-ai-coding-techniques](https://github.com/inmve/awesome-ai-coding-techniques)
- Simon Willison, Armin Ronacher, Anthropic Team
- Community-Feedback und Practitioner-Erfahrungen
