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
