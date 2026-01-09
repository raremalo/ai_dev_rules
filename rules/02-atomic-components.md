# Atomic Component Thinking

- Last Updated: 2025-01-09
- Description: Methodik zur Zerlegung von Features in kleinste, präzise spezifizierte Einheiten für AI-gestützte Entwicklung
- Version: 1.0

## Kernprinzip

Jedes Feature wird in **atomare, ausführbare Teile** zerlegt mit exakten Spezifikationen:

```
Feature → Modul → Komponente → Atom
```

Ein "Atom" ist die kleinste sinnvolle Einheit, die:
- Eine einzelne Verantwortung hat
- Unabhängig testbar ist
- In einer AI-Session vollständig implementierbar ist
- Weniger als 100 Zeilen Code umfasst

---

## Spezifikations-Template

Jede Anforderung an den AI-Agent MUSS enthalten:

### 1. Komponenten-Definition
```markdown
## UserCard Komponente

### Dimensionen
- Container: 320px breit, auto Höhe
- Padding: 16px
- Border-Radius: 8px

### Layout
- Flexbox, row, gap: 12px
- Avatar links, Content rechts

### Elemente
- Avatar: 48x48px, rund, object-fit: cover
- Name: Inter 16px semibold, #1a1a1a
- Role: Inter 14px regular, #6b7280
- Status-Dot: 8px, absolute top-right Avatar
```

### 2. TypeScript-Interface (Pflicht)
```typescript
interface UserCardProps {
  user: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    isOnline: boolean;
  };
  showStatus?: boolean;  // default: true
  onClick?: (userId: string) => void;
}
```

### 3. States & Variants
```markdown
### States
- Default: Normaler Zustand
- Hover: Shadow erhöhen, Cursor pointer
- Loading: Skeleton statt Content
- Error: Fallback-Avatar anzeigen

### Variants
- `size`: 'sm' | 'md' | 'lg'
- `theme`: 'light' | 'dark'
```

### 4. Edge Cases
```markdown
### Edge Cases
- Name > 20 Zeichen: Truncate mit Ellipsis
- Kein Avatar: Initialen-Fallback
- Offline > 24h: Grauer Status-Dot
- Keine Role: Feld ausblenden
```

---

## Beispiel-Anforderung (Vollständig)

```markdown
Erzeuge eine `UserCard` Komponente:

**Layout:**
- Flexbox row, 320px breit, 16px Padding, 8px Border-Radius
- Background: white, Shadow: sm

**Elemente:**
- Avatar: 48x48px rund, links
- Content: rechts vom Avatar
  - Name: Inter 16px semibold, #1a1a1a, max 20 Zeichen + Ellipsis
  - Role: Inter 14px regular, #6b7280
- Online-Dot: 8px grün, absolute Position an Avatar

**Props Interface:**
```typescript
interface UserCardProps {
  user: User;
  showStatus?: boolean;
}

interface User {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  isOnline: boolean;
}
```

**States:**
- Hover: shadow-md, cursor-pointer
- Loading: Skeleton für Avatar + 2 Zeilen Text

**Edge Cases:**
- Kein avatarUrl → Initialen (erste Buchstaben von Vor-/Nachname)
- role leer → Element nicht rendern
```

---

## Checkliste vor AI-Anfrage

- [ ] Exakte Dimensionen (px/rem) angegeben?
- [ ] Farben als Hex oder Tailwind-Klassen?
- [ ] Font-Family, Size, Weight definiert?
- [ ] TypeScript-Interface vollständig?
- [ ] Alle States beschrieben?
- [ ] Edge Cases identifiziert?
- [ ] Abhängigkeiten zu anderen Komponenten genannt?

---

## Anti-Patterns (Vermeiden)

❌ **Vage Anforderung:**
```
"Mach eine Karte für Benutzer"
```

✅ **Präzise Anforderung:**
```
"UserCard mit Avatar 48px, Name Inter 16px bold, 
Role 14px gray, Online-Dot 8px grün, 
TypeScript-Interface mit User-Type inklusive"
```

❌ **Zu große Einheit:**
```
"Baue das komplette Dashboard"
```

✅ **Atomare Einheit:**
```
"Implementiere DashboardHeader mit Logo, 
Navigation (3 Links), und UserDropdown"
```
