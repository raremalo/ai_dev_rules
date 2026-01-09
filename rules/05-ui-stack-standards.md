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
