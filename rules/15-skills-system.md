# Skills System

- Last Updated: 2025-01-09
- Description: Wiederverwendbare, modulare AI-Fähigkeiten als Markdown-Dateien mit standardisierter Struktur
- Version: 1.0

## Kernprinzip

Skills sind **wiederverwendbare Anleitungen**, die AI-Agents für spezifische Aufgaben trainieren. Sie werden vor der Ausführung geladen und gewährleisten konsistente, hochqualitative Outputs.

---

## Skill-Anatomie

```markdown
# [Skill Name]

- Last Updated: YYYY-MM-DD
- Description: [Kurzbeschreibung für list_rules()]
- Version: X.Y
- Dependencies: [Andere Skills, Tools, Libraries]

## Kontext
[Wann und warum diesen Skill verwenden]

## Voraussetzungen
[Benötigte Tools, Configs, Dateien]

## Workflow
[Schritt-für-Schritt Anleitung]

## Templates
[Code-Templates, Boilerplate]

## Beispiele
[Konkrete Anwendungsbeispiele]

## Anti-Patterns
[Was zu vermeiden ist]

## Checkliste
[Abschluss-Prüfung]
```

---

## Skill-Kategorien

### 1. Creation Skills (Erstellen)

| Skill | Zweck |
|-------|-------|
| `create-component` | UI-Komponenten erstellen |
| `create-composable` | Vue/React Hooks erstellen |
| `create-api-endpoint` | API-Route erstellen |
| `create-test-suite` | Test-Datei erstellen |
| `create-documentation` | Docs generieren |

### 2. Transformation Skills (Umwandeln)

| Skill | Zweck |
|-------|-------|
| `refactor-component` | Komponente modernisieren |
| `migrate-to-typescript` | JS → TS Migration |
| `extract-composable` | Logic extrahieren |
| `optimize-performance` | Performance verbessern |

### 3. Analysis Skills (Analysieren)

| Skill | Zweck |
|-------|-------|
| `analyze-bundle` | Bundle-Size analysieren |
| `audit-accessibility` | A11y-Audit durchführen |
| `review-security` | Security-Review |
| `analyze-dependencies` | Dependency-Check |

### 4. Integration Skills (Verbinden)

| Skill | Zweck |
|-------|-------|
| `integrate-api` | Externe API anbinden |
| `setup-auth` | Auth-System integrieren |
| `configure-ci` | CI/CD einrichten |
| `setup-monitoring` | Monitoring hinzufügen |

---

## Skill-Struktur im Repository

```
ai-dev-rules/
├── rules/               # Basis-Regeln
└── skills/
    ├── creation/
    │   ├── create-component.md
    │   ├── create-composable.md
    │   └── create-test-suite.md
    ├── transformation/
    │   ├── refactor-component.md
    │   └── migrate-typescript.md
    ├── analysis/
    │   ├── audit-accessibility.md
    │   └── analyze-bundle.md
    └── integration/
        ├── setup-auth.md
        └── configure-ci.md
```

---

## Beispiel-Skill: create-component

```markdown
# Create Component Skill

- Last Updated: 2025-01-09
- Description: Erstellt eine neue Vue 3 Komponente nach Projekt-Standards
- Version: 1.0
- Dependencies: atomic-components (Regel 02), ui-stack (Regel 05)

## Kontext
Verwende diesen Skill wenn:
- Eine neue UI-Komponente benötigt wird
- Die Komponente Projekt-Patterns folgen soll
- TypeScript-Interfaces erforderlich sind

## Voraussetzungen
- UI-Stack definiert (Regel 05)
- Naming-Conventions bekannt (Regel 04)
- COMPONENTS.md existiert

## Workflow

### 1. Spezifikation sammeln
- Erfrage: Name, Props, States, Varianten
- Prüfe: Existierende ähnliche Komponenten

### 2. Interface definieren
```typescript
interface [ComponentName]Props {
  // Props mit Typen
}
```

### 3. Komponente erstellen
```vue
<template>
  <!-- Layout gemäß Spezifikation -->
</template>

<script setup lang="ts">
// Props, Emits, Composables
</script>
```

### 4. Tests erstellen
- Unit-Tests für alle Props
- Snapshot-Test für Default-Rendering

### 5. Dokumentieren
- COMPONENTS.md aktualisieren
- Storybook-Story (falls vorhanden)

## Template

```vue
<template>
  <div 
    :class="[
      'base-classes',
      variantClasses,
      props.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const variantClasses = computed(() => ({
  // Variant-spezifische Klassen
}))
</script>
```

## Checkliste
- [ ] TypeScript-Interface definiert?
- [ ] Alle States implementiert?
- [ ] Tailwind-Klassen (keine inline-Styles)?
- [ ] Dark-Mode berücksichtigt?
- [ ] Tests geschrieben?
- [ ] COMPONENTS.md aktualisiert?
```

---

## Skills via agent-rules-mcp laden

### Struktur im GitHub-Repository

```
your-rules-repo/
├── rules/           # Basis-Regeln
└── skills/          # Skills als Unterordner
    └── create-component.md
```

### MCP-Konfiguration

```json
{
  "mcpServers": {
    "ai-rules": {
      "env": {
        "GITHUB_PATH": "rules"
      }
    },
    "ai-skills": {
      "env": {
        "GITHUB_PATH": "skills"
      }
    }
  }
}
```

### Skill laden

```markdown
AI-Anfrage:
"Lade den Skill 'create-component' und wende ihn an 
für eine neue UserProfileCard Komponente"
```

---

## Custom Skills erstellen

### Template für neuen Skill

```markdown
# [Skill-Name]

- Last Updated: [Datum]
- Description: [Einzeiler für Übersicht]
- Version: 1.0
- Dependencies: [Regel 01, Skill XY]

## Kontext
[Wann wird dieser Skill verwendet?]

## Voraussetzungen
[Was muss vorhanden sein?]

## Workflow
[Nummerierte Schritte]

## Templates
[Code-Vorlagen]

## Beispiele
### Beispiel 1: [Titel]
[Konkrete Anwendung]

## Anti-Patterns
❌ [Was nicht tun]
✅ [Was stattdessen]

## Checkliste
- [ ] Schritt 1 erledigt?
- [ ] Schritt 2 erledigt?
```

---

## Skill-Kombination

Skills können kombiniert werden:

```markdown
AI-Anfrage:
"Kombiniere diese Skills für ein neues Feature:
1. create-component (UserDashboard)
2. create-composable (useDashboardData)
3. create-test-suite (für beide)
4. audit-accessibility (nach Implementierung)"
```

---

## Checkliste

- [ ] Skills-Ordner im Repository?
- [ ] Alle Skills folgen dem Template?
- [ ] Dependencies zwischen Skills dokumentiert?
- [ ] Skills über MCP zugänglich?
- [ ] Beispiele in jedem Skill?
