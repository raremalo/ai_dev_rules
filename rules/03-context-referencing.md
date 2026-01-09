# Context Referencing & Kohärenz

- Last Updated: 2025-01-09
- Description: Methodik zur expliziten Referenzierung von Projektdateien und Patterns für konsistente AI-Ausgaben
- Version: 1.0

## Kernprinzip

AI-Agents haben kein implizites Wissen über dein Projekt. Jede Anfrage MUSS explizite Referenzen zu bestehenden Dateien, Konventionen und Patterns enthalten.

---

## Referenzierungs-Syntax

### Datei-Referenzen
```markdown
Basierend auf:
- `components/ui/Button.vue` (Varianten-Pattern)
- `stores/auth.ts` (State-Management-Struktur)
- `types/user.ts` (User-Interface)

Implementiere [Komponente] mit denselben Patterns.
```

### Pattern-Referenzen
```markdown
Verwende das Loading-Pattern wie in `Button.vue`:
- `isLoading` Prop
- Spinner-Komponente bei isLoading=true
- Disabled-State während Loading
```

### Stil-Referenzen
```markdown
Übernimm den Stil von `UserProfile.vue`:
- Card-Container mit shadow-sm
- Header mit Border-Bottom
- Action-Buttons rechts unten
```

---

## Kohärenz-Anforderungen

Jede Anfrage für neue Komponenten MUSS enthalten:

### 1. Architektur-Kohärenz
```markdown
"Wie in ARCHITECTURE.md beschrieben, nutze:
- Composables für shared Logic
- Pinia für globalen State
- TypeScript strict mode"
```

### 2. Stil-Kohärenz
```markdown
"Wie alle Komponenten in `components/ui/`:
- Tailwind für Styling
- Keine inline-Styles
- Dark-Mode über `dark:` Prefix"
```

### 3. Namens-Kohärenz
```markdown
"Folge dem Naming aus PATTERNS.md:
- Komponenten: PascalCase
- Composables: use[Name]
- Events: on[Action]"
```

---

## Referenz-Templates

### Neue Komponente
```markdown
Erstelle `ProductCard.vue`:

**Referenzen:**
- Layout wie `UserCard.vue` (Flexbox, Gap-Pattern)
- Loading-State wie `Button.vue` (isLoading + Skeleton)
- Props-Pattern wie `DataTable.vue` (generische Typen)

**Konventionen aus PATTERNS.md:**
- Emit statt Callback-Props
- defineProps mit TypeScript
- Slot für Custom-Content
```

### Erweiterung bestehender Komponente
```markdown
Erweitere `Button.vue` um Icon-Support:

**Aktuelle Struktur (lies die Datei):**
- Vorhandene Props: variant, size, loading, disabled
- Vorhandene Slots: default

**Neue Anforderung:**
- Prop: icon?: string (Lucide-Icon-Name)
- Prop: iconPosition?: 'left' | 'right'
- Behalte alle bestehenden Features
```

### Bug-Fix
```markdown
Fehler in `auth.ts` beheben:

**Kontext:**
- Lies `stores/auth.ts` für aktuelle Implementierung
- Lies `composables/useAuth.ts` für Usage-Pattern
- Prüfe `types/auth.ts` für Interface-Definition

**Problem:**
- Token-Refresh schlägt fehl wenn refreshToken expired

**Lösung gemäß TROUBLESHOOTING.md:**
- Catch 401 im Refresh-Call
- Redirect zu /login bei Failure
```

---

## Checkliste vor Anfrage

- [ ] Relevante bestehende Dateien referenziert?
- [ ] Pattern-Quelle genannt (welche Datei)?
- [ ] Architektur-Vorgaben aus ARCHITECTURE.md?
- [ ] Naming-Konventionen aus PATTERNS.md?
- [ ] Bei Erweiterung: Bestehende Features gelistet?
- [ ] Bei Bug-Fix: Betroffene Dateien identifiziert?

---

## Anti-Patterns

❌ **Ohne Kontext:**
```
"Mach einen Button mit Icon"
```

✅ **Mit Kontext:**
```
"Erweitere components/ui/Button.vue um Icon-Support:
- Nutze Lucide-Icons wie in NavItem.vue
- Icon-Position links oder rechts vom Text
- Behalte bestehende Varianten (primary, secondary, ghost)
- Wie im Loading-Pattern: Icon durch Spinner ersetzen bei isLoading"
```

❌ **Implizite Annahmen:**
```
"Nutze unseren Standard-Style"
```

✅ **Explizite Referenz:**
```
"Style gemäß components/ui/Card.vue:
- Rounded-lg, Shadow-sm
- Padding: p-4 auf Desktop, p-3 auf Mobile
- Border: border border-gray-200 dark:border-gray-700"
```
