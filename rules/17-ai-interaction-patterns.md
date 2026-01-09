# AI Interaction Patterns

- Last Updated: 2025-01-09
- Description: Bewährte Interaktionsmuster für effektive Zusammenarbeit mit AI-Coding-Assistants (Claude Code, Cursor, Codex)
- Version: 1.0
- Source: Community-validated techniques from coding-with-ai.dev (81% essential adoption)

## Kernprinzip

AI-Assistants sind keine Magie - sie sind **digitale Praktikanten** mit perfektem Gedächtnis aber ohne echtes Verständnis. Behandle sie entsprechend: präzise Anweisungen, klare Grenzen, ständige Überprüfung.

---

## 1. Memory Files Setup (81% essential)

### CLAUDE.md / AGENTS.md erstellen

Jedes Projekt braucht eine **Kontext-Datei**, die der Agent bei Session-Start liest:

```markdown
# CLAUDE.md (oder AGENTS.md)

## Projekt-Kontext
- Stack: Vue 3, TypeScript, Tailwind, Supabase
- Architektur: Monorepo mit /packages/web und /packages/api

## Wichtige Commands
- `npm run dev` - Development Server
- `npm run test` - Vitest Tests
- `npm run lint` - ESLint + Prettier

## Code-Konventionen
- Komponenten: PascalCase, Suffix nach Typ (UserCard, UserList)
- Composables: use[Entity][Action] (useAuth, useUserFetch)
- NIEMALS inline-Styles, immer Tailwind

## Gotchas
- /generated/ Ordner NIEMALS manuell editieren
- Nach Config-Änderungen: Server neu starten
- Edge-Functions brauchen explizites CORS

## Referenz-Dateien
- @docs/ARCHITECTURE.md
- @docs/PATTERNS.md
```

### Hierarchie

```
~/.claude/CLAUDE.md       → Persönliche Präferenzen (global)
./CLAUDE.md               → Projekt-Standards (team-shared)
./packages/api/CLAUDE.md  → Package-spezifisch (monorepo)
```

### Tool-Synchronisation

Halte eine **Single Source of Truth**:

```bash
# Option 1: Symlink
ln -sf CLAUDE.md AGENTS.md

# Option 2: Redirect in AGENTS.md
echo "READ CLAUDE.md FIRST!!!" > AGENTS.md

# Option 3: @-Include (Cursor)
# In AGENTS.md:
@CLAUDE.md
```

---

## 2. Read → Plan → Code → Commit (53% essential)

### Workflow-Sequenz

```markdown
AI-Anfrage:
"Bevor du Code schreibst:
1. LESE die relevanten Dateien (@src/components/, @docs/PATTERNS.md)
2. ERSTELLE einen Plan mit:
   - Betroffene Dateien
   - Änderungen pro Datei
   - Potenzielle Risiken
   - Schnelle Testmöglichkeit
3. WARTE auf meine Bestätigung
4. IMPLEMENTIERE erst nach Freigabe
5. COMMITTE mit aussagekräftiger Message"
```

### Plan Mode aktivieren

| Tool | Aktivierung |
|------|-------------|
| Claude Code | `Shift+Tab` für Plan Mode |
| Cursor | Plan-Toggle in UI |
| Codex | Explizit im Prompt anweisen |

---

## 3. Treat as Digital Intern (60% essential)

### Präzise Anweisungen geben

❌ **Vage:**
```
"Erstelle eine User-Komponente"
```

✅ **Präzise (wie für einen Praktikanten):**
```
"Erstelle eine UserProfileCard Komponente:
- Datei: src/components/user/UserProfileCard.vue
- Props: user: User (interface in @types/user.ts)
- Layout: Avatar links (48x48), Name + Email rechts
- Styling: Tailwind, rounded-lg, shadow-sm, p-4
- States: Loading (Skeleton), Error (ErrorCard), Success
- Test: Erstelle UserProfileCard.test.ts mit Vitest"
```

### Funktions-Signatur vorgeben

```markdown
"Implementiere diese Funktion:

```typescript
async function downloadFile(
  url: string, 
  maxSizeBytes: number = 5 * 1024 * 1024
): Promise<string>
```

Die Funktion soll:
1. Content-Length Header prüfen
2. Bei Überschreitung: FileTooLargeError werfen
3. Datei in temp-Verzeichnis speichern
4. Pfad zurückgeben

Schreibe danach Tests mit Vitest."
```

---

## 4. Strong Emphasis Words (50% essential)

### WICHTIG, NIEMALS, IMMER verwenden

Die effektivsten Steuerungswörter:

```markdown
WICHTIG: Verwende ausschließlich Tailwind-Klassen.

NIEMALS:
- Inline-Styles verwenden
- console.log im Production-Code
- any als TypeScript-Typ

IMMER:
- TypeScript strict mode
- Error-Boundaries um async Code
- Loading-States für API-Calls
```

### Beispiel in CLAUDE.md

```markdown
## Strikte Regeln

WICHTIG: Dieses Projekt verwendet Vue 3 Composition API.
NIEMALS Options API oder Vue 2 Syntax verwenden!

IMMER:
- `<script setup lang="ts">` für Komponenten
- `defineProps<Props>()` mit TypeScript Interface
- Computed Properties statt Watch wenn möglich

NIEMALS:
- `this.` Syntax (wir nutzen Composition API)
- Mixins (verwende Composables)
- Event Bus (verwende Pinia oder Props/Emits)
```

---

## 5. Interrupt and Redirect (60% essential)

### Früh eingreifen

Lass den Agent nicht zu weit in die falsche Richtung laufen:

| Tool | Interrupt |
|------|-----------|
| Claude Code | `Escape` drücken |
| Cursor | Stop-Button |
| Codex | `Escape` oder `/stop` |

### Redirect-Pattern

```markdown
"STOPP. Du gehst in die falsche Richtung.

Das Problem ist nicht [was du versuchst].
Das eigentliche Problem ist [korrektes Problem].

Neuer Ansatz:
1. [Schritt 1]
2. [Schritt 2]

Bitte starte neu mit diesem Ansatz."
```

---

## 6. Keep Asking for Changes (47% essential)

### Iterativ verfeinern

AI-Assistants beschweren sich nie - nutze das aus:

```markdown
Iteration 1: "Erstelle die Komponente"
Iteration 2: "Extrahiere die Logik in ein Composable"
Iteration 3: "Füge Error-Handling hinzu"
Iteration 4: "Optimiere die Performance mit useMemo"
Iteration 5: "Schreibe es besser!"
```

### Konkrete Änderungswünsche

```markdown
"Ändere folgendes:
- Ersetze den Switch durch eine Lookup-Map
- Extrahiere den API-Call in eine separate Funktion
- Verwende destructuring für die Props
- Füge JSDoc-Kommentare hinzu"
```

---

## 7. Choose Boring, Stable Libraries (64% essential)

### Prinzip

Wähle Libraries, die **vor dem Model-Training-Cutoff** etabliert waren:

✅ **Gut für AI:**
- React, Vue, Svelte (etabliert)
- Express, Fastify (stabil)
- PostgreSQL, Redis (jahrzehntealt)
- Tailwind CSS (weit verbreitet)

⚠️ **Problematisch:**
- Brandneue Frameworks (< 1 Jahr)
- Nischen-Libraries mit wenig Dokumentation
- Cutting-Edge APIs (noch in Beta)

### In CLAUDE.md dokumentieren

```markdown
## Library-Entscheidungen

Wir verwenden BEWUSST etablierte Libraries:
- Tanstack Query (nicht SWR) - bessere AI-Unterstützung
- Zod (nicht Yup) - mehr Trainingsbeispiele
- date-fns (nicht Temporal API) - stabiler

Bei neuen Libraries: Dokumentation in Prompt einfügen!
```

---

## 8. Get Multiple Options (57% essential)

### Alternativen anfordern

```markdown
"Zeige mir 3 verschiedene Ansätze für [Problem]:

Für jeden Ansatz:
- Code-Beispiel
- Pros
- Cons
- Wann verwenden

Empfehle dann den besten für unseren Use-Case."
```

### Beispiel

```markdown
"Was sind die Optionen für State-Management in Vue 3?

Vergleiche:
1. Pinia
2. Composables mit ref/reactive
3. Provide/Inject

Mit Code-Beispielen und Empfehlung für eine 
mittelgroße SaaS-Anwendung."
```

---

## 9. Model-Auswahl (19% essential, aber wichtig)

### Start cheap, escalate when stuck

| Aufgabe | Claude Code | Codex |
|---------|-------------|-------|
| Routine-Edits | Sonnet 4 | gpt-5-medium |
| Komplexe Logik | Opus 4.1 | gpt-5-high |
| Multi-File Refactor | Long-Context | gpt-5-high |
| UI von Screenshots | Vision-Strong | - |

### Wechsel-Trigger

```markdown
Wechsle zu höherem Model wenn:
- 3+ fehlgeschlagene Versuche
- Komplexe Architektur-Entscheidungen
- Multi-File Refactoring
- Debugging schwieriger Bugs
```

---

## 10. Actually Read the Code (63% essential)

### Review-Pflicht

**Jeder AI-generierte Code muss gelesen werden!**

```markdown
Review-Checkliste:
- [ ] Logik verstanden?
- [ ] Edge-Cases abgedeckt?
- [ ] Error-Handling vorhanden?
- [ ] Performance akzeptabel?
- [ ] Security-Risiken?
- [ ] Tests vollständig?
```

### Treat AI Code as Pull Request

```markdown
"Zeige mir die Änderungen als Diff.
Ich werde sie reviewen wie einen Pull Request 
und Kommentare für Korrekturen hinterlassen."
```

---

## 11. Let It Self-Review

### Agent reviewt eigenen Code

```markdown
"Bevor ich den Code reviewe:
1. Führe ein Self-Review durch
2. Identifiziere potenzielle Probleme
3. Schlage Verbesserungen vor
4. Liste offene Fragen auf"
```

### Multi-Agent Review

```markdown
Workflow:
1. Agent A schreibt Code
2. /clear oder neuer Chat
3. Agent B reviewt Code von Agent A
4. Agent C implementiert Feedback
```

---

## 12. Rules Acknowledgment Pattern

### Transparenz bei Regel-Anwendung

Der Agent soll bei komplexen Aufgaben explizit sagen, welche Regeln er anwendet:

```markdown
### Rule Acknowledgment

**Angewandte Regeln:**
- [02-atomic-components]: Komponente wird atomar gebaut
- [04-naming-conventions]: PascalCase für Komponenten
- [11-testing-strategy]: Unit-Tests werden erstellt

**Geprüft aber nicht relevant:**
- [10-enterprise-compliance]: Keine GDPR-Daten betroffen
- [13-memory-cognee]: Keine Memory-Aktion nötig

**Implementation folgt...**
```

### Wann Acknowledgment verlangen

```markdown
WICHTIG: Bei folgenden Aufgaben zeige zuerst dein Rule Acknowledgment:
- Neue Features implementieren
- Architektur-Änderungen
- Refactoring größerer Code-Bereiche
- Security-relevante Änderungen

Bei einfachen Tasks (Typo-Fix, kleine Änderung) ist kein Acknowledgment nötig.
```

### Vorteile

1. **Transparenz** - Sichtbar welche Regeln der Agent kennt
2. **Debugging** - Wenn etwas schiefgeht, siehst du welche Regel ignoriert wurde
3. **Lernen** - Du verstehst wie der Agent Entscheidungen trifft
4. **Konsistenz** - Agent vergisst keine Regeln

---

## 13. Strukturiertes Debugging-Framework

### Das PREDICT-NARROW-SOLVE Pattern

Basierend auf dem Ultimate Debugger Prompt - ein systematischer Debugging-Ansatz:

```markdown
AI-Anfrage bei Bugs:
"Debug diesen Fehler mit dem PREDICT-NARROW-SOLVE Pattern:

**ERROR:**
[Fehlermeldung einfügen]

**CONTEXT:**
- Was ich versucht habe: [Aktion]
- Erwartetes Verhalten: [Was hätte passieren sollen]
- Tatsächliches Verhalten: [Was passiert ist]

Führe folgende Schritte durch:

1. **PREDICTIONS** (3-5 Hypothesen)
   Liste mögliche Ursachen auf, sortiert nach Wahrscheinlichkeit.

2. **INVESTIGATION**
   Untersuche den relevanten Code für jede Hypothese.

3. **NARROWING**
   Eliminiere Hypothesen durch logische Analyse.
   Zeige dein Reasoning für jede Elimination.

4. **ROOT CAUSE**
   Identifiziere die wahrscheinlichste Ursache.
   Erkläre WARUM dies der Fehler ist.

5. **SOLUTION**
   Gib Schritt-für-Schritt Anweisungen zum Fix.
   Zeige den korrigierten Code."
```

### Scratchpad-Technik

Lass den Agent seinen Denkprozess dokumentieren:

```markdown
"Nutze ein Scratchpad um deinen Debugging-Prozess zu dokumentieren:

<scratchpad>
Hypothese 1: Null-Pointer bei user.settings
→ Geprüft: user wird vor Zugriff validiert ❌

Hypothese 2: Race Condition bei async fetch
→ Geprüft: await fehlt in Zeile 45 ✅ GEFUNDEN!

Hypothese 3: Falscher API-Endpoint
→ Nicht geprüft (Hypothese 2 bereits bestätigt)
</scratchpad>

Root Cause: Fehlendes await in Zeile 45..."
```

### Error-Kategorie-Analyse

```markdown
"Kategorisiere den Fehler zuerst:

**Fehler-Taxonomie:**
1. **Syntax**: Typos, fehlende Klammern, falsche Imports
2. **Runtime**: Null-Pointer, Type-Errors, Out-of-Bounds
3. **Logic**: Falsche Bedingungen, Off-by-One, Race Conditions
4. **Integration**: API-Fehler, Auth-Probleme, CORS
5. **Environment**: Config, Dependencies, Versionen

Kategorie bestimmt Debugging-Strategie:
- Syntax → Linter/Compiler Output lesen
- Runtime → Stack Trace analysieren
- Logic → Step-through Debugging
- Integration → Request/Response Logs
- Environment → Config-Diff, Version-Check"
```

### Rubber Duck Debugging für AI

```markdown
"Erkläre mir den Code Zeile für Zeile als wärst du der Rubber Duck:

```typescript
// Was macht diese Funktion?
async function fetchUser(id: string) {
  // Zeile 1: Was passiert hier?
  const response = await api.get(`/users/${id}`)
  // Zeile 2: Was könnte hier schiefgehen?
  return response.data.user
}
```

Während der Erklärung: Identifiziere potenzielle Probleme."
```

---

## Checkliste für jede Session

- [ ] CLAUDE.md / AGENTS.md vorhanden?
- [ ] Plan-Phase vor Implementation?
- [ ] Präzise Anweisungen mit Signatur?
- [ ] WICHTIG/NIEMALS/IMMER für Regeln?
- [ ] Früh unterbrochen wenn falsche Richtung?
- [ ] Iterativ verfeinert bis zufrieden?
- [ ] Code selbst gelesen und verstanden?
- [ ] Etablierte Libraries bevorzugt?
- [ ] Bei komplexen Tasks: Rule Acknowledgment?
- [ ] Bei Bugs: PREDICT-NARROW-SOLVE Pattern?
