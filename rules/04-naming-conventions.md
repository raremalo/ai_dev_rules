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
