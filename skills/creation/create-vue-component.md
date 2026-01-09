# Create Vue Component Skill

- Last Updated: 2025-01-09
- Description: Erstellt eine neue Vue 3 Composition API Komponente nach Projekt-Standards mit TypeScript, Tests und Dokumentation
- Version: 1.0
- Dependencies: Regel 02 (atomic-components), Regel 04 (naming), Regel 05 (ui-stack), Regel 11 (testing)

## Kontext

Verwende diesen Skill wenn:
- Eine neue Vue 3 Komponente benötigt wird
- Die Komponente Composition API + TypeScript verwenden soll
- Tests und Dokumentation mitgeliefert werden sollen

## Voraussetzungen

- Vue 3 + Composition API Projekt
- TypeScript konfiguriert
- Tailwind CSS für Styling
- Vitest + Vue Testing Library für Tests
- COMPONENTS.md existiert in `/docs/`

## Workflow

### Schritt 1: Anforderungen sammeln

Erfrage vom User (falls nicht angegeben):
- Komponenten-Name (nach Regel 04: [Entity][Type])
- Props mit Typen
- Events/Emits
- Slots
- Varianten (size, variant, theme)
- States (default, hover, loading, error, disabled)

### Schritt 2: Interface definieren

```typescript
// types/components.ts oder inline

interface [ComponentName]Props {
  // Required props
  entityProp: EntityType
  
  // Optional props mit Defaults
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  
  // Passthrough
  class?: string
}

interface [ComponentName]Emits {
  (e: 'click', payload: ClickPayload): void
  (e: 'change', value: string): void
}
```

### Schritt 3: Komponente erstellen

```vue
<template>
  <component
    :is="as"
    :class="[
      // Base classes
      'inline-flex items-center justify-center',
      'font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2',
      
      // Size variants
      sizeClasses,
      
      // Style variants
      variantClasses,
      
      // States
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        'cursor-pointer': !disabled && !loading,
      },
      
      // Passthrough
      props.class,
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Loading State -->
    <Loader2 
      v-if="loading" 
      class="w-4 h-4 mr-2 animate-spin" 
    />
    
    <!-- Icon Slot -->
    <slot name="icon" />
    
    <!-- Default Content -->
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

// Props
interface Props {
  as?: string | object
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Computed: Size Classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-base rounded-lg',
    lg: 'h-12 px-6 text-lg rounded-xl',
  }
  return sizes[props.size]
})

// Computed: Variant Classes
const variantClasses = computed(() => {
  const variants = {
    primary: [
      'bg-brand-500 text-white',
      'hover:bg-brand-600',
      'dark:bg-brand-600 dark:hover:bg-brand-500',
    ],
    secondary: [
      'bg-gray-100 text-gray-900',
      'hover:bg-gray-200',
      'dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
    ],
    ghost: [
      'bg-transparent text-gray-700',
      'hover:bg-gray-100',
      'dark:text-gray-300 dark:hover:bg-gray-800',
    ],
  }
  return variants[props.variant]
})

// Handlers
function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
```

### Schritt 4: Tests erstellen

```typescript
// __tests__/components/[ComponentName].test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import [ComponentName] from '@/components/[ComponentName].vue'

describe('[ComponentName]', () => {
  // Default Props für Tests
  const defaultProps = {
    // Basis-Props hier
  }

  describe('Rendering', () => {
    it('renders default state correctly', () => {
      const wrapper = mount([ComponentName], { props: defaultProps })
      expect(wrapper.exists()).toBe(true)
    })

    it('renders all size variants', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      sizes.forEach(size => {
        const wrapper = mount([ComponentName], { 
          props: { ...defaultProps, size } 
        })
        expect(wrapper.classes()).toContain(/* size-specific class */)
      })
    })

    it('renders all style variants', () => {
      const variants = ['primary', 'secondary', 'ghost'] as const
      variants.forEach(variant => {
        const wrapper = mount([ComponentName], { 
          props: { ...defaultProps, variant } 
        })
        expect(wrapper.classes()).toContain(/* variant-specific class */)
      })
    })
  })

  describe('States', () => {
    it('shows loading state with spinner', () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, loading: true } 
      })
      expect(wrapper.find('[data-testid="loader"]').exists()).toBe(true)
    })

    it('is disabled when disabled prop is true', () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, disabled: true } 
      })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('is disabled when loading', () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, loading: true } 
      })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  describe('Events', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount([ComponentName], { props: defaultProps })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, disabled: true } 
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, loading: true } 
      })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('Slots', () => {
    it('renders default slot content', () => {
      const wrapper = mount([ComponentName], {
        props: defaultProps,
        slots: { default: 'Click me' }
      })
      expect(wrapper.text()).toContain('Click me')
    })

    it('renders icon slot', () => {
      const wrapper = mount([ComponentName], {
        props: defaultProps,
        slots: { icon: '<span data-testid="icon">🔥</span>' }
      })
      expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has correct aria attributes when disabled', () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, disabled: true } 
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('has correct aria-busy when loading', () => {
      const wrapper = mount([ComponentName], { 
        props: { ...defaultProps, loading: true } 
      })
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })
})
```

### Schritt 5: Dokumentation aktualisieren

Füge zu `docs/COMPONENTS.md` hinzu:

```markdown
### [ComponentName] (`components/[ComponentName].vue`)

**Beschreibung:** [Kurze Beschreibung]

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size variant |
| disabled | boolean | false | Disable interaction |
| loading | boolean | false | Show loading state |

**Events:**
| Event | Payload | Description |
|-------|---------|-------------|
| click | MouseEvent | Emitted on click |

**Slots:**
| Slot | Description |
|------|-------------|
| default | Button content |
| icon | Icon before content |

**Usage:**
```vue
<[ComponentName] variant="primary" size="md" @click="handleClick">
  Click me
</[ComponentName]>
```
```

## Beispiel-Anwendung

**User-Anfrage:**
```
Erstelle eine UserStatusBadge Komponente:
- Zeigt Online/Offline/Away Status
- Props: status ('online' | 'offline' | 'away'), size
- Grüner Dot für online, grau für offline, gelb für away
```

**Output:**
- `components/UserStatusBadge.vue`
- `__tests__/components/UserStatusBadge.test.ts`
- Update in `docs/COMPONENTS.md`

## Anti-Patterns

❌ **Inline-Styles verwenden**
```vue
<div style="padding: 16px;">  <!-- FALSCH -->
```

✅ **Tailwind-Klassen verwenden**
```vue
<div class="p-4">  <!-- RICHTIG -->
```

---

❌ **Keine TypeScript-Typen**
```vue
const props = defineProps(['variant', 'size'])  <!-- FALSCH -->
```

✅ **Typisierte Props**
```vue
interface Props { variant: 'a' | 'b'; size: 'sm' | 'md' }
const props = defineProps<Props>()  <!-- RICHTIG -->
```

---

❌ **Tests vergessen**
```
components/
└── NewComponent.vue  <!-- Ohne Tests -->
```

✅ **Mit Tests**
```
components/
└── NewComponent.vue
__tests__/components/
└── NewComponent.test.ts
```

## Checkliste

- [ ] Name folgt [Entity][Type] Convention?
- [ ] TypeScript Interface für Props?
- [ ] Alle Variants implementiert?
- [ ] Alle States (loading, disabled, error)?
- [ ] Dark-Mode mit `dark:` Prefix?
- [ ] Tailwind-Klassen (keine inline-Styles)?
- [ ] Events mit typed Emits?
- [ ] Unit-Tests für alle Props/States?
- [ ] COMPONENTS.md aktualisiert?
- [ ] Accessibility-Attribute (aria-*)?
