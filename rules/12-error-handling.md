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
