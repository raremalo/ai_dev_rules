# PRD und Lebende Dokumentation

- Last Updated: 2025-01-09
- Description: Richtlinien für Product Requirements Documents und kontinuierliche Projektdokumentation als zentrale AI-Referenz
- Version: 1.0

## PRD-Struktur (Pflicht)

Jedes Projekt MUSS ein `/docs/PRD.md` enthalten mit:

### 1. Vision & Scope
```markdown
## Vision
[1-2 Sätze: Was ist das Produkt und warum existiert es?]

## Scope
- In Scope: [Liste der Kernfeatures]
- Out of Scope: [Explizite Ausschlüsse]
```

### 2. Business-Kontext
```markdown
## Stakeholder
- Primär: [Nutzergruppe]
- Sekundär: [Weitere Nutzer]

## Erfolgsmetriken
- KPI 1: [Messbare Metrik]
- KPI 2: [Messbare Metrik]
```

### 3. Architektur-Skizze
```markdown
## Systemarchitektur
[Mermaid-Diagramm oder ASCII-Art]

## Tech-Stack
- Frontend: [Framework, UI-Lib]
- Backend: [Runtime, Framework]
- Datenbank: [System]
- Infrastruktur: [Cloud, Services]
```

### 4. Feature-Breakdown
```markdown
## Features (nach Priorität)

### MVP (P0)
- [ ] Feature A: [Beschreibung]
  - Akzeptanzkriterien: [Liste]
  
### Post-MVP (P1)
- [ ] Feature B: [Beschreibung]
```

### 5. Akzeptanzkriterien
```markdown
## Globale Akzeptanzkriterien
- [ ] Alle Komponenten haben TypeScript-Interfaces
- [ ] Unit-Test-Coverage > 80%
- [ ] Keine TypeScript-Errors
- [ ] Lighthouse Performance > 90
```

---

## Lebende Dokumentation (Pflicht)

Der `/docs/`-Ordner MUSS diese Dateien enthalten:

| Datei | Inhalt | Update-Trigger |
|-------|--------|----------------|
| `COMPONENTS.md` | Komponentenverzeichnis mit Props/States | Neue Komponente erstellt |
| `MILESTONES.md` | Feature-Status und Releases | Feature abgeschlossen |
| `ARCHITECTURE.md` | Systemdesign-Entscheidungen | Architekturänderung |
| `DECISIONS.md` | ADRs (Architecture Decision Records) | Technische Entscheidung |
| `PATTERNS.md` | Wiederverwendbare Code-Patterns | Neues Pattern etabliert |
| `TROUBLESHOOTING.md` | Bekannte Probleme und Lösungen | Bug gelöst |

### Beispiel: COMPONENTS.md

```markdown
# Komponenten-Register

## UI-Komponenten

### Button (`components/ui/Button.vue`)
- **Props**: `variant`, `size`, `loading`, `disabled`
- **Events**: `@click`
- **Slots**: `default`, `icon`
- **Patterns**: Loading-State mit Spinner

### UserCard (`components/UserCard.vue`)
- **Props**: `user: User`, `showStatus: boolean`
- **Dependencies**: `Avatar`, `StatusBadge`
```

### Beispiel: DECISIONS.md (ADR-Format)

```markdown
# ADR-001: Nuxt 3 statt Next.js

## Status
Akzeptiert (2025-01-09)

## Kontext
Wir benötigen ein SSR-Framework für SEO.

## Entscheidung
Nuxt 3 wegen Vue-Ökosystem und Team-Expertise.

## Konsequenzen
- Positiv: Schnellere Entwicklung
- Negativ: Kleinere Community als React
```

---

## AI-Agent-Anweisung

Vor jeder Entwicklungssession:
1. Lies `/docs/PRD.md` vollständig
2. Prüfe relevante Einträge in `COMPONENTS.md` und `PATTERNS.md`
3. Nach Abschluss: Aktualisiere betroffene Dokumentation

```
"Basierend auf PRD.md Abschnitt 'Feature A' und dem Loading-Pattern 
aus PATTERNS.md, implementiere [Komponente]"
```
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
# Selbsterklärende Namensgebung

- Last Updated: 2025-01-09
- Description: Konventionen für Komponenten-, Funktions- und Variablennamen, die Purpose und Scope klar kommunizieren
- Version: 1.0

## Kernprinzip

Namen MÜSSEN ohne zusätzlichen Kontext verständlich sein:

```
❌ Card.vue
✅ UserProfileCard.vue

❌ helper.ts
✅ EuropeanVatCalculationHelper.ts

❌ Modal.vue
✅ UserProfileEditModal.vue
```

---

## Naming-Patterns

### Komponenten
```
[Entity][Context?][Action?][Type]

Beispiele:
- UserProfileCard
- OrderStatusBadge
- ProductSearchInput
- ShoppingCartDrawer
- InvoiceDownloadButton
- TeamMemberInviteModal
```

### Composables / Hooks
```
use[Entity][Action?]

Beispiele:
- useAuth
- useUserProfile
- useProductSearch
- useCartTotal
- useFormValidation
- useDarkMode
```

### Stores (Pinia/Vuex)
```
[entity]Store

Beispiele:
- authStore
- userStore
- cartStore
- productStore
- notificationStore
```

### Utilities / Helpers
```
[Entity?][Domain][Action]Helper | [action][Entity]

Beispiele:
- DateFormatHelper
- CurrencyConversionHelper
- VatCalculationHelper
- formatPrice
- calculateDiscount
- validateEmail
```

### Types / Interfaces
```
[Entity][Context?][Suffix?]

Beispiele:
- User
- UserProfile
- UserProfileUpdateRequest
- OrderSummary
- ProductListResponse
- PaginatedResult<T>
```

### API-Funktionen
```
[action][Entity][Modifier?]

Beispiele:
- fetchUser
- fetchUserById
- createOrder
- updateUserProfile
- deleteCartItem
- searchProducts
```

---

## Kontext-Suffixe

| Suffix | Bedeutung | Beispiel |
|--------|-----------|----------|
| `Card` | Kompakte Darstellung | `UserCard` |
| `List` | Auflistung mehrerer Items | `ProductList` |
| `Detail` | Vollständige Ansicht | `OrderDetail` |
| `Form` | Eingabe-Formular | `UserProfileForm` |
| `Modal` | Dialog-Overlay | `ConfirmDeleteModal` |
| `Drawer` | Seitenleiste | `CartDrawer` |
| `Badge` | Status-Indikator | `OrderStatusBadge` |
| `Button` | Interaktives Element | `DownloadInvoiceButton` |
| `Input` | Eingabefeld | `SearchInput` |
| `Select` | Dropdown-Auswahl | `CountrySelect` |
| `Table` | Tabellarische Daten | `OrderHistoryTable` |
| `Chart` | Visualisierung | `RevenueChart` |

---

## Domain-Präfixe

Für Enterprise-Anwendungen mit mehreren Domains:

```
[Domain][Entity][Type]

Beispiele:
- AdminUserManagementTable
- CustomerOrderHistoryList
- InventoryStockLevelChart
- BillingInvoiceDownloadButton
- HREmployeeOnboardingForm
```

---

## Lokalisierte Varianten

```
[Entity][Context][Locale?][Type]

Beispiele:
- OrderStatusBadgeLocalized
- PricingTableEU
- DatePickerDE
- CurrencyInputLocalized
```

---

## AI-Agent-Anweisung

Bei neuen Komponenten/Funktionen:

```markdown
"Schlage 3 Namensoptionen vor, die folgendes widerspiegeln:
1. Die Entity (was wird dargestellt/verarbeitet)
2. Den Context (wo/wie wird es verwendet)
3. Die Action/den Type (was tut es)

Für: [Beschreibung der Komponente]"
```

### Beispiel-Dialog

**Anfrage:**
```
"Ich brauche eine Komponente, die den Bestellstatus als 
farbigen Badge anzeigt (pending=gelb, shipped=blau, delivered=grün)"
```

**Gute Namensvorschläge:**
```
1. OrderStatusBadge - Klar, Entity + Type
2. ShipmentStatusIndicator - Alternative wenn Shipping-fokussiert
3. OrderProgressBadge - Wenn Fortschritt betont werden soll

Empfehlung: OrderStatusBadge (am direktesten)
```

---

## Checkliste

- [ ] Kann jemand ohne Projektkenntnis den Zweck verstehen?
- [ ] Ist die Entity (User, Order, Product) im Namen?
- [ ] Ist der Komponenten-Type (Card, Modal, Button) im Namen?
- [ ] Bei Utilities: Ist die Aktion klar (calculate, format, validate)?
- [ ] Keine generischen Namen (Item, Thing, Data, Info)?
- [ ] Keine Abkürzungen außer etablierte (URL, API, ID)?

---

## Anti-Patterns

| Schlecht | Besser | Grund |
|----------|--------|-------|
| `Card.vue` | `UserProfileCard.vue` | Entity fehlt |
| `Modal.vue` | `ConfirmDeleteModal.vue` | Kontext fehlt |
| `helper.ts` | `PriceCalculationHelper.ts` | Domain fehlt |
| `utils.ts` | Aufteilen in spezifische | Zu generisch |
| `useFetch` | `useProductSearch` | Zu abstrakt |
| `DataTable` | `OrderHistoryTable` | Entity fehlt |
| `Btn` | `Button` | Keine Abkürzungen |
| `USR_PROF` | `UserProfile` | Keine Acronyme |
# UI-Stack Standards

- Last Updated: 2025-01-09
- Description: Verbindliche Festlegung von UI-Bibliotheken, Styling-Konventionen und Komponenten-Systemen für konsistente AI-Generierung
- Version: 1.0

## Kernprinzip

Der UI-Stack wird **vor** der Implementierung festgelegt und in **jeder** AI-Anfrage referenziert. Keine Abweichungen ohne Dokumentation in DECISIONS.md.

---

## Stack-Definition Template

Erstelle `/docs/UI-STACK.md` mit folgendem Inhalt:

```markdown
# UI Stack Definition

## Framework
- **Framework**: Vue 3 / React / Svelte / etc.
- **Meta-Framework**: Nuxt 3 / Next.js / SvelteKit / etc.

## Styling
- **Utility-First**: Tailwind CSS v3.x
- **Kein CSS-in-JS**: Nur Tailwind-Klassen
- **Keine inline-Styles**: Ausnahme nur für dynamische Werte

## Komponenten-Bibliothek
- **Headless UI**: Radix UI / Headless UI / etc.
- **Icons**: Lucide Icons
- **Animationen**: Framer Motion / @vueuse/motion

## Design-Tokens
- **Spacing**: Tailwind-Standard (4px Base)
- **Farben**: Tailwind-Palette + Custom (siehe unten)
- **Typografie**: Inter (UI), JetBrains Mono (Code)

## Custom Farben
```js
// tailwind.config.js
colors: {
  brand: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
}
```

## Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
```

---

## AI-Anfrage Format

Jede UI-bezogene Anfrage MUSS den Stack referenzieren:

```markdown
**Stack:** Vue 3 + Tailwind + Radix UI + Lucide Icons

Erstelle [Komponente] mit:
- Tailwind-Klassen (keine inline-Styles)
- Radix Dialog für Modal
- Lucide X-Icon für Close-Button
- Dark-Mode via `dark:` Prefix
```

---

## Konsistenz-Regeln

### Tailwind-Nutzung

```vue
<!-- ✅ Korrekt -->
<div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-900">

<!-- ❌ Falsch: inline-Style -->
<div style="display: flex; gap: 16px;">

<!-- ❌ Falsch: CSS-Klassen -->
<div class="my-custom-class">
```

### Headless-Komponenten

```vue
<!-- ✅ Korrekt: Radix/Headless für komplexe Interaktion -->
<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<!-- ❌ Falsch: Selbstgebaut ohne Accessibility -->
<div v-if="isOpen" class="modal">
```

### Icon-System

```vue
<!-- ✅ Korrekt: Lucide -->
<template>
  <XIcon class="w-5 h-5" />
</template>
<script setup>
import { XIcon } from 'lucide-vue-next'
</script>

<!-- ❌ Falsch: Inline-SVG -->
<svg>...</svg>

<!-- ❌ Falsch: Font-Icons -->
<i class="fa fa-times"></i>
```

---

## Komponenten-Anatomie

Jede UI-Komponente folgt dieser Struktur:

```vue
<template>
  <!-- 1. Root-Container mit base-classes -->
  <div 
    :class="[
      'base-classes here',
      variantClasses,
      props.class
    ]"
  >
    <!-- 2. Slot oder Content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// 3. Props mit TypeScript
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

// 4. Computed für Varianten
const variantClasses = computed(() => ({
  'bg-brand-500 text-white': props.variant === 'primary',
  'bg-gray-100 text-gray-900': props.variant === 'secondary',
}))
</script>
```

---

## Responsive-Pattern

```vue
<!-- Mobile-First Ansatz -->
<div class="
  p-4 text-sm
  md:p-6 md:text-base
  lg:p-8 lg:text-lg
">

<!-- Grid mit Responsive Columns -->
<div class="
  grid grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
```

---

## Dark-Mode Pattern

```vue
<!-- Immer beide Modi definieren -->
<div class="
  bg-white text-gray-900
  dark:bg-gray-900 dark:text-white
  
  border-gray-200
  dark:border-gray-700
">
```

---

## Checkliste für AI-Generierung

- [ ] Stack in Anfrage explizit genannt?
- [ ] Keine CSS-in-JS oder inline-Styles?
- [ ] Headless-Komponenten für komplexe Interaktion?
- [ ] Lucide-Icons statt inline-SVG?
- [ ] Dark-Mode berücksichtigt?
- [ ] Responsive mit Mobile-First?
- [ ] Custom-Farben aus tailwind.config.js?
- [ ] Spacing mit Tailwind-Utilities (gap, p, m)?
# Screenshot-Driven Development

- Last Updated: 2025-01-09
- Description: Methodik zur visuellen Kommunikation von UI-Anforderungen mittels annotierter Screenshots
- Version: 1.0

## Kernprinzip

Ein annotierter Screenshot kommuniziert mehr als 100 Wörter Text. Nutze visuelle Referenzen für präzise UI-Anforderungen.

---

## Screenshot-Typen

### 1. Änderungs-Screenshot
Bestehende UI mit eingezeichneten Änderungen:

```
[Screenshot mit Annotationen]
├── Pfeil 1: "Button hier platzieren, primär-blau"
├── Pfeil 2: "Padding erhöhen auf 24px"
├── Rahmen: "Dieser Bereich in Card-Container"
└── Durchgestrichen: "Element entfernen"
```

### 2. Referenz-Screenshot
Inspiration von anderen UIs:

```
[Screenshot von Referenz-UI]
├── Markierung: "Diesen Card-Style übernehmen"
├── Farbpipette: "Exakt diese Grautöne"
└── Notiz: "Animation beim Hover wie hier"
```

### 3. State-Screenshot
Verschiedene Zustände visualisieren:

```
[Collage von 4 States]
├── Default: Normaler Zustand
├── Hover: Erhöhter Shadow
├── Loading: Skeleton-Placeholder
└── Error: Roter Border, Error-Message
```

---

## Annotations-Toolkit

### Empfohlene Tools
- **macOS**: Screenshot + Preview (kostenlos)
- **Cross-Platform**: Cleanshot X, Snagit, Shottr
- **Browser**: Browser-Screenshot + Figma/Excalidraw

### Annotations-Elemente

| Element | Verwendung | Beispiel |
|---------|------------|----------|
| Pfeil | Zeigt auf spezifisches Element | → "Button hier" |
| Rahmen | Gruppiert zusammengehörige Elemente | ▭ "Diese Section" |
| Nummer | Reihenfolge/Priorität | ① ② ③ |
| Durchstreichen | Zu entfernen | ~~Alt~~ |
| Farbkreis | Farbangabe | 🔵 #0ea5e9 |
| Text-Label | Spezifikation | "16px, bold" |

---

## AI-Anfrage mit Screenshot

```markdown
[Screenshot hochladen]

Setze folgende Änderungen um:

1. **Pfeil A**: Neuer Button "Export", 
   - Position: rechts neben "Filter"
   - Variant: secondary
   - Icon: Download (Lucide)

2. **Rahmen B**: Card-Container hinzufügen
   - Shadow: sm
   - Padding: 16px
   - Border-Radius: 8px

3. **Durchgestrichen C**: Dieses Dropdown entfernen

4. **Farbkreis D**: Background ändern zu #f3f4f6
```

---

## State-Dokumentation

Für jede interaktive Komponente, Screenshots aller States:

```markdown
## Button States

| State | Screenshot | Beschreibung |
|-------|------------|--------------|
| Default | [img] | Primär-Blau, Text weiß |
| Hover | [img] | Hellerer Hintergrund |
| Active | [img] | Dunklerer Hintergrund |
| Disabled | [img] | Grau, 50% Opacity |
| Loading | [img] | Spinner statt Text |
```

---

## Checkliste

- [ ] Screenshot ist scharf und aktuell?
- [ ] Annotationen sind lesbar (nicht zu klein)?
- [ ] Farben als Hex angegeben?
- [ ] Abstände in px/rem spezifiziert?
- [ ] Alle betroffenen States gezeigt?
- [ ] Responsive-Varianten berücksichtigt?
# Version Control als Sicherheitsnetz

- Last Updated: 2025-01-09
- Description: Git-Workflow-Regeln für sichere AI-gestützte Entwicklung mit Rollback-Möglichkeit
- Version: 1.0

## Kernprinzip

Git ist dein Sicherheitsnetz. Committe **vor** jedem AI-Experiment, damit du jederzeit zurück kannst.

---

## Commit-Strategie

### Vor AI-Session
```bash
# Aktuellen Stand sichern
git add .
git commit -m "checkpoint: vor AI-Session"
```

### Nach erfolgreicher Implementierung
```bash
git add .
git commit -m "feat(component): UserCard mit Status-Indikator

- Avatar mit Online-Dot
- Hover-State mit Shadow
- TypeScript-Interface
- Storybook-Story

AI-assisted: Claude"
```

### Bei fehlgeschlagenem Experiment
```bash
# Zurück zum letzten Checkpoint
git checkout .
# oder selektiv
git checkout -- src/components/UserCard.vue
```

---

## Commit-Message Format

```
<type>(<scope>): <kurze Beschreibung>

[Optional: Längere Beschreibung]

AI-assisted: <Agent-Name>
```

### Types
| Type | Verwendung |
|------|------------|
| `feat` | Neues Feature |
| `fix` | Bugfix |
| `refactor` | Code-Umstrukturierung |
| `style` | Formatting, keine Logik-Änderung |
| `docs` | Dokumentation |
| `test` | Tests hinzufügen/ändern |
| `chore` | Tooling, Dependencies |
| `checkpoint` | Zwischenstand vor Experiment |

---

## Branch-Strategie für AI-Experimente

```bash
# Für größere Experimente: eigener Branch
git checkout -b experiment/dashboard-refactor

# AI macht Änderungen...
# Nach Erfolg:
git checkout main
git merge experiment/dashboard-refactor

# Nach Fehlschlag:
git checkout main
git branch -D experiment/dashboard-refactor
```

---

## Stash für schnelle Experimente

```bash
# Aktuelle Änderungen zwischenspeichern
git stash push -m "WIP: vor AI-Experiment"

# AI macht Änderungen...

# Bei Fehlschlag: Stash wiederherstellen
git checkout .
git stash pop
```

---

## Atomic Commits

Jede logische Einheit = ein Commit:

```bash
# ❌ Falsch: Alles in einem Commit
git add .
git commit -m "Dashboard fertig"

# ✅ Richtig: Atomare Commits
git add src/components/DashboardHeader.vue
git commit -m "feat(dashboard): Header mit Navigation"

git add src/components/DashboardStats.vue
git commit -m "feat(dashboard): Stats-Cards mit KPIs"

git add src/composables/useDashboardData.ts
git commit -m "feat(dashboard): Data-Fetching Composable"
```

---

## Gefährliche Operationen

### Vor Refactoring
```bash
# IMMER zuerst committen
git add .
git commit -m "checkpoint: vor Refactoring von auth-system"

# Dann AI-Refactoring starten
```

### Vor Dependency-Updates
```bash
git add .
git commit -m "checkpoint: vor dependency-updates"

# Dann Updates
npm update
npm audit fix

# Bei Problemen
git checkout package.json package-lock.json
npm install
```

---

## Recovery-Befehle

```bash
# Letzte Änderungen verwerfen (nicht committed)
git checkout .

# Letzten Commit rückgängig (behalte Änderungen)
git reset --soft HEAD~1

# Letzten Commit komplett rückgängig
git reset --hard HEAD~1

# Zu spezifischem Commit zurück
git log --oneline  # Hash finden
git checkout <hash>

# Gelöschte Datei wiederherstellen
git checkout HEAD -- path/to/file.vue
```

---

## Session-Abschluss

Am Ende jeder AI-Session:

```bash
# 1. Alles committen
git add .
git commit -m "session: [Datum] [Zusammenfassung]

Implementiert:
- Feature A
- Feature B

Offen:
- Bug in Feature C

AI-assisted: Claude"

# 2. Optional: Push
git push origin main
```

---

## Checkliste

- [ ] Vor AI-Session committed?
- [ ] Experiment-Branch für größere Änderungen?
- [ ] Atomic Commits (eine Änderung = ein Commit)?
- [ ] Commit-Messages beschreibend?
- [ ] "AI-assisted" Tag in Messages?
- [ ] Session am Ende sauber abgeschlossen?
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
# Context Management & Token-Effizienz

- Last Updated: 2025-01-09
- Description: Strategien zur optimalen Nutzung des AI-Kontextfensters und Erhaltung der Antwortqualität
- Version: 1.0

## Kernprinzip

AI-Agents haben ein begrenztes Kontextfenster. Lange Chats akkumulieren irrelevanten Kontext und reduzieren Qualität + Geschwindigkeit.

---

## Wann neuen Chat starten?

### Sofort neuen Chat bei:

| Trigger | Grund |
|---------|-------|
| Feature abgeschlossen | Sauberer Start für nächstes |
| Nach 15-20 Nachrichten | Kontext wird unübersichtlich |
| Themen-Wechsel | Alter Kontext irrelevant |
| Nach Debug-Session | Debug-Noise entfernen |
| Agent macht Fehler | Frischer Kontext hilft |
| Performance-Verlangsamung | Zu viel Token-Load |

### Im aktuellen Chat bleiben bei:

| Situation | Grund |
|-----------|-------|
| Iteration an gleicher Komponente | Kontext relevant |
| Zusammenhängende Changes | Zusammenhang wichtig |
| Schrittweise Refactoring | Muss kohärent bleiben |

---

## Chat-Hygiene Befehle

### Cursor
```
/clear     # Chat leeren
/reset     # Kompletter Reset
Cmd+K      # Neuer Inline-Chat
```

### Claude.ai
```
Neuer Chat via Sidebar
Strg+Shift+O für neuen Chat
```

### Claude Code (CLI)
```bash
/clear     # Kontext leeren
/compact   # Komprimiere History
exit + neu starten
```

---

## Kontext-Transfer Protokoll

Beim Wechsel zu neuem Chat:

```markdown
## Kontext-Übergabe

**Projekt:** E-Commerce Dashboard  
**Letzter Stand:** UserCard implementiert, funktioniert

**Relevante Dateien:**
- `components/UserCard.vue` - fertig
- `stores/user.ts` - fertig  
- `pages/dashboard.vue` - in Arbeit

**Aktueller Task:**
Dashboard-Seite mit UserCard-Integration

**Bekannte Patterns:**
- Loading via `isLoading` Prop + Skeleton
- Errors via Toast-Composable

**Offene Punkte:**
- Pagination für User-Liste
```

---

## Token-Spar-Strategien

### 1. Referenzieren statt Kopieren
```markdown
❌ [Kompletter Code von Button.vue hier einfügen]

✅ "Wie in Button.vue (lies die Datei), 
    implementiere dasselbe Varianten-Pattern"
```

### 2. Inkrementelle Anfragen
```markdown
❌ "Baue komplettes Dashboard mit Header, 
    Sidebar, Stats, Charts und Table"

✅ "Implementiere DashboardHeader"
   [Fertig]
   "Jetzt DashboardStats"
   [Fertig]
   "Jetzt DashboardTable"
```

### 3. Zusammenfassungen statt History
```markdown
❌ [20 Nachrichten Debug-Geschichte]

✅ "Zusammenfassung: Wir haben den Auth-Bug 
    durch Hinzufügen von Token-Refresh gelöst.
    Jetzt implementiere..."
```

---

## Context Window Management

### Optimale Chat-Länge
```
Nachrichten: 10-15 ideal, max 25
Code-Zeilen im Kontext: ~500-1000
Dateien referenziert: 3-5 pro Anfrage
```

### Priorität im Kontext

```
1. Aktuelle Anfrage (immer)
2. Direkt relevante Code-Dateien
3. Type-Definitionen
4. Pattern-Beispiele
5. Dokumentation (nur wenn nötig)
```

### Was NICHT im Kontext

```
- Komplette node_modules
- Generierte Dateien (dist, build)
- Lock-Files
- Große Datenfiles
- Irrelevante Komponenten
```

---

## Session-Dokumentation

Am Ende jeder Session in MILESTONES.md:

```markdown
## Session 2025-01-09

### Implementiert
- [x] UserCard Komponente
- [x] UserList mit Pagination
- [x] Search-Filter

### Nächste Session
- [ ] UserDetail Modal
- [ ] Edit-Formular

### Bekannte Issues
- Performance bei >100 Users (lazy loading nötig)

### Patterns etabliert
- Skeleton-Loading für alle Listen
- Toast für Error-Handling
```

---

## Checkliste

- [ ] Chat nach Feature-Abschluss gewechselt?
- [ ] Kontext-Übergabe dokumentiert?
- [ ] Nur relevante Dateien referenziert?
- [ ] Code zusammengefasst statt kopiert?
- [ ] Session-Ergebnis in MILESTONES.md?
- [ ] Offene Punkte notiert?
# Enterprise Compliance & Regulatorik

- Last Updated: 2025-01-09
- Description: Verbindliche Vorgaben für GDPR, Accessibility, Internationalisierung und branchenspezifische Anforderungen
- Version: 1.0

## Kernprinzip

Rechtliche und regionale Anforderungen werden **vor** der Implementierung definiert und in **jeder** Anfrage explizit referenziert.

---

## GDPR / Datenschutz

### Pflicht-Elemente für EU-Märkte

```markdown
Jedes Formular mit personenbezogenen Daten MUSS enthalten:

1. **Consent-Checkbox** (nicht vorausgewählt)
   - Text: "Ich stimme der Verarbeitung meiner Daten zu"
   - Link zur Datenschutzerklärung
   
2. **Datenspeicher-Hinweis**
   - Wo werden Daten gespeichert?
   - Wie lange?
   - Wer hat Zugriff?

3. **Opt-out Möglichkeit**
   - "Ich möchte keine Marketing-E-Mails erhalten"
   - Separates Opt-in für Newsletter
```

### AI-Anfrage für GDPR-konformes Formular

```markdown
Erstelle ein Kontaktformular (GDPR-konform für EU):

**Felder:**
- Name, E-Mail, Nachricht

**Pflicht-Elemente:**
- Consent-Checkbox mit Link zu /datenschutz
- Hinweis: "Daten werden auf EU-Servern gespeichert"
- Hinweis: "Löschung auf Anfrage möglich"

**Opt-ins (optional, unchecked):**
- Newsletter-Subscription
- Produktupdates

**Validierung:**
- Consent MUSS checked sein vor Submit
```

---

## Accessibility (WCAG 2.1 AA)

### Mindest-Anforderungen

```markdown
Jede Komponente MUSS erfüllen:

1. **Farbkontrast**: min. 4.5:1 für Text
2. **Keyboard-Navigation**: alle Interaktionen ohne Maus
3. **Screen-Reader**: sinnvolle ARIA-Labels
4. **Focus-Indikatoren**: sichtbar bei Keyboard-Nav
5. **Touch-Targets**: min. 44x44px auf Mobile
```

### AI-Anfrage mit Accessibility

```markdown
Erstelle Button-Komponente (WCAG 2.1 AA):

**Anforderungen:**
- Farbkontrast prüfen (4.5:1 minimum)
- `aria-label` wenn nur Icon
- `aria-busy="true"` während Loading
- `aria-disabled="true"` wenn disabled
- Fokus-Ring: `focus-visible:ring-2`
- Touch-Target: min-h-[44px] min-w-[44px]
```

### Accessibility-Checkliste

```markdown
## A11y Prüfung vor Release

- [ ] Lighthouse Accessibility Score > 95
- [ ] Keyboard-only Navigation getestet
- [ ] Screen-Reader getestet (VoiceOver/NVDA)
- [ ] Farbkontrast mit WebAIM Checker
- [ ] Keine autoplaying Media
- [ ] Formulare haben Labels
- [ ] Bilder haben alt-Text
- [ ] Skip-Links vorhanden
```

---

## Internationalisierung (i18n)

### Grundstruktur

```markdown
Alle UI-Texte MÜSSEN i18n-fähig sein:

❌ <span>Willkommen</span>
✅ <span>{{ $t('welcome') }}</span>

❌ <span>3 items</span>  
✅ <span>{{ $tc('items', count) }}</span>
```

### Lokalisierungs-Anforderungen

```markdown
**Sprachen:** DE, EN, FR (weitere später)

**Formate:**
- Datum: DE="DD.MM.YYYY", EN="MM/DD/YYYY"
- Währung: DE="1.234,56 €", EN="$1,234.56"
- Zahlen: DE="1.234,56", EN="1,234.56"

**Pluralisierung:**
- 0 items, 1 item, 2 items
- 0 Artikel, 1 Artikel, 2 Artikel
```

### AI-Anfrage mit i18n

```markdown
Erstelle ProductCard mit i18n-Support:

**Texte (alle über $t()):**
- Titel: product.title
- Preis: formatCurrency(price, locale)
- Status: product.status.[available|outOfStock]
- Button: actions.addToCart

**Locale-sensitive:**
- Datum: formatDate(date, locale)
- Zahl: formatNumber(quantity, locale)
```

---

## Branchen-spezifische Compliance

### Fintech / Banking

```markdown
**PCI-DSS Anforderungen:**
- Keine Kreditkartendaten in Logs
- Verschlüsselung für sensible Daten
- Session-Timeout nach 15 Min Inaktivität

**Audit-Trail:**
- Alle Transaktionen loggen
- User, Timestamp, Action, IP
```

### Healthcare

```markdown
**HIPAA Anforderungen:**
- PHI nur verschlüsselt speichern
- Zugriffskontrolle dokumentieren
- Break-Glass Procedure für Notfälle
```

### E-Commerce

```markdown
**Verbraucherschutz:**
- Widerrufsrecht (14 Tage EU)
- Preise inkl. MwSt für B2C
- Lieferzeiten-Angabe
- Impressum und AGB verlinkt
```

---

## Dokumentation in DECISIONS.md

```markdown
# ADR-005: GDPR-Implementierung

## Status
Akzeptiert (2025-01-09)

## Kontext
EU-Markt erfordert GDPR-Compliance.

## Entscheidung
- Alle Formulare mit Consent-Checkbox
- Cookie-Banner mit Opt-in
- Datenexport-Funktion für User

## Konsequenzen
- Zusätzlicher Entwicklungsaufwand
- Consent-State in jedem Form-Submit
```

---

## Checkliste für AI-Anfragen

- [ ] Regulatorische Region genannt (EU/US/etc.)?
- [ ] GDPR-Anforderungen spezifiziert?
- [ ] Accessibility-Level genannt (WCAG AA)?
- [ ] i18n-Sprachen definiert?
- [ ] Branchenspezifische Compliance?
- [ ] Dokumentation in DECISIONS.md verlangt?
# Testing Strategy

- Last Updated: 2025-01-09
- Description: Test-First-Ansatz und Coverage-Anforderungen für AI-generierte Komponenten
- Version: 1.0

## Kernprinzip

Jede AI-generierte Komponente wird mit Tests ausgeliefert. Kein Merge ohne Tests.

---

## Test-Pyramide

```
        ╱╲
       ╱  ╲   E2E Tests (wenige, kritische Flows)
      ╱────╲
     ╱      ╲  Integration Tests (Komponenten-Interaktion)
    ╱────────╲
   ╱          ╲ Unit Tests (viele, schnell, isoliert)
  ╱────────────╲
```

### Verteilung
- **Unit Tests**: 70% (Komponenten, Composables, Utils)
- **Integration Tests**: 20% (Komponenten-Zusammenspiel)
- **E2E Tests**: 10% (Kritische User-Journeys)

---

## Coverage-Anforderungen

```markdown
**Minimum Coverage:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**Kritische Pfade: 100%**
- Auth-Flow
- Payment-Flow
- Daten-Validierung
```

---

## AI-Anfrage mit Tests

```markdown
Erstelle UserCard Komponente MIT Tests:

**Komponente:**
[Spezifikation wie gewohnt]

**Tests (Vitest + Vue Testing Library):**

Unit Tests:
- Rendert Name korrekt
- Rendert Avatar mit korrekter URL
- Zeigt Online-Dot wenn isOnline=true
- Versteckt Online-Dot wenn showStatus=false
- Truncated Name bei > 20 Zeichen
- Fallback-Avatar wenn kein avatarUrl

Snapshot Test:
- Default-Rendering
- Mit allen Variants (sm, md, lg)

Edge Cases:
- Leerer Name
- Sehr langer Name (100+ Zeichen)
- Ungültige Avatar-URL
```

---

## Test-Datei-Struktur

```
src/
├── components/
│   └── UserCard.vue
├── __tests__/
│   └── components/
│       └── UserCard.test.ts
```

### Test-Template

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

describe('UserCard', () => {
  const defaultProps = {
    user: {
      id: '1',
      name: 'John Doe',
      role: 'Developer',
      avatarUrl: 'https://example.com/avatar.jpg',
      isOnline: true,
    },
  }

  it('renders user name', () => {
    const wrapper = mount(UserCard, { props: defaultProps })
    expect(wrapper.text()).toContain('John Doe')
  })

  it('shows online dot when user is online', () => {
    const wrapper = mount(UserCard, { props: defaultProps })
    expect(wrapper.find('[data-testid="online-dot"]').exists()).toBe(true)
  })

  it('hides online dot when showStatus is false', () => {
    const wrapper = mount(UserCard, {
      props: { ...defaultProps, showStatus: false },
    })
    expect(wrapper.find('[data-testid="online-dot"]').exists()).toBe(false)
  })

  it('truncates long names', () => {
    const wrapper = mount(UserCard, {
      props: {
        ...defaultProps,
        user: { ...defaultProps.user, name: 'A'.repeat(30) },
      },
    })
    expect(wrapper.text()).toContain('...')
  })
})
```

---

## Testing Best Practices

### 1. Data-TestId Attribute

```vue
<!-- In Komponente -->
<div data-testid="user-card">
  <img data-testid="avatar" />
  <span data-testid="online-dot" v-if="showStatus" />
</div>

<!-- In Test -->
wrapper.find('[data-testid="avatar"]')
```

### 2. Mock-Strategien

```typescript
// API-Calls mocken
vi.mock('@/api/users', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: '1', name: 'Test' }),
}))

// Composables mocken
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ user: ref({ id: '1' }), isLoggedIn: ref(true) }),
}))

// Timer mocken
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
```

### 3. Async Testing

```typescript
it('loads data on mount', async () => {
  const wrapper = mount(UserList)
  
  // Warte auf API-Call
  await flushPromises()
  
  expect(wrapper.findAll('[data-testid="user-card"]')).toHaveLength(3)
})
```

---

## E2E Tests (Playwright)

```typescript
// e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test'

test('user can view and edit profile', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password')
  await page.click('[data-testid="submit"]')

  // Navigate to profile
  await page.click('[data-testid="user-menu"]')
  await page.click('[data-testid="profile-link"]')

  // Verify profile
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('Test User')

  // Edit profile
  await page.click('[data-testid="edit-button"]')
  await page.fill('[data-testid="name-input"]', 'Updated Name')
  await page.click('[data-testid="save-button"]')

  // Verify update
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('Updated Name')
})
```

---

## Checkliste

- [ ] Unit-Tests für alle Props/States?
- [ ] Edge-Cases getestet?
- [ ] Snapshot-Tests für UI-Konsistenz?
- [ ] Mocks für externe Dependencies?
- [ ] data-testid Attribute gesetzt?
- [ ] Coverage-Threshold erreicht?
- [ ] E2E für kritische Flows?
# Standardisierte Fehlerbehandlung

- Last Updated: 2025-01-09
- Description: Einheitliche Patterns für Error-Handling, User-Feedback und Recovery-Strategien
- Version: 1.0

## Kernprinzip

Fehler werden erwartet, nicht ignoriert. Jeder Error-Path hat eine definierte UX.

---

## Error-Kategorien

| Kategorie | Beispiel | User-Feedback | Recovery |
|-----------|----------|---------------|----------|
| **Network** | API nicht erreichbar | Toast + Retry-Button | Auto-Retry (3x) |
| **Validation** | Ungültige Eingabe | Inline-Error am Feld | User korrigiert |
| **Auth** | Token abgelaufen | Redirect zu Login | Automatisch |
| **Permission** | Kein Zugriff | Error-Page 403 | Link zu Hilfe |
| **NotFound** | Ressource existiert nicht | Error-Page 404 | Link zu Home |
| **Server** | 500 Internal Error | Toast + Support-Link | Retry später |

---

## Error-Handling-Pattern

### API-Calls

```typescript
// composables/useApi.ts
export function useApi() {
  const toast = useToast()
  const auth = useAuth()
  
  async function fetchWithError<T>(
    fn: () => Promise<T>,
    options?: {
      retries?: number
      onError?: (error: Error) => void
      silentFail?: boolean
    }
  ): Promise<T | null> {
    const { retries = 3, onError, silentFail = false } = options ?? {}
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (error instanceof AuthError) {
          auth.logout()
          navigateTo('/login')
          return null
        }
        
        if (attempt === retries) {
          if (!silentFail) {
            toast.error({
              title: 'Fehler',
              description: getErrorMessage(error),
              action: { label: 'Erneut versuchen', onClick: () => fetchWithError(fn, options) }
            })
          }
          onError?.(error)
          return null
        }
        
        // Exponential backoff
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
      }
    }
    return null
  }
  
  return { fetchWithError }
}
```

### Komponenten mit Error-State

```vue
<template>
  <div>
    <!-- Loading State -->
    <Skeleton v-if="isLoading" />
    
    <!-- Error State -->
    <ErrorCard v-else-if="error" :error="error" @retry="loadData" />
    
    <!-- Success State -->
    <DataList v-else :items="data" />
  </div>
</template>

<script setup lang="ts">
const { data, error, isLoading, refresh } = await useFetch('/api/items')

function loadData() {
  refresh()
}
</script>
```

---

## Error-Komponenten

### Toast Notifications

```typescript
// composables/useToast.ts
export function useToast() {
  return {
    success: (message: string) => { /* ... */ },
    error: (options: { title: string; description?: string; action?: ToastAction }) => { /* ... */ },
    warning: (message: string) => { /* ... */ },
    info: (message: string) => { /* ... */ },
  }
}
```

### Inline Field Errors

```vue
<template>
  <div>
    <Input 
      v-model="email" 
      :error="errors.email"
      @blur="validateEmail"
    />
    <span v-if="errors.email" class="text-sm text-red-500">
      {{ errors.email }}
    </span>
  </div>
</template>
```

### Error Pages

```vue
<!-- pages/error/[code].vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-6xl font-bold text-gray-900">{{ errorCode }}</h1>
    <p class="text-xl text-gray-600 mt-4">{{ errorMessage }}</p>
    <div class="mt-8 space-x-4">
      <Button @click="$router.back()">Zurück</Button>
      <Button variant="primary" @click="$router.push('/')">Zur Startseite</Button>
    </div>
  </div>
</template>
```

---

## Form-Validierung

### Schema-basiert (Zod)

```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
  name: z.string().min(2, 'Mindestens 2 Zeichen'),
})

function validate(data: unknown) {
  const result = userSchema.safeParse(data)
  if (!result.success) {
    return result.error.flatten().fieldErrors
  }
  return null
}
```

### Error-Messages

```typescript
const errorMessages = {
  required: 'Dieses Feld ist erforderlich',
  email: 'Bitte gib eine gültige E-Mail-Adresse ein',
  minLength: (min: number) => `Mindestens ${min} Zeichen erforderlich`,
  maxLength: (max: number) => `Maximal ${max} Zeichen erlaubt`,
  pattern: 'Ungültiges Format',
}
```

---

## Logging & Monitoring

### Error-Logging

```typescript
// utils/errorLogger.ts
export function logError(error: Error, context?: Record<string, unknown>) {
  console.error('[ERROR]', error.message, context)
  
  // Sentry oder ähnliches
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context })
  }
}
```

### Error-Boundary (Vue)

```vue
<!-- components/ErrorBoundary.vue -->
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  logError(err)
  return false // Prevent propagation
})
</script>

<template>
  <slot v-if="!error" />
  <ErrorFallback v-else :error="error" @reset="error = null" />
</template>
```

---

## AI-Anfrage mit Error-Handling

```markdown
Erstelle UserList Komponente MIT Error-Handling:

**Error-States:**
1. Loading: Skeleton (3 Zeilen)
2. Network-Error: Toast + Retry-Button
3. Empty: "Keine Benutzer gefunden" + CTA
4. Partial-Error: Fehlende Avatars mit Fallback

**Recovery-Strategien:**
- Auto-Retry bei Network-Error (3x, exponential backoff)
- Offline-Cache für bereits geladene Daten
- Optimistic Updates für Aktionen

**Logging:**
- Alle Errors an Sentry
- User-ID und Request-ID im Context
```

---

## Checkliste

- [ ] Alle API-Calls mit try/catch?
- [ ] Loading-State definiert?
- [ ] Error-State mit Retry-Möglichkeit?
- [ ] Validation mit User-freundlichen Messages?
- [ ] Error-Logging implementiert?
- [ ] Error-Boundary für kritische Bereiche?
- [ ] Fallbacks für degraded Experience?
- [ ] Offline-Handling berücksichtigt?

---

## AI-Assisted Debugging

### PREDICT-NARROW-SOLVE Framework

Bei Bugs diesen strukturierten Ansatz mit dem AI-Assistant verwenden:

```markdown
"Debug diesen Fehler systematisch:

**FEHLER:**
[Error-Message / Stack-Trace hier]

**KONTEXT:**
- Aktion: [Was wurde versucht]
- Erwartet: [Was hätte passieren sollen]
- Tatsächlich: [Was ist passiert]

**DEBUGGING-PROZESS:**

### 1. PREDICTIONS (3-5 Hypothesen)
Liste mögliche Ursachen, sortiert nach Wahrscheinlichkeit.

### 2. INVESTIGATION
Untersuche den relevanten Code für jede Hypothese.

### 3. NARROWING (Scratchpad)
<scratchpad>
Hypothese A: [geprüft] → ❌ Ausgeschlossen weil...
Hypothese B: [geprüft] → ✅ BESTÄTIGT weil...
Hypothese C: [nicht nötig] → B bereits bestätigt
</scratchpad>

### 4. ROOT CAUSE
Die Ursache ist [X] weil [detaillierte Erklärung].

### 5. SOLUTION
Schritt-für-Schritt Fix mit Code."
```

### Error-Taxonomie für gezielte Debugging-Strategie

| Kategorie | Beispiele | Debugging-Ansatz |
|-----------|-----------|------------------|
| **Syntax** | Typos, fehlende Klammern | Linter/Compiler Output |
| **Runtime** | Null-Pointer, Type-Errors | Stack Trace analysieren |
| **Logic** | Falsche Bedingungen, Race Conditions | Step-through mit Logging |
| **Integration** | API-Fehler, Auth, CORS | Request/Response Logs |
| **Environment** | Config, Dependencies | Version/Config Diff |

### Rubber Duck für AI

```markdown
"Erkläre mir diesen Code Zeile für Zeile.
Identifiziere dabei potenzielle Probleme:

```typescript
async function processOrder(orderId: string) {
  const order = await db.orders.find(orderId)  // Was wenn null?
  const items = order.items                     // Potential crash
  for (const item of items) {                   // Was wenn leer?
    await inventory.reserve(item.id)            // Was bei Fehler?
  }
  return { success: true }                      // Partial success?
}
```"
```

### AI-freundliches Logging

```typescript
// Strukturiertes JSON-Logging für AI-Analyse
const logger = {
  debug: (context: string, data: object) => {
    console.log(JSON.stringify({
      level: 'DEBUG',
      timestamp: new Date().toISOString(),
      context,
      ...data
    }, null, 2))
  }
}

// AI kann strukturierte Logs lesen und analysieren!
```

### Nach dem Debugging

```markdown
"Nach dem Fix:
1. Fasse Root Cause in einem Satz zusammen
2. Zeige den Fix als Diff
3. Schlage einen Test vor der den Bug abdeckt
4. Prüfe ob ähnliche Bugs woanders existieren könnten"
```
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
# Hooks & Automation

- Last Updated: 2025-01-09
- Description: Automatische Trigger für AI-Actions bei definierten Events (Git, Session, File-Changes)
- Version: 1.0

## Kernprinzip

Hooks automatisieren repetitive AI-Aufgaben. Sie werden bei bestimmten Events getriggert und führen vordefinierte Aktionen aus.

---

## Hook-Typen

| Typ | Trigger | Beispiel-Aktion |
|-----|---------|-----------------|
| **Git Hooks** | commit, push, merge | Validierung, Sync |
| **Session Hooks** | Start, Ende | Context laden, Cleanup |
| **File Hooks** | Create, Change, Delete | Docs aktualisieren |
| **Task Hooks** | Beads create, close | Memory updaten |

---

## Git Hooks (Beads-Integration)

### Pre-Commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Beads-Sync vor Commit
bd sync --quiet

# Lint-Check
npm run lint

# Type-Check
npm run type-check
```

### Post-Merge Hook

```bash
#!/bin/sh
# .git/hooks/post-merge

# Beads nach Merge synchronisieren
bd sync

# Dependencies aktualisieren falls package.json geändert
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
  npm install
fi
```

### Pre-Push Hook

```bash
#!/bin/sh
# .git/hooks/pre-push

# Tests müssen passen
npm run test

# Beads final sync
bd sync
```

### Hook-Installation

```bash
# Beads installiert Hooks automatisch
bd init

# Oder manuell
cp hooks/* .git/hooks/
chmod +x .git/hooks/*
```

---

## Session Hooks

### Session-Start Hook

Definiere in `AGENTS.md` oder als Custom Instruction:

```markdown
## Session-Start Protokoll

Bei jedem neuen Chat automatisch:

1. **Context laden**
   - Cognee-Search für Projekt-Status
   - `bd ready --json` für offene Tasks
   - Letzte 5 Commits lesen

2. **Memory synchronisieren**
   - Cognee-Graph Status prüfen
   - Beads-Daemon Health-Check

3. **Kontext zusammenfassen**
   - Aktueller Stand in 3 Sätzen
   - Nächste priorisierte Aufgabe
```

### Session-End Hook ("Land the Plane")

```markdown
## Session-End Protokoll (Pflicht!)

Vor Beenden JEDER Session:

1. **Work dokumentieren**
   ```bash
   bd create "Remaining: [offene Arbeit]" -p 2
   bd close [erledigte Tasks] --reason "[Grund]"
   ```

2. **Sync ausführen**
   ```bash
   bd sync
   git add .
   git commit -m "session: [Zusammenfassung]"
   git push  # MANDATORY!
   ```

3. **Memory aktualisieren**
   - Neue Patterns in Cognee speichern
   - MILESTONES.md aktualisieren

4. **Verifizieren**
   ```bash
   git status  # Muss "up to date" zeigen
   bd ready --json  # Für nächste Session
   ```
```

---

## File-Change Hooks

### Automatische Dokumentations-Updates

```yaml
# .github/workflows/docs-sync.yml (GitHub Actions)
name: Sync Documentation

on:
  push:
    paths:
      - 'src/components/**'
      - 'src/composables/**'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update COMPONENTS.md
        run: |
          # Script das Komponenten-Register aktualisiert
          ./scripts/update-components-registry.sh
          
      - name: Commit changes
        run: |
          git add docs/COMPONENTS.md
          git commit -m "docs: auto-update components registry" || true
          git push
```

### Lokale File-Watcher (für AI-Agents)

```markdown
## File-Change Triggers

Wenn diese Dateien geändert werden, automatisch:

| Datei | Aktion |
|-------|--------|
| `src/components/*.vue` | COMPONENTS.md aktualisieren |
| `docs/PRD.md` | Cognee re-cognify |
| `package.json` | Dependency-Check ausführen |
| `.env.example` | README Setup-Section prüfen |
```

---

## Task Hooks (Beads-Events)

### Bei Task-Creation

```markdown
## Hook: Nach `bd create`

1. Prüfe Dependencies
   - Gibt es blocking Issues?
   - Ist Parent-Epic vorhanden?

2. Schätze Aufwand
   - S/M/L basierend auf Beschreibung
   - Aktualisiere Task mit Estimate

3. Aktualisiere Memory
   - Cognee: Neuen Task indexieren
```

### Bei Task-Close

```markdown
## Hook: Nach `bd close`

1. Dokumentation prüfen
   - Wurde COMPONENTS.md aktualisiert?
   - Wurden Tests hinzugefügt?

2. Pattern extrahieren
   - War es ein wiederverwendbares Pattern?
   - → In PATTERNS.md dokumentieren
   - → In Cognee speichern

3. Nächsten Task vorbereiten
   - `bd ready --json` ausführen
   - Empfehlung für nächsten Task
```

---

## Qoder-Hooks Integration

### Rule-Trigger Konfiguration

```yaml
# .qoder/config.yml
hooks:
  on_file_create:
    - pattern: "*.vue"
      rule: "apply-component-standards"
      
  on_file_change:
    - pattern: "docs/*.md"
      action: "cognee-recognify"
      
  on_session_start:
    - rule: "load-project-context"
    
  on_session_end:
    - rule: "land-the-plane"
```

### Auto-Apply Rules

```yaml
# .qoder/rules/always/auto-triggers.md
# Auto-Trigger Rules

## Bei neuer Komponente
Wenn eine neue `.vue` Datei erstellt wird:
1. Prüfe Naming (Regel 04)
2. Wende UI-Stack an (Regel 05)
3. Erstelle Test-Stub

## Bei API-Änderung
Wenn `api/` geändert wird:
1. TypeScript-Types aktualisieren
2. OpenAPI-Spec generieren
3. Postman-Collection updaten
```

---

## Kombinierte Hook-Chains

### Feature-Complete Hook-Chain

```markdown
## Trigger: Feature als "done" markiert

Chain:
1. **Validation**
   - Tests passen? (npm test)
   - Types korrekt? (npm run type-check)
   - Lint clean? (npm run lint)

2. **Documentation**
   - COMPONENTS.md aktuell?
   - Storybook-Stories vorhanden?
   - API-Docs generiert?

3. **Memory**
   - Cognee: Feature-Docs indexieren
   - Beads: Child-Tasks schließen

4. **Git**
   - Feature-Branch mergen
   - Tag erstellen
   - Release-Notes generieren

5. **Notification**
   - MILESTONES.md aktualisieren
   - Team informieren (optional)
```

---

## Custom Hook erstellen

### Template

```markdown
# Hook: [Name]

## Trigger
[Wann wird der Hook ausgelöst?]

## Bedingungen
[Unter welchen Umständen ausführen?]

## Aktionen
1. [Aktion 1]
2. [Aktion 2]
3. [Aktion 3]

## Fehlerbehandlung
[Was tun wenn Aktion fehlschlägt?]

## Logging
[Was wird protokolliert?]
```

---

## Checkliste

- [ ] Git Hooks installiert (bd init)?
- [ ] Session-Start Protokoll in AGENTS.md?
- [ ] Session-End "Land the Plane" dokumentiert?
- [ ] File-Change Triggers definiert?
- [ ] Beads-Task Hooks konfiguriert?
- [ ] Hook-Chains für komplexe Workflows?
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
# AI Delegation Patterns

- Last Updated: 2025-01-09
- Description: Strategien für effektive Aufgabenverteilung zwischen Mensch und AI-Assistant
- Version: 1.0
- Source: Community-validated from coding-with-ai.dev

## Kernprinzip

**Handle Critical Parts, Delegate the Rest.** Schreibe kritische, komplexe Code-Teile selbst und delegiere den Rest.

---

## Delegation Matrix

### ✅ An AI delegieren (Offload Tedious Tasks - 64% essential)

| Aufgabe | Beispiel | Warum gut für AI |
|---------|----------|------------------|
| **Boilerplate** | CRUD-Endpoints, Form-Komponenten | Repetitiv, klare Patterns |
| **Refactoring** | Variable umbenennen, Imports sortieren | Systematisch, fehleranfällig für Menschen |
| **Migrationen** | JS → TS, Options → Composition API | Zeitaufwändig, regelbasiert |
| **Tests schreiben** | Unit-Tests für bestehende Funktionen | Gut spezifizierbar |
| **Dokumentation** | JSDoc, README-Sections | Strukturiert, repetitiv |
| **Regex erstellen** | E-Mail-Validierung, URL-Parsing | AI ist besser darin |
| **SQL-Queries** | Komplexe JOINs, Aggregationen | Syntax-intensiv |
| **Config-Dateien** | Webpack, ESLint, TypeScript | Viel Boilerplate |

### 🧠 Selbst machen (Brain First)

| Aufgabe | Warum selbst? |
|---------|---------------|
| **Architektur-Entscheidungen** | Langfristige Konsequenzen |
| **Security-kritischer Code** | AI kann Lücken übersehen |
| **Business-Logik Kernstück** | Domänenwissen erforderlich |
| **Performance-kritische Pfade** | Benchmarking nötig |
| **Fehlerbehandlungs-Strategie** | UX-Entscheidungen |

---

## Delegations-Workflow

### Pattern 1: Structure → Implementation

```markdown
AI-Anfrage:
"Ich gebe dir die Struktur, du füllst die Implementation:

```typescript
// Meine Struktur:
interface PaymentService {
  processPayment(order: Order): Promise<PaymentResult>
  refund(transactionId: string): Promise<RefundResult>
  getHistory(userId: string, limit?: number): Promise<Payment[]>
}

// Implementiere diese Methoden mit:
// - Stripe SDK für Zahlungen
// - Exponential Backoff bei Fehlern
// - Logging für jede Operation
```"
```

### Pattern 2: Critical → Rest

```markdown
"Ich habe die kritische Auth-Logik geschrieben:

```typescript
// MEIN CODE - NICHT ÄNDERN:
function validateToken(token: string): TokenPayload {
  // [meine sichere Implementation]
}
```

Basierend darauf, erstelle:
1. Login-Endpoint der validateToken nutzt
2. Middleware für protected Routes
3. Token-Refresh Mechanismus"
```

### Pattern 3: Tedious Migration

```markdown
"Migriere alle Dateien in /src/components/ von:
- Options API → Composition API
- JavaScript → TypeScript
- Class Components → Functional

Behalte die Logik exakt bei, ändere nur die Syntax.
Zeige mir jeden File einzeln zur Bestätigung."
```

---

## Debugging Delegation

### Log Everything for AI Debugging (35% essential)

Systeme so designen, dass AI Logs lesen kann:

```typescript
// logger.ts - AI-freundliches Logging
const logger = {
  debug: (context: string, data: object) => {
    console.log(JSON.stringify({
      level: 'DEBUG',
      timestamp: new Date().toISOString(),
      context,
      ...data
    }))
  },
  
  error: (context: string, error: Error, data?: object) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      context,
      error: error.message,
      stack: error.stack,
      ...data
    }))
  }
}
```

### AI-Anfrage für Debugging

```markdown
"Hier sind die Logs der letzten 5 Minuten:

[LOGS EINFÜGEN]

Analysiere:
1. Was ist das Problem?
2. Wo tritt es auf?
3. Was ist die wahrscheinliche Ursache?
4. Wie kann ich es fixen?"
```

### Let It Test and Fix Itself

```markdown
"Implementiere [Feature] mit diesem Workflow:
1. Schreibe den Code
2. Führe `npm test` aus
3. Wenn Tests fehlschlagen: analysiere Output und fixe
4. Wiederhole bis alle Tests grün
5. Zeige mir das finale Ergebnis"
```

---

## Pivot When Stuck

### Erkennungszeichen

Der Agent ist stuck wenn:
- 3+ Versuche für gleiches Problem
- Wiederholt gleiche fehlerhafte Lösung
- Wird langsamer / weniger kohärent
- Halluziniert APIs die nicht existieren

### Pivot-Strategie

```markdown
"STOPP. Wir drehen uns im Kreis.

Vergiss den bisherigen Ansatz. Lass uns neu denken:

1. Was ist das eigentliche Problem? (nicht das Symptom)
2. Welche komplett anderen Ansätze gibt es?
3. Gibt es eine einfachere Lösung?

Schlage 3 alternative Ansätze vor."
```

### Fallback: Selbst übernehmen

```markdown
"Ich übernehme hier selbst. Erkläre mir stattdessen:
1. Wie funktioniert [relevantes Konzept]?
2. Was sind typische Patterns für [Problem]?
3. Welche Edge-Cases muss ich beachten?"
```

---

## Subagent Pattern

### Aufgaben aufteilen

```markdown
"Nutze Subagents für diese Aufgabe:

Subagent 1: Analysiere die bestehende API-Struktur
Subagent 2: Recherchiere Best Practices für [Thema]
Subagent 3: Überprüfe die vorgeschlagene Lösung

Fasse die Erkenntnisse zusammen."
```

### Double-Check mit frischem Context

```markdown
Workflow:
1. Agent A: Implementiert Feature
2. /clear (Context leeren)
3. Agent B: "Reviewe diesen Code: [Code von Agent A]"
4. Agent A: Implementiert Feedback von Agent B
```

---

## Async Delegation

### Agent arbeitet während du anderes tust

```markdown
"Arbeite an diesem Task im Hintergrund:
[Detaillierte Beschreibung]

Ich mache währenddessen [andere Aufgabe].
Benachrichtige mich wenn fertig oder wenn du Fragen hast."
```

### Parallel Agents (14% essential)

```bash
# Terminal 1: Agent arbeitet an Feature A
claude "Implementiere UserProfile Feature"

# Terminal 2: Agent arbeitet an Feature B  
claude "Implementiere Settings Page"

# Voraussetzung: Getrennte Dateien, keine Konflikte
```

---

## Autonomy Levels

### Wann volle Autonomie geben

```bash
# Claude Code: YOLO Mode für einfache Tasks
claude --dangerously-skip-permissions

# Geeignet für:
# - Lint-Fixes über viele Dateien
# - Einfache Refactorings
# - Variable umbenennen
# - Import-Sortierung
```

### Wann Bestätigung verlangen

```markdown
"Für jede Datei-Änderung:
1. Zeige mir den geplanten Diff
2. Warte auf mein OK
3. Erst dann implementieren

Besonders wichtig bei:
- Datenbank-Migrationen
- Auth-bezogenem Code
- Produktions-Configs"
```

---

## Anti-Patterns

### ❌ Alles delegieren

```markdown
"Baue mir eine komplette E-Commerce App"
→ Zu vage, keine Kontrolle, schlechte Qualität
```

### ❌ Nichts delegieren

```markdown
Alles selbst tippen, AI nur für Autocomplete
→ Verschwendetes Potenzial
```

### ❌ Blind akzeptieren

```markdown
"Accept All" ohne Code zu lesen
→ Bugs und Security-Lücken
```

### ✅ Goldener Mittelweg

```markdown
1. Kritisches selbst schreiben
2. Repetitives delegieren
3. Alles reviewen
4. Iterativ verfeinern
```

---

## Checkliste

- [ ] Kritische Teile selbst geschrieben?
- [ ] Tedious Tasks an AI delegiert?
- [ ] Logging für AI-Debugging eingebaut?
- [ ] Bei Stuck: Pivot-Strategie angewandt?
- [ ] Code nach Delegation reviewt?
- [ ] Autonomy-Level passend gewählt?
