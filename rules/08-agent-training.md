# Agent Training & Persistentes Feedback

- Last Updated: 2025-01-09
- Description: Methoden zur kontinuierlichen Verbesserung von AI-Agent-Ausgaben durch strukturiertes Feedback
- Version: 1.0

## Kernprinzip

AI-Agents lernen innerhalb einer Session. Gib präzises, wiederholbares Feedback, das du auch in zukünftigen Sessions verwenden kannst.

---

## Feedback-Typen

### 1. Sofort-Korrektur
```markdown
❌ Das war nicht richtig:
- Du hast `useState` verwendet, wir nutzen Vue Composables
- Inline-Styles statt Tailwind-Klassen

✅ Korrekt wäre:
- `const count = ref(0)` statt `useState`
- `class="p-4"` statt `style="padding: 16px"`

Bitte korrigieren und merken für diese Session.
```

### 2. Pattern-Etablierung
```markdown
Für alle zukünftigen Komponenten in dieser Session:
- Tailwind-Utilities inline (keine CSS-Dateien)
- Max. 100 Zeilen pro atomare Komponente
- TypeScript strict mode
- Emit statt Callback-Props
```

### 3. Style-Guide-Referenz
```markdown
Halte dich an `components/ui/`-Muster:
- Alle Props mit TypeScript-Interface
- Default-Werte mit `withDefaults`
- Varianten als computed property
- Kein `v-if` und `v-for` auf demselben Element
```

---

## Persistente Regeln (Session-Start)

Am Anfang jeder neuen Session:

```markdown
## Session-Kontext

**Projekt:** E-Commerce Dashboard
**Stack:** Vue 3 + Nuxt 3 + Tailwind + Pinia

**Deine Regeln für diese Session:**
1. Nur Tailwind-Klassen, keine CSS-Dateien
2. TypeScript mit strict mode
3. Composables für shared Logic
4. Max. 100 Zeilen pro Komponente
5. Naming: [Entity][Type] (z.B. UserCard, OrderTable)
6. Fehlerbehandlung mit try/catch + Toast-Notification
7. Loading-States mit Skeleton-Komponenten
8. Dark-Mode via `dark:` Prefix berücksichtigen

**Referenz-Dateien:**
- `components/ui/Button.vue` für Varianten-Pattern
- `stores/auth.ts` für Pinia-Struktur
- `composables/useToast.ts` für Notifications
```

---

## Tool-spezifische Konfiguration

### Cursor: Custom Agents

```markdown
// .cursor/agents/vue-component-agent.md

# Vue Component Agent

Du bist spezialisiert auf Vue 3 Komponenten.

## Regeln
- Nutze Composition API mit `<script setup>`
- TypeScript für alle Props
- Tailwind für Styling
- Lucide für Icons

## Pattern
[Komponenten-Template hier]
```

### Claude Code: Subagents (CLI)

```bash
# Spezialisierte Subagents definieren
claude config set agents.vue "Vue 3 Experte mit Nuxt-Fokus"
claude config set agents.test "Testing-Spezialist für Vitest"
claude config set agents.docs "Dokumentations-Schreiber"
```

---

## Feedback-Loop Workflow

```
1. Anfrage stellen
   ↓
2. Ausgabe prüfen
   ↓
3. Feedback geben (spezifisch!)
   ↓
4. Korrektur erhalten
   ↓
5. Pattern dokumentieren (PATTERNS.md)
   ↓
6. In nächster Session wiederverwenden
```

---

## Feedback-Qualität

### ❌ Schlechtes Feedback
```
"Das ist falsch, mach es richtig"
"Nutze unseren Style"
"Wie immer"
```

### ✅ Gutes Feedback
```
"Ersetze `useState` durch `ref()` - wir nutzen Vue, nicht React"
"Style: Tailwind-Klassen `p-4 rounded-lg` statt inline-Style"
"Wie in `Button.vue` Zeile 15-20: Varianten als computed"
```

---

## Checkliste

- [ ] Session-Kontext am Anfang etabliert?
- [ ] Stack und Regeln explizit genannt?
- [ ] Referenz-Dateien angegeben?
- [ ] Feedback spezifisch (mit Beispiel)?
- [ ] Erfolgreiche Patterns in PATTERNS.md?
- [ ] Fehler in TROUBLESHOOTING.md dokumentiert?
